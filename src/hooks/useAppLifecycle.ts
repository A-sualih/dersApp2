import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

/**
 * Hook to track the app lifecycle state (active, inactive, background)
 * @returns Object containing the current app state
 */
export function useAppLifecycle() {
    const [currentState, setCurrentState] = useState<AppStateStatus>(AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            setCurrentState(nextAppState);
        });

        return () => {
            subscription.remove();
        };
    }, []);

    return {
        currentState,
        isActive: currentState === 'active',
        isBackground: currentState === 'background',
        isInactive: currentState === 'inactive',
    };
}
