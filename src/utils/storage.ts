import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
    REDUX_PERSIST: 'newsapp_redux',
    LAST_FETCH: 'newsapp_last_fetch',
} as const;

export { KEYS };

/**
 * Generic get with JSON parsing
 */
export async function getItem<T>(key: string): Promise<T | null> {
    try {
        const value = await AsyncStorage.getItem(key);
        return value ? (JSON.parse(value) as T) : null;
    } catch {
        return null;
    }
}

/**
 * Generic set with JSON serialisation
 */
export async function setItem<T>(key: string, value: T): Promise<void> {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Silently fail — non-critical
    }
}

/**
 * Remove a key
 */
export async function removeItem(key: string): Promise<void> {
    try {
        await AsyncStorage.removeItem(key);
    } catch {
        // Silently fail
    }
}

/**
 * Record the time of last successful headlines fetch so we know
 * whether to refetch when the app comes back to foreground.
 */
export async function recordFetchTimestamp(): Promise<void> {
    await setItem(KEYS.LAST_FETCH, Date.now());
}

/**
 * Returns true if the last fetch was more than `thresholdMs` ago
 * (default 5 minutes), meaning we should refetch stale data.
 */
export async function isFetchStale(thresholdMs = 5 * 60 * 1000): Promise<boolean> {
    const last = await getItem<number>(KEYS.LAST_FETCH);
    if (!last) return true;
    return Date.now() - last > thresholdMs;
}