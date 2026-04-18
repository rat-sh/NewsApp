import axios from 'axios';
import { Article, ChatMessage, Language, LANGUAGE_LABELS } from '../types';
import { buildArticleContext } from '../utils/helpers';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
import { OPENAI_API_KEY as OPENAI_KEY } from '@env';
const MODEL = 'gpt-3.5-turbo';

interface OpenAIMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface OpenAIResponse {
    choices: Array<{ message: { content: string } }>;
}

/**
 * Build the system prompt.
 * The language param ensures the AI responds in the user's language —
 * this is the "language transparency" feature: even English articles
 * get summarized in the user's preferred language.
 */
function buildSystemPrompt(article: Article, language: Language): string {
    const langLabel = LANGUAGE_LABELS[language];
    const context = buildArticleContext(article);
    return `You are a helpful news assistant. You have been given the following news article:

---
${context}
---

Your tasks:
1. When asked to summarize, provide a clear, concise 3–4 sentence summary.
2. Answer follow-up questions based ONLY on the article content.
3. Always respond in ${langLabel}, regardless of the language of the article.
4. Be factual, neutral, and concise.
5. If asked something not covered in the article, say so clearly.`;
}

/**
 * Convert our internal ChatMessage format to OpenAI format.
 * Filters out the system message (handled separately).
 */
function toOpenAIMessages(history: ChatMessage[]): OpenAIMessage[] {
    return history.map(msg => ({
        role: msg.role,
        content: msg.content,
    }));
}

/**
 * Send a message to the AI and get a response.
 * Handles full conversation history for multi-turn Q&A.
 */
export async function sendChatMessage(
    article: Article,
    history: ChatMessage[],
    userMessage: string,
    language: Language,
): Promise<string> {
    const messages: OpenAIMessage[] = [
        { role: 'system', content: buildSystemPrompt(article, language) },
        ...toOpenAIMessages(history),
        { role: 'user', content: userMessage },
    ];

    const { data } = await axios.post<OpenAIResponse>(
        OPENAI_URL,
        {
            model: MODEL,
            messages,
            max_tokens: 512,
            temperature: 0.5,
        },
        {
            headers: {
                Authorization: `Bearer ${OPENAI_KEY}`,
                'Content-Type': 'application/json',
            },
            timeout: 20000,
        },
    );

    const reply = data.choices?.[0]?.message?.content;
    if (!reply) throw new Error('Empty response from AI.');
    return reply.trim();
}

/**
 * Auto-summarize article — convenience wrapper for the first message.
 */
export async function summarizeArticle(
    article: Article,
    language: Language,
): Promise<string> {
    return sendChatMessage(article, [], 'Please summarize this article.', language);
}