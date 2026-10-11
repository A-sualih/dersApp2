import { LocalFileListItem } from '@/src/components/LocalFileListItem';
import { NoteModal } from '@/src/components/NoteModal';
import { CATEGORIES } from '@/src/constants/mockData';
import { AmharicFonts, FontSizes, TextShadows } from '@/src/constants/fonts';
import { useAudio } from '@/src/context/AudioContext';
import { useNotes } from '@/src/context/NoteContext';
import { DriveFile } from '@/src/types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type TabType = 'audio' | 'pdf';

export default function DerseDetailScreen() {
    const router = useRouter();
    const { categoryId, fileId } = useLocalSearchParams<{ categoryId: string; fileId?: string }>();
    const { addNote } = useNotes();
    const [noteFile, setNoteFile] = useState<DriveFile | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('audio');

    const category = CATEGORIES.find(c => c.id === categoryId);

    const audioFiles = useMemo(
        () => (category?.files ?? []).filter(f => f.type === 'audio'),
        [category]
    );
    const pdfFiles = useMemo(
        () => (category?.files ?? []).filter(f => f.type === 'pdf'),
        [category]
    );

    // The first PDF in the category (used for "open at page" from audio items)
    const categoryPdf = pdfFiles[0] ?? null;

    // Resolve local URI for the category PDF (if downloaded)
    const [pdfLocalUri, setPdfLocalUri] = useState<string | null>(null);
    useEffect(() => {
        if (!categoryPdf) return;
        const { checkFileExists, getLocalUri } = require('@/src/utils/fileSystem');
        checkFileExists(categoryPdf.name).then((exists: boolean) => {
            if (exists) setPdfLocalUri(getLocalUri(categoryPdf.name));
        });
    }, [categoryPdf]);

    const displayedFiles = activeTab === 'audio' ? audioFiles : pdfFiles;

    const {
        playSound,
        pauseSound,
        seekScroll,
        isPlaying,
        currentFileId,
        isLoading,
    } = useAudio();

    // Auto-play a specific file when navigated from recent items
    useEffect(() => {
        if (!fileId) return;
        const targetFile = audioFiles.find(f => f.id === fileId);
        if (!targetFile) return;

        // Switch to audio tab so the file is visible
        setActiveTab('audio');

        // Check if the file is downloaded and play it
        const { checkFileExists, getLocalUri } = require('@/src/utils/fileSystem');
        checkFileExists(targetFile.name).then((exists: boolean) => {
            if (exists) {
                const localUri = getLocalUri(targetFile.name);
                playSound(localUri, targetFile.name, category?.files, targetFile.id);
            }
        });
    }, [fileId]);

    if (!category) {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeArea}>
                    <Text style={{ color: '#fff', padding: 20 }}>Category not found</Text>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* ── Header gradient ── */}
            <LinearGradient
                colors={['#1a6b3c', '#2d8a52', '#1a6b3c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <SafeAreaView edges={['top', 'left', 'right']}>
                    {/* Back row */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backRow}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={22} color="#fff" />
                    </TouchableOpacity>

                    {/* Title row */}
                    <View style={styles.titleRow}>
                        {/* Book icon box */}
                        <View style={styles.bookIconBox}>
                            <Ionicons name="book" size={32} color="#fff" />
                        </View>

                        <View style={styles.titleInfo}>
                            <Text style={styles.categoryTitle} numberOfLines={2}>
                                {category.title}
                            </Text>
                            <Text style={styles.categoryMeta}>
                                {category.files.length} ረሃዲቅ
                                {category.description ? ` • ${category.description}` : ''}
                            </Text>
                        </View>
                    </View>

                    {/* Tab buttons */}
                    <View style={styles.tabRow}>
                        <TouchableOpacity
                            style={[styles.tabBtn, activeTab === 'audio' && styles.tabBtnActive]}
                            onPress={() => setActiveTab('audio')}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name="headset-outline"
                                size={16}
                                color={activeTab === 'audio' ? '#1a6b3c' : '#fff'}
                            />
                            <Text style={[styles.tabBtnText, activeTab === 'audio' && styles.tabBtnTextActive]}>
                                ኦዲዮ
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tabBtn, activeTab === 'pdf' && styles.tabBtnActive]}
                            onPress={() => setActiveTab('pdf')}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name="book-outline"
                                size={16}
                                color={activeTab === 'pdf' ? '#1a6b3c' : '#fff'}
                            />
                            <Text style={[styles.tabBtnText, activeTab === 'pdf' && styles.tabBtnTextActive]}>
                                ኪታብ
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            {/* ── Body ── */}
            <LinearGradient
                colors={['#e8f5ee', '#f0faf4', '#e8f5ee']}
                style={styles.bodyGradient}
            >
                <FlatList
                    data={displayedFiles}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => {
                        const isItemCurrent = currentFileId === item.id;
                        return (
                            <LocalFileListItem
                                file={item}
                                index={index}
                                onPlay={(uri, title) =>
                                    playSound(uri, title, category.files, item.id)
                                }
                                onPause={pauseSound}
                                onSeek={seekScroll}
                                isPlaying={isPlaying}
                                isCurrent={isItemCurrent}
                                isAudioLoading={isLoading}
                                onAddNote={(file) => setNoteFile(file)}
                                categoryPdf={categoryPdf}
                                pdfLocalUri={pdfLocalUri}
                            />
                        );
                    }}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons
                                name={activeTab === 'audio' ? 'headset-outline' : 'book-outline'}
                                size={48}
                                color="rgba(26,107,60,0.25)"
                            />
                            <Text style={styles.emptyText}>
                                {activeTab === 'audio' ? 'ምንም ኦዲዮ የለም' : 'ምንም ኪታብ የለም'}
                            </Text>
                        </View>
                    }
                    contentContainerStyle={styles.listContent}
                />
            </LinearGradient>

            <NoteModal
                visible={!!noteFile}
                onClose={() => setNoteFile(null)}
                onSave={addNote}
                metadata={
                    noteFile
                        ? { fileId: noteFile.id, fileName: noteFile.name }
                        : undefined
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a6b3c',
    },
    safeArea: {
        flex: 1,
    },
    /* ── Header ── */
    headerGradient: {
        paddingBottom: 20,
    },
    backRow: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 4,
        alignSelf: 'flex-start',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
    },
    bookIconBox: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    titleInfo: {
        flex: 1,
    },
    categoryTitle: {
        fontSize: FontSizes.heading,
        ...AmharicFonts.display,
        color: '#fff',
        letterSpacing: 0.8,
        lineHeight: 28,
        ...TextShadows.medium,
    },
    categoryMeta: {
        fontSize: FontSizes.caption,
        color: 'rgba(255,255,255,0.75)',
        ...AmharicFonts.regular,
        marginTop: 4,
        ...TextShadows.soft,
    },
    tabRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 10,
    },
    tabBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    tabBtnActive: {
        backgroundColor: '#fff',
        borderColor: '#fff',
    },
    tabBtnText: {
        fontSize: FontSizes.caption,
        ...AmharicFonts.secondary,
        color: '#fff',
    },
    tabBtnTextActive: {
        color: '#1a6b3c',
    },
    /* ── Body ── */
    bodyGradient: {
        flex: 1,
    },
    listContent: {
        paddingTop: 12,
        paddingHorizontal: 12,
        paddingBottom: 120,
    },
    emptyContainer: {
        paddingTop: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        color: 'rgba(26,107,60,0.5)',
        fontSize: FontSizes.body,
        ...AmharicFonts.regular,
        marginTop: 12,
        ...TextShadows.soft,
    },
});
