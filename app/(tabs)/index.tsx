import { CategoryCard } from '@/src/components/CategoryCard';
import { CATEGORIES } from '@/src/constants/mockData';
import { AmharicFonts, FontSizes, TextShadows } from '@/src/constants/fonts';
import { useBackgroundTasks } from '@/src/context/BackgroundTaskContext';
import { RecentItem, useAppStore } from '@/src/store/appStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Recent item card ─────────────────────────────────────────────────────────
const RECENT_COLORS = [
    { bg: ['#1a1a2e', '#e94560'] as const, icon: '#e94560' },
    { bg: ['#0d1b2a', '#52b788'] as const, icon: '#52b788' },
    { bg: ['#1a0533', '#a78bfa'] as const, icon: '#a78bfa' },
    { bg: ['#0a1628', '#38bdf8'] as const, icon: '#38bdf8' },
    { bg: ['#2d1515', '#fb923c'] as const, icon: '#fb923c' },
    { bg: ['#1a0a2e', '#e879f9'] as const, icon: '#e879f9' },
];

function getRecentColor(index: number) {
    return RECENT_COLORS[index % RECENT_COLORS.length];
}

const RecentCard: React.FC<{ item: RecentItem; index: number; onPress: () => void }> = ({
    item,
    index,
    onPress,
}) => {
    const color = getRecentColor(index);
    const isAudio = item.type === 'audio';
    const label = item.name.replace(/\.mp3$/i, '').replace(/\.pdf$/i, '');

    return (
        <TouchableOpacity style={styles.recentCard} onPress={onPress} activeOpacity={0.82}>
            <LinearGradient
                colors={color.bg}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
            {/* Watermark */}
            <Ionicons
                name={isAudio ? 'musical-notes' : 'book'}
                size={56}
                color={color.icon}
                style={styles.recentWatermark}
            />
            {/* Type badge */}
            <View style={[styles.recentTypeBadge, { backgroundColor: color.icon + '28' }]}>
                <Ionicons
                    name={isAudio ? 'headset-outline' : 'document-text-outline'}
                    size={11}
                    color={color.icon}
                />
                <Text style={[styles.recentTypeTxt, { color: color.icon }]}>
                    {isAudio ? 'ኦዲዮ' : 'PDF'}
                </Text>
            </View>
            {/* Title */}
            <Text style={styles.recentTitle} numberOfLines={2}>{label}</Text>
            {/* Category */}
            <Text style={styles.recentCat} numberOfLines={1}>{item.categoryTitle}</Text>
        </TouchableOpacity>
    );
};

