import { useAudio } from '@/src/context/AudioContext';
import { getAudioUri, getPdfUri } from '@/src/constants/bundledAssets';
import { getAudioDuration } from '@/src/utils/audioDurations';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useAudioPlayerStatus } from 'expo-audio';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
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
    lessonNumber: number; // Add this to get pre-calculated duration
}

const LocalFileProgress: React.FC<ProgressProps> = ({ player, onSeek, accentColor, lessonNumber }) => {
    const status = useAudioPlayerStatus(player);
    const position =
        typeof status.currentTime === 'number' && !isNaN(status.currentTime)
            ? status.currentTime * 1000
            : 0;
    
    // Use actual duration from player if available, otherwise use pre-calculated
    const actualDuration =
        typeof status.duration === 'number' && !isNaN(status.duration) && status.duration > 0
            ? status.duration * 1000
            : 0;
    const estimatedDuration = getAudioDuration(lessonNumber);
    const duration = actualDuration > 0 ? actualDuration : estimatedDuration;

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
                        <Text style={progress.timeText}>{fmt(duration)}</Text>
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
interface LocalFileListItemProps {
    file: DriveFile;
    index?: number;
    onPlay?: (uri: string, title?: string, queue?: any[], fileId?: string) => void;
    onPause?: () => void;
    onSeek?: (value: number) => void;
    isPlaying?: boolean;
    isCurrent?: boolean;
    isAudioLoading?: boolean;
    onAddNote?: (file: DriveFile) => void;
    categoryPdf?: DriveFile | null;
    pdfLocalUri?: string | null;
}

export const LocalFileListItem: React.FC<LocalFileListItemProps> = ({
    file,
    index = 0,
    onPlay,
    onPause,
    onSeek,
    isPlaying,
    isCurrent,
    isAudioLoading,
    onAddNote,
    categoryPdf,
    pdfLocalUri,
}) => {
    const router = useRouter();
    const { player, playbackRate, setPlaybackRate } = useAudio();
    const [localUri, setLocalUri] = React.useState<string>('');

    const badgeColor = getBadgeColor(index);
    const lessonNumber = index + 1; // Start from 1 since we have parts 1-20
    
    // Load asset URI on mount
    React.useEffect(() => {
        const loadUri = async () => {
            try {
                if (file.type === 'audio') {
                    const uri = await getAudioUri(lessonNumber);
                    setLocalUri(uri);
                } else {
                    const uri = await getPdfUri();
                    setLocalUri(uri);
                }
            } catch (error) {
                console.error('Error loading asset URI:', error);
            }
        };
        loadUri();
    }, [file.type, lessonNumber]);

    // Speeds cycle
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    const handleSpeedCycle = () => {
        const next = (speeds.indexOf(playbackRate) + 1) % speeds.length;
        setPlaybackRate(speeds[next]);
    };

    const handleOpenPdf = () => {
        // Simply navigate to internal PDF viewer
        // The internal viewer will handle the bundled PDF without needing internet
        router.push({
            pathname: '/pdf-viewer',
            params: { 
                url: localUri || '', 
                remoteUrl: '', 
                name: file.name 
            },
        });
    };

    const handleAudioPress = () => {
        if (!localUri) return;
        if (isCurrent && isPlaying && onPause) {
            onPause();
        } else if (onPlay) {
            onPlay(localUri, file.name, undefined, file.id);
        }
    };

    // ── Right-side action ──────────────────────────────────────────────────────
    const renderAction = () => {
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
                    جاهز للتشغيل فوراً ⚡
                </Text>
            </View>

            {/* Action */}
            {renderAction()}

            {/* Progress bar when current */}
            {isCurrent && file.type === 'audio' && player && (
                <View style={styles.progressWrap}>
                    <LocalFileProgress
                        player={player}
                        onSeek={onSeek}
                        accentColor={badgeColor}
                        lessonNumber={lessonNumber}
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
        color: '#10b981',
        marginTop: 3,
        fontWeight: '600',
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
