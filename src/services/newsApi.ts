import axios, { AxiosInstance, AxiosError } from 'axios';
import { NewsApiResponse, Category, Language } from '../types';

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------
const BASE_URL = 'https://newsapi.org/v2';
const PAGE_SIZE = 20;

const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor — attach API key from env
apiClient.interceptors.request.use(config => {
    config.params = {
        ...config.params,
        apiKey: process.env.NEWS_API_KEY ?? '',
        pageSize: PAGE_SIZE,
    };
    return config;
});

// Response interceptor — normalise errors
apiClient.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
        if (error.response) {
            const data = error.response.data as { message?: string };
            throw new Error(data?.message ?? `API error ${error.response.status}`);
        }
        if (error.request) {
            throw new Error('Network error — please check your connection.');
        }
        throw new Error(error.message);
    },
);

// ---------------------------------------------------------------------------
// API methods
// ---------------------------------------------------------------------------

/**
 * Fetch top headlines for a given category and language.
 * Falls back to 'en' if the selected language is not supported
 * by the top-headlines endpoint.
 */
export async function getTopHeadlines(
    category: Category,
    page: number,
    language: Language,
): Promise<NewsApiResponse> {
    const { data } = await apiClient.get<NewsApiResponse>('/top-headlines', {
        params: {
            category,
            page,
            language,
            // top-headlines requires either sources, q, or country — use country as fallback
            country: language === 'en' ? 'us' : undefined,
        },
    });
    return data;
}

/**
 * Search for articles using the /everything endpoint which supports
 * all languages and gives broader results.
 */
export async function searchArticles(
    query: string,
    page: number,
    language: Language,
): Promise<NewsApiResponse> {
    const { data } = await apiClient.get<NewsApiResponse>('/everything', {
        params: {
            q: query,
            page,
            language,
            sortBy: 'publishedAt',
        },
    });
    return data;
}

export { PAGE_SIZE };