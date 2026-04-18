import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KEYS } from '../utils/storage';

import authReducer from './slices/authSlice';
import headlinesReducer from './slices/headlinesSlice';
import searchReducer from './slices/searchSlice';
import bookmarksReducer from './slices/bookmarksSlice';
import preferencesReducer from './slices/preferencesSlice';

// ── Root reducer ─────────────────────────────────────────────────────────────
const rootReducer = combineReducers({
    auth: authReducer,
    headlines: headlinesReducer,
    search: searchReducer,
    bookmarks: bookmarksReducer,
    preferences: preferencesReducer,
});

// ── Persist config ────────────────────────────────────────────────────────────
const persistConfig = {
    key: KEYS.REDUX_PERSIST,
    storage: AsyncStorage,
    whitelist: ['auth', 'preferences'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ── Store ─────────────────────────────────────────────────────────────────────
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

// ── Types ─────────────────────────────────────────────────────────────────────
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// ── Typed hooks ────────────────────────────────────────────────────────────────
// useAppDispatch() returns the full AppDispatch type so async thunks work
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;