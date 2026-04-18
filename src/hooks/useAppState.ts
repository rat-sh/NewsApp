import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

/**
 * Calls `onForeground` whenever the app transitions from background → active.
 * Useful for refetching stale data when the user returns to the app.
 */
export function useAppState(onForeground: () => void): void {
    const appState = useRef<AppStateStatus>(AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener(
            'change',
            (nextState: AppStateStatus) => {
                const prev = appState.current;
                appState.current = nextState;

                // Trigger only on background/inactive → active transition
                if (
                    (prev === 'background' || prev === 'inactive') &&
                    nextState === 'active'
                ) {
                    onForeground();
                }
            },
        );

        return () => subscription.remove();
    }, [onForeground]);
}