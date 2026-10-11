import * as Updates from 'expo-updates';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';

/**
 * Hook to handle Over-The-Air (OTA) updates using Expo Updates
 * @returns Object containing update state and functions
 */
export function useOTAUpdate() {
    const [isChecking, setIsChecking] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [updateAvailable, setUpdateAvailable] = useState(false);

    // Check for updates on mount in production
    useEffect(() => {
        if (__DEV__ || Platform.OS === 'web') {
            return;
        }

        // Check if updates are enabled
        if (!Updates.isEnabled) {
            console.log('[OTA] Updates are not enabled');
            return;
        }

        console.log('[OTA] Update check on mount');
    }, []);

    /**
     * Check for and download available updates
     */
    const onFetchUpdateAsync = useCallback(async () => {
        // Skip in development or web
        if (__DEV__ || Platform.OS === 'web') {
            console.log('[OTA] Skipping update check in development/web');
            return;
        }

        if (!Updates.isEnabled) {
            console.log('[OTA] Updates are not enabled');
            return;
        }

        try {
            setIsChecking(true);
            console.log('[OTA] Checking for updates...');

            const update = await Updates.checkForUpdateAsync();

            if (update.isAvailable) {
                console.log('[OTA] Update available, downloading...');
                setUpdateAvailable(true);
                setIsDownloading(true);

                await Updates.fetchUpdateAsync();
                
                setIsDownloading(false);
                console.log('[OTA] Update downloaded successfully');

                // Prompt user to reload
                Alert.alert(
                    'Update Available',
                    'A new version has been downloaded. Would you like to restart the app to apply it?',
                    [
                        {
                            text: 'Later',
                            style: 'cancel',
                        },
                        {
                            text: 'Restart Now',
                            onPress: async () => {
                                await Updates.reloadAsync();
                            },
                        },
                    ]
                );
            } else {
                console.log('[OTA] App is up to date');
            }
        } catch (error) {
            console.error('[OTA] Error checking for updates:', error);
            setUpdateAvailable(false);
        } finally {
            setIsChecking(false);
            setIsDownloading(false);
        }
    }, []);

    /**
     * Manually check for updates (alias for onFetchUpdateAsync)
     */
    const checkManually = onFetchUpdateAsync;

    /**
     * Manually reload the app (useful after downloading an update)
     */
    const reloadApp = useCallback(async () => {
        if (Platform.OS === 'web') {
            window.location.reload();
            return;
        }

        try {
            await Updates.reloadAsync();
        } catch (error) {
            console.error('[OTA] Error reloading app:', error);
        }
    }, []);

    return {
        isChecking,
        isDownloading,
        updateAvailable,
        onFetchUpdateAsync,
        checkManually,
        reloadApp,
    };
}
