import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PreferencesState, Language, Category } from '../../types';

const initialState: PreferencesState = {
    language: 'en',
    theme: 'light',
    onboardingComplete: false,
};

const preferencesSlice = createSlice({
    name: 'preferences',
    initialState,
    reducers: {
        setLanguage(state, action: PayloadAction<Language>) {
            state.language = action.payload;
        },
        setTheme(state, action: PayloadAction<'light' | 'dark'>) {
            state.theme = action.payload;
        },
        completeOnboarding(state) {
            state.onboardingComplete = true;
        },
    },
});

export const { setLanguage, setTheme, completeOnboarding } = preferencesSlice.actions;
export default preferencesSlice.reducer;