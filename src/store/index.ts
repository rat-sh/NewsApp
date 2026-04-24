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
    Storage,
} from 'redux-persist';
import { KEYS, storage } from '../utils/storage';

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
export const reduxStorage: Storage = {
    setItem: (key, value) => {
        storage.set(key, value);
        return Promise.resolve(true);
    },
    getItem: (key) => {
        const value = storage.getString(key);
        return Promise.resolve(value);
    },
    removeItem: (key) => {
        storage.delete(key);
        return Promise.resolve();
    },
};

const persistConfig = {
    key: KEYS.REDUX_PERSIST,
    storage: reduxStorage,
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