import { useState, useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

interface NetworkState {
    isConnected: boolean;
    isInternetReachable: boolean;
}

/**
 * Subscribe to network state. Returns a stable object with
 * isConnected and isInternetReachable.
 *
 * Used to gate the AI chatbot FAB — it's disabled when offline.
 */
export function useNetInfo(): NetworkState {
    const [networkState, setNetworkState] = useState<NetworkState>({
        isConnected: true,
        isInternetReachable: true,
    });

    useEffect(() => {
        // Get initial state
        NetInfo.fetch().then((state: NetInfoState) => {
            setNetworkState({
                isConnected: state.isConnected ?? true,
                isInternetReachable: state.isInternetReachable ?? true,
            });
        });

        const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
            setNetworkState({
                isConnected: state.isConnected ?? true,
                isInternetReachable: state.isInternetReachable ?? true,
            });
        });

        return () => unsubscribe();
    }, []);

    return networkState;
}