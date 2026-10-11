import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemeProvider as AppThemeProvider } from '@/src/context/ThemeContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import { BackgroundTaskOverlay } from '../src/components/background/BackgroundTaskOverlay';
import { FloatingProgressWidget } from '../src/components/background/FloatingProgressWidget';
import { MiniPlayer } from '../src/components/MiniPlayer';
import { AudioProvider } from '../src/context/AudioContext';
import { BackgroundTaskProvider } from '../src/context/BackgroundTaskContext';
import { NoteProvider } from '../src/context/NoteContext';
import { UserProvider } from '../src/context/UserContext';
import { useAppLifecycle } from '../src/hooks/useAppLifecycle';
import { useOTAUpdate } from '../src/hooks/useOTAUpdate';


export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <AudioProvider>
        <UserProvider>
          <NoteProvider>
            <BackgroundTaskProvider>
              <LayoutContent />
            </BackgroundTaskProvider>
          </NoteProvider>
        </UserProvider>
      </AudioProvider>

    </AppThemeProvider>
  );
}

function LayoutContent() {
  const colorScheme = useColorScheme();
  const { onFetchUpdateAsync } = useOTAUpdate();
  const { currentState } = useAppLifecycle();

  React.useEffect(() => {
    console.log(`[Root] App is in state: ${currentState}`);
  }, [currentState]);

  React.useEffect(() => {
    // Clear old storage and copy local assets
    const initializeApp = async () => {
      try {
        // Preload all bundled assets first
        const { preloadAllAssets } = require('../src/constants/bundledAssets');
        await preloadAllAssets();
        console.log('✅ All assets preloaded');
        
        // Clear AsyncStorage to remove old data
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.clear();
        console.log('Cleared AsyncStorage');
        
        // Clear MMKV storage if exists
        try {
          const { useAppStore } = require('../src/store/appStore');
          const { useMediaPlayerStore } = require('../src/store/mediaPlayerStore');
          useAppStore.persist.clearStorage();
          useMediaPlayerStore.persist.clearStorage();
          console.log('Cleared Zustand stores');
        } catch (e) {
          console.log('No Zustand stores to clear');
        }
        
        // Local assets are loaded directly via bundled assets
        // No need for manual copying anymore
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };
    
    initializeApp();
    
    // Only check for OTA updates once on initial mount, not on every foreground/background transition
    if (!__DEV__) {
      onFetchUpdateAsync();
    }
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="pdf-viewer" options={{ title: 'PDF Viewer' }} />
          <Stack.Screen name="about" options={{ headerShown: false }} />
          <Stack.Screen name="derse-detail" options={{ headerShown: false }} />
        </Stack>
        <MiniPlayer />
        <BackgroundUI />
      </View>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

function BackgroundUI() {
  const [showOverlay, setShowOverlay] = React.useState(false);
  
  return (
    <>
      <FloatingProgressWidget onPress={() => setShowOverlay(true)} />
      <BackgroundTaskOverlay visible={showOverlay} onClose={() => setShowOverlay(false)} />
    </>
  );
}
