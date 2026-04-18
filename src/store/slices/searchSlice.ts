import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SearchState, Language } from '../../types';
import { searchArticles } from '../../services/newsApi';

// ---------------------------------------------------------------------------
// Thunks
// ---------------------------------------------------------------------------

interface SearchArgs {
    query: string;
    page: number;
    language: Language;
}

export const fetchSearchResults = createAsyncThunk(
    'search/fetch',
    async (args: SearchArgs, { rejectWithValue }) => {
        try {
            const data = await searchArticles(args.query, args.page, args.language);
            return { ...data, page: args.page, query: args.query };
        } catch (err: any) {
            return rejectWithValue(err.message ?? 'Search failed.');
        }
    },
);

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------

const initialState: SearchState = {
    query: '',
    articles: [],
    page: 1,
    totalResults: 0,
    status: 'idle',
    error: null,
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setQuery(state, action: PayloadAction<string>) {
            state.query = action.payload;
        },
        clearSearch(state) {
            state.query = '';
            state.articles = [];
            state.page = 1;
            state.totalResults = 0;
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchSearchResults.pending, state => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchSearchResults.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.totalResults = action.payload.totalResults;
                state.page = action.payload.page;

                const incoming = action.payload.articles.filter(
                    a => !state.articles.some(existing => existing.url === a.url),
                );

                if (action.payload.page === 1) {
                    state.articles = action.payload.articles;
                } else {
                    state.articles = [...state.articles, ...incoming];
                }
            })
            .addCase(fetchSearchResults.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { setQuery, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;