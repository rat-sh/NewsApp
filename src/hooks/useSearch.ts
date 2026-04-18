import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchSearchResults, setQuery, clearSearch } from '../store/slices/searchSlice';

const DEBOUNCE_MS = 500;
const MIN_QUERY_LENGTH = 2;

/**
 * Encapsulates search logic:
 * - Controlled query state
 * - Debounced API call (500ms)
 * - Pagination (load more)
 * - Clear search
 */
export function useSearch() {
    const dispatch = useAppDispatch();
    const { query, articles, page, totalResults, status, error } = useAppSelector(
        state => state.search,
    );
    const language = useAppSelector(state => state.preferences.language);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Query change ────────────────────────────────────────────────────────

    const onQueryChange = useCallback(
        (text: string) => {
            dispatch(setQuery(text));

            // Clear existing debounce timer
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }

            if (text.trim().length < MIN_QUERY_LENGTH) {
                dispatch(clearSearch());
                return;
            }

            debounceTimer.current = setTimeout(() => {
                dispatch(fetchSearchResults({ query: text.trim(), page: 1, language }));
            }, DEBOUNCE_MS);
        },
        [dispatch, language],
    );

    // ── Load more ────────────────────────────────────────────────────────────

    const loadMore = useCallback(() => {
        const hasMore = articles.length < totalResults;
        if (!hasMore || status !== 'succeeded') return;
        dispatch(fetchSearchResults({ query, page: page + 1, language }));
    }, [articles.length, totalResults, status, query, page, language, dispatch]);

    // ── Clear ─────────────────────────────────────────────────────────────

    const clear = useCallback(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        dispatch(clearSearch());
    }, [dispatch]);

    // ── Cleanup on unmount ───────────────────────────────────────────────────

    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, []);

    return {
        query,
        articles,
        status,
        error,
        hasMore: articles.length < totalResults,
        onQueryChange,
        loadMore,
        clear,
    };
}