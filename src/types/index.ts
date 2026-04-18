// ─── Globals ───────────────────────────────────────────────────────────────

// ─── Article ───────────────────────────────────────────────────────────────

export interface Article {
    source: { id: string | null; name: string };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
}

export interface NewsApiResponse {
    status: string;
    totalResults: number;
    articles: Article[];
}

// ─── Auth ──────────────────────────────────────────────────────────────────
export interface User {
    id: string;
    email: string;
    name: string;
}

// ─── Preferences ──────────────────────────────────────────────────────────
export type Language =
    | 'en'
    | 'hi'
    | 'es'
    | 'fr'
    | 'ar'
    | 'de'
    | 'pt'
    | 'bn';

export const LANGUAGE_LABELS: Record<Language, string> = {
    en: 'English',
    hi: 'Hindi',
    es: 'Spanish',
    fr: 'French',
    ar: 'Arabic',
    de: 'German',
    pt: 'Portuguese',
    bn: 'Bengali',
};

export type Category =
    | 'general'
    | 'technology'
    | 'sports'
    | 'business'
    | 'entertainment'
    | 'health'
    | 'science';

export const CATEGORY_LABELS: Record<Category, string> = {
    general: 'Top',
    technology: 'Tech',
    sports: 'Sports',
    business: 'Business',
    entertainment: 'Entertainment',
    health: 'Health',
    science: 'Science',
};

// ─── Chat ──────────────────────────────────────────────────────────────────
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

// ─── Navigation ────────────────────────────────────────────────────────────
export type RootStackParamList = {
    Auth: undefined;
    App: undefined;
};

export type AuthStackParamList = {
    Splash: undefined;
    Onboarding: undefined;
    Login: undefined;
    Register: undefined;
};

export type AppStackParamList = {
    Tabs: undefined;
    ArticleDetail: { article: Article };
    Settings: undefined;
};

export type TabParamList = {
    Home: undefined;
    Search: undefined;
    Bookmarks: undefined;
};

// ─── Redux State ───────────────────────────────────────────────────────────
export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface HeadlinesState {
    articles: Article[];
    page: number;
    totalResults: number;
    category: Category;
    status: LoadingStatus;
    refreshing: boolean;
    error: string | null;
}

export interface SearchState {
    query: string;
    articles: Article[];
    page: number;
    totalResults: number;
    status: LoadingStatus;
    error: string | null;
}

export interface BookmarksState {
    articles: Article[];
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
}

export interface PreferencesState {
    language: Language;
    theme: 'light' | 'dark';
    onboardingComplete: boolean;
}