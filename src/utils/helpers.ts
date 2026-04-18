import { Article } from '../types';

/**
 * Format ISO date string to human-readable "Mar 15, 2024" or "2 hours ago"
 */
export function formatDate(isoString: string): string {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

/**
 * Truncate string to maxLen characters, appending ellipsis if needed
 */
export function truncate(text: string | null | undefined, maxLen: number): string {
    if (!text) return '';
    return text.length > maxLen ? `${text.slice(0, maxLen)}…` : text;
}

/**
 * Generate a stable unique key for an article (url is unique per article)
 */
export function articleKey(article: Article): string {
    return article.url;
}

/**
 * Check if two Article arrays are equal by comparing URLs
 */
export function articlesEqual(a: Article[], b: Article[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((article, i) => article.url === b[i].url);
}

/**
 * Build article text block for AI summarization context
 */
export function buildArticleContext(article: Article): string {
    const parts = [
        `Title: ${article.title}`,
        article.description ? `Description: ${article.description}` : null,
        article.content ? `Content: ${article.content.replace(/\[\+\d+ chars\]$/, '').trim()}` : null,
        `Source: ${article.source.name}`,
        `Published: ${formatDate(article.publishedAt)}`,
    ].filter(Boolean);
    return parts.join('\n\n');
}

/**
 * Strip [+N chars] suffix that NewsAPI appends to truncated content
 */
export function cleanContent(content: string | null): string {
    if (!content) return '';
    return content.replace(/\s*\[\+\d+ chars\]$/, '');
}