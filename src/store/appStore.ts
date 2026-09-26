import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '../services/storage';

interface MediaProgress {
    position: number;
    duration: number;
    lastUpdated: number;
}

export interface RecentItem {
    id: string;
    name: string;
    type: 'audio' | 'pdf';
    url: string;
    categoryId: string;
    categoryTitle: string;
    accessedAt: number;
}

const MAX_RECENT = 10;

interface AppState {
    lastScreen: string | null;
    setLastScreen: (screen: string) => void;

    progress: Record<string, MediaProgress>;
    saveProgress: (id: string, position: number, duration: number) => void;
    getProgress: (id: string) => MediaProgress | null;

    recentItems: RecentItem[];
    addRecentItem: (item: Omit<RecentItem, 'accessedAt'>) => void;

    themePreference: 'light' | 'dark' | 'system';
    setThemePreference: (theme: 'light' | 'dark' | 'system') => void;

    isAppActive: boolean;
    setAppActive: (active: boolean) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            lastScreen: null,
            setLastScreen: (screen) => set({ lastScreen: screen }),

            progress: {},
            saveProgress: (id, position, duration) => {
                set((state) => ({
                    progress: {
                        ...state.progress,
                        [id]: { position, duration, lastUpdated: Date.now() },
                    },
                }));
            },
            getProgress: (id) => get().progress[id] || null,

            recentItems: [],
            addRecentItem: (item) => {
                set((state) => {
                    const filtered = state.recentItems.filter((r) => r.id !== item.id);
                    const updated = [
                        { ...item, accessedAt: Date.now() },
                        ...filtered,
                    ].slice(0, MAX_RECENT);
                    return { recentItems: updated };
                });
            },

            themePreference: 'dark',
            setThemePreference: (theme) => set({ themePreference: theme }),

            isAppActive: true,
            setAppActive: (active) => set({ isAppActive: active }),
        }),
        {
            name: 'app-storage',
            storage: createJSONStorage(() => mmkvStorage),
            partialize: (state) => ({
                lastScreen: state.lastScreen,
                progress: state.progress,
                themePreference: state.themePreference,
                recentItems: state.recentItems,
            }),
        }
    )
);
