import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import NativePdf from '@/src/components/NativePdf';
import { NotesManagerModal } from '@/src/components/NotesManagerModal';

import { Ionicons } from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PdfViewer() {
    const { url, remoteUrl, name, targetPage: targetPageParam } = useLocalSearchParams<{ url: string; remoteUrl: string; name: string; targetPage?: string }>();
    const router = useRouter();

    // Initialise directly from param so NativePdf gets the right page on first render
    const initialPage = targetPageParam ? Math.max(1, parseInt(targetPageParam, 10) || 1) : 1;
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [isPageLoaded, setIsPageLoaded] = useState(!!targetPageParam); // skip AsyncStorage if param given
    const [notesModalVisible, setNotesModalVisible] = useState(false);
    const [isPdfReady, setIsPdfReady] = useState(false);

    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const persistenceKey = `pdf_res_page_${name}`;

    useEffect(() => {
        // If a page was passed via nav params, don't overwrite it with the saved page
        if (targetPageParam) return;

        const loadPage = async () => {
            try {
                const saved = await AsyncStorage.getItem(persistenceKey);
                if (saved && !isPageLoaded) {
                    setCurrentPage(parseInt(saved, 10));
                }
            } catch (e) {
            } finally {
                setIsPageLoaded(true);
            }
        };
        loadPage();
    }, [name, persistenceKey]);

    // PDF is ready immediately for bundled assets
    useEffect(() => {
        console.log('PDF Viewer mounted with bundled asset, ready immediately');
        setIsPdfReady(true);
    }, []);

    const [zoom, setZoom] = useState(1.0);

    const handleZoom = (type: 'in' | 'out') => {
        setZoom(prev => {
            if (type === 'in') return Math.min(prev + 0.25, 3.0);
            return Math.max(prev - 0.25, 0.75);
        });
    };

    const handlePageUpdate = (page: number) => {
        AsyncStorage.setItem(persistenceKey, page.toString());
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
            <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={theme.text} />
                </TouchableOpacity>

                <View style={[styles.zoomControls, { backgroundColor: theme.border + '50' }]}>
                    <TouchableOpacity onPress={() => handleZoom('out')} style={styles.zoomBtn}>
                        <Ionicons name="remove" size={20} color={theme.text} />
                    </TouchableOpacity>
                    <View style={styles.zoomDivider} />
                    <Text style={[styles.zoomText, { color: theme.text }]}>{Math.round(zoom * 100)}%</Text>
                    <View style={{ width: 1, height: 16, backgroundColor: theme.border, marginHorizontal: 8 }} />
                    <TouchableOpacity onPress={() => handleZoom('in')} style={styles.zoomBtn}>
                        <Ionicons name="add" size={20} color={theme.text} />
                    </TouchableOpacity>
                </View>

                <View style={styles.headerRight}>
                    <TouchableOpacity
                        onPress={() => setNotesModalVisible(true)}
                        style={[styles.headerBtn, { backgroundColor: theme.tint + '15' }]}
                    >
                        <Ionicons name="document-text" size={20} color={theme.tint} />
                    </TouchableOpacity>
                </View>
            </View>

            <NotesManagerModal
                visible={notesModalVisible}
                onClose={() => setNotesModalVisible(false)}
                currentFileMetadata={{
                    fileId: name || (url as string),
                    fileName: name || 'PDF Document',
                    pageNumber: currentPage
                }}
            />

            <View style={[styles.pdfContainer, { backgroundColor: colorScheme === 'dark' ? '#151718' : '#F8FAFC' }]}>
                {!isPdfReady ? (
                    <View style={[styles.loadingContainer, { backgroundColor: colorScheme === 'dark' ? '#151718' : '#FFFFFF' }]}>
                        <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#4CAF50' : '#2196F3'} />
                        <Text style={[styles.loadingText, { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }]}>
                            Loading PDF...
                        </Text>
                        <Text style={[styles.loadingSubtext, { color: colorScheme === 'dark' ? '#AAAAAA' : '#666666' }]}>
                            Loading PDF, please wait...
                        </Text>
                    </View>
                ) : (
                    <NativePdf
                        url={url as string}
                        remoteUrl={remoteUrl as string}
                        targetPage={currentPage}
                        zoom={zoom}
                        onPageChanged={handlePageUpdate}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    zoomControls: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    zoomBtn: {
        padding: 4,
    },
    zoomDivider: {
        width: 1,
        height: 16,
        backgroundColor: 'rgba(0,0,0,0.1)',
        marginHorizontal: 12,
    },
    zoomText: {
        fontSize: 13,
        fontWeight: '800',
        minWidth: 44,
        textAlign: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pdfContainer: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
    },
    loadingSubtext: {
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
});
