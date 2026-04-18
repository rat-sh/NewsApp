import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchHeadlines, setCategory } from '../store/slices/headlinesSlice';
import { Category } from '../types';
import { useAppState } from './useAppState';
import { isFetchStale } from '../utils/storage';

/**
 * Encapsulates all headlines fetching logic:
 * - Initial load
 * - Category change
 * - Pull-to-refresh
 * - Infinite scroll (load next page)
 * - Refetch on app foreground if data is stale (>5 min old)
 */
export function useHeadlines() {
    const dispatch = useAppDispatch();
    const { articles, page, totalResults, category, status, refreshing, error } =
        useAppSelector(state => state.headlines);
    const language = useAppSelector(state => state.preferences.language);

    // ── Initial / category load ─────────────────────────────────────────────
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchHeadlines({ category, page: 1, language }));
        }
    }, [category, status, language, dispatch]);

    // ── Actions ─────────────────────────────────────────────────────────────

    const changeCategory = useCallback(
        (newCategory: Category) => {
            dispatch(setCategory(newCategory));
            // setCategory resets status to 'idle', triggering the effect above
        },
        [dispatch],
    );

    const refresh = useCallback(() => {
        dispatch(fetchHeadlines({ category, page: 1, language, refresh: true }));
    }, [category, language, dispatch]);

    const loadMore = useCallback(() => {
        const hasMore = articles.length < totalResults;
        const isIdle = status === 'succeeded';
        if (!hasMore || !isIdle) return;
        dispatch(fetchHeadlines({ category, page: page + 1, language }));
    }, [articles.length, totalResults, status, category, page, language, dispatch]);

    // ── App lifecycle ────────────────────────────────────────────────────────

    const onForeground = useCallback(async () => {
        const stale = await isFetchStale();
        if (stale) {
            dispatch(fetchHeadlines({ category, page: 1, language, refresh: true }));
        }
    }, [category, language, dispatch]);

    useAppState(onForeground);

    return {
        articles,
        status,
        refreshing,
        error,
        category,
        hasMore: articles.length < totalResults,
        changeCategory,
        refresh,
        loadMore,
    };
}