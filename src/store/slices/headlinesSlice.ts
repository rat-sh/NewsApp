import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { HeadlinesState, Category, Language, Article } from '../../types';
import { getTopHeadlines, PAGE_SIZE } from '../../services/newsApi';
import { recordFetchTimestamp } from '../../utils/storage';

// ---------------------------------------------------------------------------
// Thunks
// ---------------------------------------------------------------------------

interface FetchHeadlinesArgs {
    category: Category;
    page: number;
    language: Language;
    refresh?: boolean;
}

export const fetchHeadlines = createAsyncThunk(
    'headlines/fetch',
    async (args: FetchHeadlinesArgs, { rejectWithValue }) => {
        try {
            const data = await getTopHeadlines(args.category, args.page, args.language);
            await recordFetchTimestamp();
            return { ...data, page: args.page, refresh: args.refresh ?? false };
        } catch (err: any) {
            return rejectWithValue(err.message ?? 'Failed to load headlines.');
        }
    },
);

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------

const initialState: HeadlinesState = {
    articles: [],
    page: 1,
    totalResults: 0,
    category: 'general',
    status: 'idle',
    refreshing: false,
    error: null,
};

const headlinesSlice = createSlice({
    name: 'headlines',
    initialState,
    reducers: {
        setCategory(state, action: PayloadAction<Category>) {
            // Reset pagination when category changes
            state.category = action.payload;
            state.articles = [];
            state.page = 1;
            state.totalResults = 0;
            state.status = 'idle';
            state.error = null;
        },
        resetHeadlines(state) {
            state.articles = [];
            state.page = 1;
            state.totalResults = 0;
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchHeadlines.pending, (state, action) => {
                if (action.meta.arg.refresh) {
                    state.refreshing = true;
                } else {
                    state.status = 'loading';
                }
                state.error = null;
            })
            .addCase(fetchHeadlines.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.refreshing = false;
                state.totalResults = action.payload.totalResults;
                state.page = action.payload.page;

                const incoming = action.payload.articles.filter(
                    // Deduplicate by URL
                    a => !state.articles.some(existing => existing.url === a.url),
                );

                if (action.payload.refresh || action.payload.page === 1) {
                    state.articles = action.payload.articles;
                } else {
                    state.articles = [...state.articles, ...incoming];
                }
            })
            .addCase(fetchHeadlines.rejected, (state, action) => {
                state.status = 'failed';
                state.refreshing = false;
                state.error = action.payload as string;
            });
    },
});

export const { setCategory, resetHeadlines } = headlinesSlice.actions;
export default headlinesSlice.reducer;