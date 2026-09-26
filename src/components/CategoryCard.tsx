import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Category } from '../types';

interface CategoryCardProps {
    category: Category;
    onPress: () => void;
    index?: number;
}

// Each category gets its own vivid color pair
const CARD_THEMES = [
    { grad: ['#1a1a2e', '#16213e', '#0f3460'] as const, accent: '#e94560', icon: 'book' },
    { grad: ['#0d1b2a', '#1b4332', '#2d6a4f'] as const, accent: '#52b788', icon: 'headset' },
    { grad: ['#1a0533', '#2d1b69', '#11998e'] as const, accent: '#a78bfa', icon: 'musical-notes' },
    { grad: ['#1a1a1a', '#2c3e50', '#3498db'] as const, accent: '#60a5fa', icon: 'library' },
    { grad: ['#2d1515', '#7b2d00', '#c05621'] as const, accent: '#fb923c', icon: 'book-outline' },
    { grad: ['#0a1628', '#1e3a5f', '#2563eb'] as const, accent: '#38bdf8', icon: 'headset-outline' },
    { grad: ['#1a0a2e', '#4a1942', '#c026d3'] as const, accent: '#e879f9', icon: 'musical-note' },
    { grad: ['#0f2027', '#203a43', '#2c5364'] as const, accent: '#34d399', icon: 'library-outline' },
    { grad: ['#1f1c2c', '#928dab', '#4a4a8a'] as const, accent: '#c7d2fe', icon: 'book' },
    { grad: ['#0b3d0b', '#1a5c1a', '#2e7d32'] as const, accent: '#86efac', icon: 'headset' },
    { grad: ['#2d0a0a', '#7f1d1d', '#b91c1c'] as const, accent: '#fca5a5', icon: 'musical-notes' },
    { grad: ['#0c1445', '#1a237e', '#283593'] as const, accent: '#93c5fd', icon: 'library' },
    { grad: ['#1a2a1a', '#2d5a27', '#4caf50'] as const, accent: '#a3e635', icon: 'book-outline' },
];

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress, index = 0 }) => {
    const theme = CARD_THEMES[index % CARD_THEMES.length];
    const audioCount = category.files.filter(f => f.type === 'audio').length;
    const pdfCount = category.files.filter(f => f.type === 'pdf').length;

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={onPress}
        >
            <LinearGradient
                colors={theme.grad}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Glowing accent strip on left */}
            <View style={[styles.accentStrip, { backgroundColor: theme.accent }]} />

            {/* Watermark icon */}
            <View style={styles.watermark} pointerEvents="none">
                <Ionicons name={theme.icon as any} size={90} color={theme.accent} style={{ opacity: 0.07 }} />
            </View>

            <View style={styles.content}>
                {/* Icon */}
                <View style={[styles.iconWrap, { backgroundColor: theme.accent + '22', borderColor: theme.accent + '44' }]}>
                    <Ionicons name={theme.icon as any} size={26} color={theme.accent} />
                </View>

                {/* Text */}
                <View style={styles.textWrap}>
                    <Text style={styles.title} numberOfLines={1}>{category.title}</Text>
                    {category.description ? (
                        <Text style={[styles.desc, { color: theme.accent + 'cc' }]} numberOfLines={1}>
                            {category.description}
                        </Text>
                    ) : null}

                    {/* Pills */}
                    <View style={styles.pills}>
                        {audioCount > 0 && (
                            <View style={[styles.pill, { backgroundColor: theme.accent + '25' }]}>
                                <Ionicons name="headset-outline" size={11} color={theme.accent} />
                                <Text style={[styles.pillText, { color: theme.accent }]}>
                                    {audioCount} ኦዲዮ
                                </Text>
                            </View>
                        )}
                        {pdfCount > 0 && (
                            <View style={[styles.pill, { backgroundColor: '#ffffff18' }]}>
                                <Ionicons name="document-text-outline" size={11} color="#fff" />
                                <Text style={[styles.pillText, { color: '#ffffffcc' }]}>
                                    {pdfCount} PDF
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Arrow */}
                <View style={[styles.arrow, { backgroundColor: theme.accent + '22', borderColor: theme.accent + '44' }]}>
                    <Ionicons name="chevron-forward" size={18} color={theme.accent} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
        marginVertical: 6,
        borderRadius: 20,
        overflow: 'hidden',
        minHeight: 100,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
    },
    accentStrip: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
    watermark: {
        position: 'absolute',
        right: 50,
        top: '50%',
        marginTop: -45,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 16,
    },
    iconWrap: {
        width: 52,
        height: 52,
        borderRadius: 16,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    textWrap: {
        flex: 1,
    },
    title: {
        fontSize: 17,
        fontWeight: '800',
        color: '#ffffff',
        letterSpacing: -0.3,
        marginBottom: 3,
    },
    desc: {
        fontSize: 12,
        marginBottom: 8,
        lineHeight: 16,
    },
    pills: {
        flexDirection: 'row',
        gap: 6,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 20,
    },
    pillText: {
        fontSize: 11,
        fontWeight: '700',
    },
    arrow: {
        width: 34,
        height: 34,
        borderRadius: 17,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
});
