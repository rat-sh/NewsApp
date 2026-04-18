/**
 * Supabase service — thin wrapper around the Supabase REST API using axios.
 *
 * Tables (see supabase_schema.sql):
 *   profiles  (id, email, name, created_at)
 *   bookmarks (id, user_id, article_url, article_data, created_at)
 *
 * A Postgres trigger (handle_new_user) automatically creates the profile row
 * when a user signs up, so signUp() here only needs to return the session.
 */

import axios, { AxiosInstance } from 'axios';
import { User, Article } from '../types';

const SUPABASE_URL      = process.env.SUPABASE_URL      ?? '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? '';

// ── Supabase REST client ──────────────────────────────────────────────────────
const supabase: AxiosInstance = axios.create({
    baseURL: `${SUPABASE_URL}/rest/v1`,
    headers: {
        apikey: SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
    },
});

function authHeaders(token: string) {
    return { Authorization: `Bearer ${token}` };
}

// ── Auth (Supabase Auth REST) ─────────────────────────────────────────────────
const authBase = `${SUPABASE_URL}/auth/v1`;

interface SupabaseAuthResponse {
    access_token: string;
    user: {
        id: string;
        email: string;
        user_metadata?: { name?: string };
    };
}

/**
 * Sign up — passes name via user_metadata so the DB trigger can read it.
 * The trigger (handle_new_user) creates the profiles row automatically.
 */
export async function signUp(
    email: string,
    password: string,
    name: string,
): Promise<{ user: User; token: string }> {
    const { data } = await axios.post<SupabaseAuthResponse>(
        `${authBase}/signup`,
        {
            email,
            password,
            data: { name }, // stored in auth.users.raw_user_meta_data
        },
        { headers: { apikey: SUPABASE_ANON_KEY } },
    );

    return {
        token: data.access_token,
        user: {
            id:    data.user.id,
            email: data.user.email ?? email,
            name:  data.user.user_metadata?.name ?? name,
        },
    };
}

/**
 * Sign in — fetches the profile row to get the stored display name.
 */
export async function signIn(
    email: string,
    password: string,
): Promise<{ user: User; token: string }> {
    const { data } = await axios.post<SupabaseAuthResponse>(
        `${authBase}/token?grant_type=password`,
        { email, password },
        { headers: { apikey: SUPABASE_ANON_KEY } },
    );

    // Fetch the stored name from the profiles table
    let name = email;
    try {
        const profileRes = await supabase.get<Array<{ name: string }>>(
            `/profiles?id=eq.${data.user.id}&select=name&limit=1`,
            { headers: authHeaders(data.access_token) },
        );
        name = profileRes.data?.[0]?.name ?? email;
    } catch {
        // Non-fatal: fall back to email prefix
        name = data.user.user_metadata?.name ?? email.split('@')[0];
    }

    return {
        token: data.access_token,
        user: { id: data.user.id, email, name },
    };
}

/**
 * Sign out — invalidates the server-side session.
 */
export async function signOut(token: string): Promise<void> {
    await axios.post(
        `${authBase}/logout`,
        {},
        { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` } },
    );
}

// ── Bookmark sync ─────────────────────────────────────────────────────────────

export async function fetchBookmarks(
    userId: string,
    token: string,
): Promise<Article[]> {
    const { data } = await supabase.get<Array<{ article_data: Article }>>(
        `/bookmarks?user_id=eq.${userId}&select=article_data&order=created_at.desc`,
        { headers: authHeaders(token) },
    );
    return data.map(row => row.article_data);
}

export async function addBookmark(
    userId: string,
    token: string,
    article: Article,
): Promise<void> {
    await supabase.post(
        '/bookmarks',
        {
            user_id:      userId,
            article_url:  article.url,
            article_data: article,
        },
        {
            headers: {
                ...authHeaders(token),
                Prefer: 'return=minimal',    // don't return the inserted row
                'On-Conflict': 'user_id,article_url', // upsert — ignore duplicate
            },
        },
    );
}

export async function removeBookmark(
    userId: string,
    token: string,
    articleUrl: string,
): Promise<void> {
    await supabase.delete(
        `/bookmarks?user_id=eq.${userId}&article_url=eq.${encodeURIComponent(articleUrl)}`,
        { headers: authHeaders(token) },
    );
}