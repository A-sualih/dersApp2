import { useAudio } from '@/src/context/AudioContext';
import { useFileDownloader } from '@/src/hooks/useFileDownloader';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useAudioPlayerStatus } from 'expo-audio';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    Alert,
    Linking,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { DriveFile } from '../types';

// ─── Badge colours cycling through green shades ───────────────────────────────
const BADGE_COLORS = [
    '#2d8a52', // deep green
    '#7c3aed', // purple
    '#1a6b3c', // dark green
    '#0ea5e9', // sky blue
    '#d97706', // amber
    '#dc2626', // red
    '#0891b2', // cyan
];

function getBadgeColor(index: number) {
    return BADGE_COLORS[index % BADGE_COLORS.length];
}

// ─── Progress bar shown when item is currently playing ────────────────────────
interface ProgressProps {
    player: any;
    onSeek?: (value: number) => void;
    accentColor: string;
}

const FileListItemProgress: React.FC<ProgressProps> = ({ player, onSeek, accentColor }) => {
    const status = useAudioPlayerStatus(player);
    const position =
        typeof status.currentTime === 'number' && !isNaN(status.currentTime)
            ? status.currentTime * 1000
            : 0;
    const duration =
        typeof status.duration === 'number' && !isNaN(status.duration)
            ? status.duration * 1000
            : 0;

    const fmt = (ms: number) => {
        const s = Math.max(0, Math.floor((ms || 0) / 1000));
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec < 10 ? '0' : ''}${sec}`;
    };

    return (
        <View style={progress.wrap}>
            <View style={progress.row}>
                {/* -10s */}
                <TouchableOpacity
                    onPress={() => onSeek?.(Math.max(0, position - 10000))}
                    style={[progress.skipBtn, { backgroundColor: accentColor + '22' }]}
                >
                    <Ionicons name="play-back" size={14} color={accentColor} />
                    <Text style={[progress.skipLabel, { color: accentColor }]}>10s</Text>
                </TouchableOpacity>

                <View style={{ flex: 1, marginHorizontal: 10 }}>
                    <Slider
                        style={progress.slider}
                        minimumValue={0}
                        maximumValue={duration > 0 ? duration : 100}
                        disabled={duration === 0}
                        value={position}
                        onSlidingComplete={onSeek}
                        minimumTrackTintColor={accentColor}
                        maximumTrackTintColor="rgba(0,0,0,0.15)"
                        thumbTintColor={accentColor}
                    />
                    <View style={progress.times}>
                        <Text style={progress.timeText}>{fmt(position)}</Text>
                        <Text style={progress.timeText}>{duration > 0 ? fmt(duration) : '--:--'}</Text>
                    </View>
                </View>

                {/* +10s */}
                <TouchableOpacity
                    onPress={() =>
                        onSeek?.(duration > 0 ? Math.min(duration, position + 10000) : position + 10000)
                    }
                    style={[progress.skipBtn, { backgroundColor: accentColor + '22' }]}
                >
                    <Ionicons name="play-forward" size={14} color={accentColor} />
                    <Text style={[progress.skipLabel, { color: accentColor }]}>10s</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// ─── Main component ────────────────────────────────────────────────────────────
interface FileListItemProps {
    file: DriveFile;
    index?: number;
    onPlay?: (uri: string, title?: string, queue?: any[], fileId?: string) => void;
    onPause?: () => void;
    onSeek?: (value: number) => void;
    onAddNote?: (file: DriveFile) => void;
    isPlaying?: boolean;
    isCurrent?: boolean;
    isAudioLoading?: boolean;
    /** The PDF file for this category (used to open PDF at the matching lesson page) */
    categoryPdf?: DriveFile | null;
    /** Local URI of the category PDF if already downloaded */
    pdfLocalUri?: string | null;
}

export const FileListItem: React.FC<FileListItemProps> = ({
    file,
    index = 0,
    onPlay,
    onPause,
    onSeek,
    onAddNote,
    isPlaying,
    isCurrent,
    isAudioLoading,
    categoryPdf,
    pdfLocalUri,
}) => {
    const { downloaded, loading, download, remove, localUri } = useFileDownloader(
        file.name,
        file.url
    );
    const router = useRouter();
    const { player, playbackRate, setPlaybackRate } = useAudio();

    const badgeColor = getBadgeColor(index);
    const lessonNumber = index + 1;

    // Speeds cycle
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    const handleSpeedCycle = () => {
        const next = (speeds.indexOf(playbackRate) + 1) % speeds.length;
        setPlaybackRate(speeds[next]);
    };

    const handleOpenPdf = async () => {
        if (!localUri || !downloaded) return;
        if (Platform.OS === 'web') {
            Linking.openURL(localUri);
            return;
        }
        // Track as recent item
        const { CATEGORIES } = require('../constants/mockData');
        const parentCat = CATEGORIES.find((c: any) => c.files.some((f: any) => f.id === file.id));
        if (parentCat) {
            const { useAppStore } = require('../store/appStore');
            useAppStore.getState().addRecentItem({
                id: file.id,
                name: file.name,
                type: 'pdf',
                url: file.url,
                categoryId: parentCat.id,
                categoryTitle: parentCat.title,
            });
        }
        router.push({
            pathname: '/pdf-viewer',
            params: { url: localUri, remoteUrl: file.url, name: file.name },
        });
    };

    /**
     * Get the PDF page for this audio file.
     * Uses file.pdfPage if set (exact mapping), otherwise falls back to
     * the lesson number extracted from the filename.
     */
    const getLessonNumber = (): number => {
        if (file.pdfPage && file.pdfPage > 0) return file.pdfPage;
        const match = file.name.match(/(\d+)(?:\.\w+)?$/);
        return match ? parseInt(match[1], 10) : index + 1;
    };

    /** Open the category PDF at the page matching this audio lesson number */
    const handleOpenPdfAtPage = () => {
        if (!categoryPdf) return;
        const page = getLessonNumber();

        // Use local file if downloaded, otherwise stream from remote URL
        const viewUrl = pdfLocalUri ?? categoryPdf.url;

        if (Platform.OS === 'web') {
            Linking.openURL(categoryPdf.url);
            return;
        }
        router.push({
            pathname: '/pdf-viewer',
            params: {
                url: viewUrl,
                remoteUrl: categoryPdf.url,
                name: categoryPdf.name,
                targetPage: String(page),
            },
        });
    };

    const handleAudioPress = () => {
        if (!localUri || !downloaded) return;
        if (isCurrent && isPlaying && onPause) {
            onPause();
        } else if (onPlay) {
            onPlay(localUri, file.name, undefined, file.id);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'ፋይሉን ሰርዝ',
            `"${file.name.replace(/\.mp3$/i, '')}" ን ከመሳሪያዎ ሰርዝ?`,
            [
                { text: 'አይ', style: 'cancel' },
                {
                    text: 'ሰርዝ',
                    style: 'destructive',
                    onPress: remove,
                },
            ]
        );
    };

    // ── Right-side action ──────────────────────────────────────────────────────
    const renderAction = () => {
        if (loading) {
            return (
                <View style={styles.actionWrap}>
                    <ActivityIndicator size="small" color={badgeColor} />
                </View>
            );
        }

        if (!downloaded) {
            // Show download button
            return (
                <TouchableOpacity
                    onPress={download}
                    style={[styles.circleBtn, { backgroundColor: badgeColor + '18', borderColor: badgeColor + '40' }]}
                    activeOpacity={0.7}
                >
                    <Ionicons name="cloud-download-outline" size={20} color={badgeColor} />
                </TouchableOpacity>
            );
        }

        if (file.type === 'pdf') {
            return (
                <TouchableOpacity
                    onPress={handleOpenPdf}
                    style={[styles.pdfBadge, { backgroundColor: badgeColor }]}
                    activeOpacity={0.8}
                >
                    <Text style={styles.pdfBadgeText}>PDF</Text>
                </TouchableOpacity>
            );
        }

        // Audio — play/pause circle
        return (
            <View style={styles.audioActions}>
                {isCurrent && (
                    <TouchableOpacity
                        onPress={handleSpeedCycle}
                        style={[styles.speedChip, { backgroundColor: badgeColor + '18' }]}
                    >
                        <Text style={[styles.speedChipText, { color: badgeColor }]}>
                            {playbackRate}x
                        </Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    onPress={handleAudioPress}
                    style={[styles.playBtn, { backgroundColor: badgeColor }]}
                    activeOpacity={0.8}
                >
                    {isAudioLoading && isCurrent ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Ionicons
                            name={isCurrent && isPlaying ? 'pause' : 'play'}
                            size={18}
                            color="#fff"
                            style={isCurrent && isPlaying ? undefined : { marginLeft: 2 }}
                        />
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    // ── Card ──────────────────────────────────────────────────────────────────
    return (
        <View
            style={[
                styles.card,
                isCurrent && { borderColor: badgeColor, borderWidth: 1.5 },
            ]}
        >
            {/* Number badge */}
            <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                <Text style={styles.badgeText}>{lessonNumber}</Text>
            </View>

            {/* Info */}
            <View style={styles.info}>
                <Text
                    style={[styles.title, isCurrent && { color: badgeColor }]}
                    numberOfLines={1}
                >
                    {file.name.replace(/\.mp3$/i, '').replace(/\.pdf$/i, '')}
                </Text>
                <Text style={styles.subtitle}>
                    {downloaded
                        ? file.type === 'audio'
                            ? isCurrent
                                ? 'እየተጫወተ ነው'
                                : 'ዝግጁ'
                            : 'ዝግጁ'
                        : 'ለማውረድ ዝግጁ'}
                </Text>
            </View>

            {/* Action */}
            {renderAction()}

            {/* Note button (only when downloaded audio) */}
            {downloaded && file.type === 'audio' && (
                <TouchableOpacity
                    onPress={() => onAddNote?.(file)}
                    style={styles.noteBtn}
                    activeOpacity={0.7}
                >
                    <Ionicons name="create-outline" size={18} color="#94a3b8" />
                </TouchableOpacity>
            )}

            {/* Delete button — shown when file is downloaded */}
            {downloaded && (
                <TouchableOpacity
                    onPress={handleDelete}
                    style={styles.deleteBtn}
                    activeOpacity={0.7}
                >
                    <Ionicons name="trash-outline" size={17} color="#f87171" />
                </TouchableOpacity>
            )}

            {/* Progress bar when current */}
            {isCurrent && file.type === 'audio' && player && (
                <View style={styles.progressWrap}>
                    <FileListItemProgress
                        player={player}
                        onSeek={onSeek}
                        accentColor={badgeColor}
                    />
                </View>
            )}
        </View>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 10,
        paddingHorizontal: 14,
        paddingVertical: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 3,
        flexWrap: 'wrap',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    badge: {
        width: 38,
        height: 38,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    badgeText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '800',
    },
    info: {
        flex: 1,
        marginRight: 8,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1e293b',
        letterSpacing: -0.2,
    },
    subtitle: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 3,
    },
    actionWrap: {
        width: 40,
        alignItems: 'center',
    },
    circleBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    audioActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    speedChip: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    speedChipText: {
        fontSize: 11,
        fontWeight: '800',
    },
    pdfBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    pdfBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    noteBtn: {
        padding: 6,
        marginLeft: 4,
    },
    deleteBtn: {
        padding: 6,
        marginLeft: 4,
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(248,113,113,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressWrap: {
        width: '100%',
        marginTop: 8,
    },
});

const progress = StyleSheet.create({
    wrap: {
        paddingTop: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    skipBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    skipLabel: {
        fontSize: 9,
        fontWeight: '700',
        marginTop: -2,
    },
    slider: {
        height: 28,
    },
    times: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: -4,
    },
    timeText: {
        fontSize: 11,
        color: '#64748b',
        fontWeight: '500',
    },
});
