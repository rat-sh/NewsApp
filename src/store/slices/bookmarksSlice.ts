import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BookmarksState, Article } from '../../types';
import * as SupabaseService from '../../services/supabase';
import type { RootState } from '../index';

// ---------------------------------------------------------------------------
// Thunks — Supabase sync
// ---------------------------------------------------------------------------

export const syncBookmarks = createAsyncThunk(
    'bookmarks/sync',
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const { user, token } = state.auth;
        if (!user || !token) return rejectWithValue('Not authenticated');
        try {
            return await SupabaseService.fetchBookmarks(user.id, token);
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const addBookmarkRemote = createAsyncThunk(
    'bookmarks/add',
    async (article: Article, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const { user, token } = state.auth;
        if (!user || !token) return rejectWithValue('Not authenticated');
        try {
            await SupabaseService.addBookmark(user.id, token, article);
            return article;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const removeBookmarkRemote = createAsyncThunk(
    'bookmarks/remove',
    async (articleUrl: string, { getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const { user, token } = state.auth;
        if (!user || !token) return rejectWithValue('Not authenticated');
        try {
            await SupabaseService.removeBookmark(user.id, token, articleUrl);
            return articleUrl;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------

const initialState: BookmarksState = {
    articles: [],
};

const bookmarksSlice = createSlice({
    name: 'bookmarks',
    initialState,
    reducers: {
        // Optimistic local toggle — used when offline, reconciled on next sync
        toggleBookmarkLocal(state, action: PayloadAction<Article>) {
            const idx = state.articles.findIndex(a => a.url === action.payload.url);
            if (idx === -1) {
                state.articles.unshift(action.payload);
            } else {
                state.articles.splice(idx, 1);
            }
        },
        clearBookmarks(state) {
            state.articles = [];
        },
    },
    extraReducers: builder => {
        builder
            .addCase(syncBookmarks.fulfilled, (state, action) => {
                state.articles = action.payload;
            })
            .addCase(addBookmarkRemote.fulfilled, (state, action) => {
                if (!state.articles.some(a => a.url === action.payload.url)) {
                    state.articles.unshift(action.payload);
                }
            })
            .addCase(removeBookmarkRemote.fulfilled, (state, action) => {
                state.articles = state.articles.filter(a => a.url !== action.payload);
            });
    },
});

export const { toggleBookmarkLocal, clearBookmarks } = bookmarksSlice.actions;
export default bookmarksSlice.reducer;