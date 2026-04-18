import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types';
import * as SupabaseService from '../../services/supabase';

// ---------------------------------------------------------------------------
// Thunks
// ---------------------------------------------------------------------------

export const registerUser = createAsyncThunk(
    'auth/register',
    async (
        payload: { email: string; password: string; name: string },
        { rejectWithValue },
    ) => {
        try {
            return await SupabaseService.signUp(payload.email, payload.password, payload.name);
        } catch (err: any) {
            return rejectWithValue(err.message ?? 'Registration failed.');
        }
    },
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async (payload: { email: string; password: string }, { rejectWithValue }) => {
        try {
            return await SupabaseService.signIn(payload.email, payload.password);
        } catch (err: any) {
            return rejectWithValue(err.message ?? 'Login failed.');
        }
    },
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (token: string, { rejectWithValue }) => {
        try {
            await SupabaseService.signOut(token);
        } catch (err: any) {
            // Even if server logout fails, clear local state
            return rejectWithValue(err.message);
        }
    },
);

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------

const initialState: AuthState = {
    user: null,
    token: null,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError(state) {
            state.error = null;
        },
        // Used to rehydrate session without re-fetching (from persisted state)
        setSession(state, action: PayloadAction<{ user: User; token: string }>) {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
    },
    extraReducers: builder => {
        // Register
        builder
            .addCase(registerUser.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Login
        builder
            .addCase(loginUser.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Logout
        builder
            .addCase(logoutUser.fulfilled, state => {
                state.user = null;
                state.token = null;
                state.isLoading = false;
            })
            .addCase(logoutUser.rejected, state => {
                // Still clear local state even on server error
                state.user = null;
                state.token = null;
                state.isLoading = false;
            });
    },
});

export const { clearError, setSession } = authSlice.actions;
export default authSlice.reducer;