// ─── Home screen ──────────────────────────────────────────────────────────────
export default function App() {
    const router = useRouter();
    const setLastScreen = useAppStore(state => state.setLastScreen);
    const recentItems = useAppStore(state => state.recentItems);

    useEffect(() => { setLastScreen('home'); }, []);

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const { runSimulation } = useBackgroundTasks();
    const handleSync = useCallback(() => runSimulation('Syncing Library...', 'sync'), [runSimulation]);

    const totalAudio = useMemo(
        () => CATEGORIES.reduce((sum, c) => sum + c.files.filter(f => f.type === 'audio').length, 0), []
    );
    const totalPdf = useMemo(
        () => CATEGORIES.reduce((sum, c) => sum + c.files.filter(f => f.type === 'pdf').length, 0), []
    );

    const allTracks = useMemo(() =>
        CATEGORIES.flatMap(cat =>
            cat.files.filter(f => f.type === 'audio').map(f => ({ ...f, categoryTitle: cat.title }))
        ), []);

    const filteredTracks = useMemo(() =>
        searchQuery.trim()
            ? allTracks.filter(t =>
                t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.categoryTitle.toLowerCase().includes(searchQuery.toLowerCase())
            )
            : [],
        [searchQuery, allTracks]
    );

    const handleRecentPress = useCallback((item: RecentItem) => {
        if (item.type === 'pdf') {
            // Find the local URI if downloaded, otherwise use remote URL
            const { checkFileExists, getLocalUri } = require('@/src/utils/fileSystem');
            checkFileExists(item.name).then((exists: boolean) => {
                const localUri = exists ? getLocalUri(item.name) : null;
                router.push({
                    pathname: '/pdf-viewer',
                    params: {
                        url: localUri ?? item.url,
                        remoteUrl: item.url,
                        name: item.name,
                    },
                });
            });
        } else {
            // Audio — open the category detail and auto-play the specific file
            router.push({
                pathname: '/derse-detail',
                params: { categoryId: item.categoryId, fileId: item.id },
            });
        }
    }, [router]);

    const renderSearchItem = useCallback(({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.searchResultItem}
            activeOpacity={0.75}
            onPress={() => {
                const cat = CATEGORIES.find(c => c.files.some(f => f.id === item.id));
                router.push({ pathname: '/derse-detail', params: { categoryId: cat?.id } });
            }}
        >
            <View style={styles.searchResultIcon}>
                <Ionicons name="musical-note" size={18} color="#4ade80" />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.searchResultTitle} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.searchResultSub}>{item.categoryTitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>
    ), [router]);

    const renderCategoryItem = useCallback(({ item, index }: { item: any; index: number }) => (
        <CategoryCard
            category={item}
            index={index}
            onPress={() => router.push({ pathname: '/derse-detail', params: { categoryId: item.id } })}
        />
    ), [router]);

    // Header + recent + stats rendered as FlatList ListHeaderComponent
    const ListHeader = useMemo(() => (
        <>
            {/* Stats banner */}
            <View style={styles.statsBanner}>
                <LinearGradient
                    colors={['#0f3460', '#16213e', '#1a1a2e']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                />
                <View style={styles.statItem}>
                    <Ionicons name="library-outline" size={22} color="#60a5fa" />
                    <Text style={styles.statNumber}>{CATEGORIES.length}</Text>
                    <Text style={styles.statLabel}>ምድቦች</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Ionicons name="headset-outline" size={22} color="#4ade80" />
                    <Text style={styles.statNumber}>{totalAudio}</Text>
                    <Text style={styles.statLabel}>ኦዲዮ</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Ionicons name="document-text-outline" size={22} color="#f472b6" />
                    <Text style={styles.statNumber}>{totalPdf}</Text>
                    <Text style={styles.statLabel}>ኪታቦች</Text>
                </View>
            </View>

            {/* Recent section */}
            {recentItems.length > 0 && (
                <View style={styles.recentSection}>
                    <View style={styles.sectionRow}>
                        <View style={styles.sectionLabelRow}>
                            <View style={styles.sectionDot} />
                            <Text style={styles.sectionTitle}>የቅርብ ጊዜ</Text>
                        </View>
                        <Text style={styles.sectionSub}>{recentItems.length} ንጥሎች</Text>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.recentScroll}
                    >
                        {recentItems.map((item, idx) => (
                            <RecentCard
                                key={item.id}
                                item={item}
                                index={idx}
                                onPress={() => handleRecentPress(item)}
                            />
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Categories label */}
            <View style={styles.sectionRow}>
                <View style={styles.sectionLabelRow}>
                    <View style={[styles.sectionDot, { backgroundColor: '#60a5fa' }]} />
                    <Text style={styles.sectionTitle}>ሁሉም ምድቦች</Text>
                </View>
                <View style={styles.sectionBadge}>
                    <Text style={styles.sectionBadgeText}>{CATEGORIES.length}</Text>
                </View>
            </View>
        </>
    ), [recentItems, totalAudio, totalPdf, handleRecentPress]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={['#050d1a', '#0a1628', '#050d1a']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                {/* Header */}
                <View style={styles.header}>
                    {isSearching ? (
                        <View style={styles.searchBar}>
                            <TouchableOpacity
                                onPress={() => { setIsSearching(false); setSearchQuery(''); }}
                                style={styles.searchBackBtn}
                            >
                                <Ionicons name="arrow-back" size={22} color="#fff" />
                            </TouchableOpacity>
                            <View style={styles.searchInputWrap}>
                                <Ionicons name="search" size={16} color="rgba(255,255,255,0.4)" style={{ marginRight: 8 }} />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="ደርስ ፈልግ..."
                                    placeholderTextColor="rgba(255,255,255,0.35)"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    autoFocus
                                />
                                {searchQuery.length > 0 && (
                                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                                        <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.4)" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    ) : (
                        <View style={styles.headerRow}>
                            <View>
                                <Text style={styles.headerGreeting}>እንኳን ደህና መጡ 👋</Text>
                                <Text style={styles.headerTitle}>ደርሶች</Text>
                            </View>
                            <View style={styles.headerActions}>
                                <TouchableOpacity onPress={() => setIsSearching(true)} style={styles.iconBtn}>
                                    <Ionicons name="search" size={20} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => router.push('/about')} style={styles.iconBtn}>
                                    <Ionicons name="person-circle-outline" size={20} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleSync} style={[styles.iconBtn, styles.syncBtn]}>
                                    <Ionicons name="cloud-upload-outline" size={20} color="#4ade80" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>

                {/* Search results */}
                {isSearching && searchQuery.trim() !== '' ? (
                    <FlatList
                        data={filteredTracks}
                        keyExtractor={item => item.id}
                        renderItem={renderSearchItem}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyWrap}>
                                <Ionicons name="search-outline" size={48} color="rgba(255,255,255,0.15)" />
                                <Text style={styles.emptyText}>"{searchQuery}" አልተገኘም</Text>
                            </View>
                        }
                    />
                ) : (
                    <FlatList
                        data={CATEGORIES}
                        keyExtractor={item => item.id}
                        renderItem={renderCategoryItem}
                        ListHeaderComponent={ListHeader}
                        contentContainerStyle={styles.listContent}
                        initialNumToRender={6}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                        removeClippedSubviews
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#050d1a' },
    safeArea: { flex: 1 },

    /* Header */
    header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerGreeting: { 
        fontSize: FontSizes.caption, 
        color: 'rgba(255,255,255,0.5)', 
        ...AmharicFonts.regular,
        marginBottom: 2,
        ...TextShadows.soft,
    },
    headerTitle: { 
        fontSize: 36, 
        ...AmharicFonts.display,
        color: '#ffffff', 
        letterSpacing: 1.2,
        ...TextShadows.medium,
    },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    iconBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.08)',
        justifyContent: 'center', alignItems: 'center',
    },
    syncBtn: { backgroundColor: 'rgba(74,222,128,0.12)' },

    /* Search */
    searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    searchBackBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.08)',
        justifyContent: 'center', alignItems: 'center',
    },
    searchInputWrap: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        height: 44, borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
        paddingHorizontal: 14,
    },
    searchInput: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '500' },

    /* Stats */
    statsBanner: {
        flexDirection: 'row', marginHorizontal: 20, marginBottom: 24,
        borderRadius: 18, overflow: 'hidden', paddingVertical: 16,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    },
    statItem: { flex: 1, alignItems: 'center', gap: 4 },
    statNumber: { fontSize: 20, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
    statLabel: { 
        fontSize: FontSizes.tiny, 
        color: 'rgba(255,255,255,0.5)', 
        ...AmharicFonts.secondary,
        ...TextShadows.soft,
    },
    statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 4 },

    /* Section rows */
    sectionRow: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20, marginBottom: 12,
    },
    sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    sectionDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4ade80' },
    sectionTitle: { 
        fontSize: FontSizes.body, 
        ...AmharicFonts.primary,
        color: 'rgba(255,255,255,0.85)', 
        letterSpacing: 0.5,
        ...TextShadows.soft,
    },
    sectionSub: { 
        fontSize: FontSizes.small, 
        color: 'rgba(255,255,255,0.35)', 
        ...AmharicFonts.regular,
    },
    sectionBadge: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2,
    },
    sectionBadgeText: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.5)' },

    /* Recent */
    recentSection: { marginBottom: 24 },
    recentScroll: { paddingHorizontal: 20, gap: 12 },
    recentCard: {
        width: 148,
        height: 130,
        borderRadius: 20,
        overflow: 'hidden',
        padding: 14,
        justifyContent: 'flex-end',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    recentWatermark: {
        position: 'absolute',
        right: -8,
        top: -8,
        opacity: 0.12,
    },
    recentTypeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        alignSelf: 'flex-start',
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 8,
        marginBottom: 6,
    },
    recentTypeTxt: { 
        fontSize: FontSizes.tiny, 
        ...AmharicFonts.secondary,
    },
    recentTitle: {
        fontSize: FontSizes.caption,
        ...AmharicFonts.primary,
        color: '#fff',
        letterSpacing: 0.3,
        lineHeight: 17,
        marginBottom: 3,
        ...TextShadows.soft,
    },
    recentCat: { 
        fontSize: FontSizes.tiny, 
        color: 'rgba(255,255,255,0.45)', 
        ...AmharicFonts.regular,
    },

    /* List */
    listContent: { paddingBottom: 120, paddingTop: 4 },

    /* Search results */
    searchResultItem: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 20, paddingVertical: 14,
        borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)', gap: 12,
    },
    searchResultIcon: {
        width: 38, height: 38, borderRadius: 12,
        backgroundColor: 'rgba(74,222,128,0.12)',
        justifyContent: 'center', alignItems: 'center',
    },
    searchResultTitle: { 
        fontSize: FontSizes.body, 
        ...AmharicFonts.secondary,
        color: '#fff',
    },
    searchResultSub: { 
        fontSize: FontSizes.small, 
        color: 'rgba(255,255,255,0.45)', 
        ...AmharicFonts.regular,
        marginTop: 2,
    },

    /* Empty */
    emptyWrap: { paddingTop: 80, alignItems: 'center', gap: 12 },
    emptyText: { 
        color: 'rgba(255,255,255,0.35)', 
        fontSize: FontSizes.body, 
        ...AmharicFonts.regular,
        ...TextShadows.soft,
    },
});
