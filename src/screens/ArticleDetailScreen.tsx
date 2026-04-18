import React, { useCallback } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    useColorScheme,
    SafeAreaView,
    Linking,
    Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types';
import { useAppDispatch, useAppSelector } from '../store';
import {
    addBookmarkRemote,
    removeBookmarkRemote,
    toggleBookmarkLocal,
} from '../store/slices/bookmarksSlice';
import { useNetInfo } from '../hooks/useNetInfo';
import { formatDate, cleanContent } from '../utils/helpers';

type Props = NativeStackScreenProps<AppStackParamList, 'ArticleDetail'>;

const PLACEHOLDER = 'https://via.placeholder.com/800x400?text=No+Image';

const ArticleDetailScreen = ({ route, navigation }: Props) => {
    const { article } = route.params;
    const isDark = useColorScheme() === 'dark';
    const s = isDark ? dark : light;
    const dispatch = useAppDispatch();
    const { isConnected } = useNetInfo();

    const bookmarks = useAppSelector(state => state.bookmarks.articles);
    const { token, user } = useAppSelector(state => state.auth);

    const isBookmarked = bookmarks.some(a => a.url === article.url);

    // ── Bookmark toggle ────────────────────────────────────────────────────
    const handleBookmark = useCallback(() => {
        // Optimistic update always
        dispatch(toggleBookmarkLocal(article));

        // Sync with Supabase if authenticated
        if (user && token) {
            if (isBookmarked) {
                dispatch(removeBookmarkRemote(article.url));
            } else {
                dispatch(addBookmarkRemote(article));
            }
        }
    }, [dispatch, article, isBookmarked, user, token]);

    // ── Open in browser ────────────────────────────────────────────────────
    const handleOpenBrowser = useCallback(async () => {
        const supported = await Linking.canOpenURL(article.url);
        if (supported) {
            await Linking.openURL(article.url);
        } else {
            Alert.alert('Cannot open this URL');
        }
    }, [article.url]);

    const content = cleanContent(article.content);

    return (
        <SafeAreaView style={[styles.container, s.container]}>
            {/* Custom header */}
            <View style={[styles.header, s.border]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={[styles.backIcon, { color: '#1a73e8' }]}>←</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleBookmark} style={styles.bookmarkBtn}>
                    <Text style={styles.bookmarkIcon}>{isBookmarked ? '🔖' : '🏷️'}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Image */}
                <Image
                    source={{ uri: article.urlToImage ?? PLACEHOLDER }}
                    style={styles.image}
                    resizeMode="cover"
                />

                {/* Content */}
                <View style={styles.body}>
                    {/* Source + date */}
                    <View style={styles.metaRow}>
                        <View style={[styles.sourceBadge, s.sourceBadge]}>
                            <Text style={[styles.sourceName, s.sourceName]}>
                                {article.source.name}
                            </Text>
                        </View>
                        <Text style={[styles.date, s.date]}>{formatDate(article.publishedAt)}</Text>
                    </View>

                    {/* Title */}
                    <Text style={[styles.title, s.title]}>{article.title}</Text>

                    {/* Author */}
                    {article.author ? (
                        <Text style={[styles.author, s.author]}>By {article.author}</Text>
                    ) : null}

                    {/* Description */}
                    {article.description ? (
                        <Text style={[styles.description, s.description]}>{article.description}</Text>
                    ) : null}

                    {/* Divider */}
                    <View style={[styles.divider, s.divider]} />

                    {/* Content */}
                    {content ? (
                        <Text style={[styles.content, s.content]}>{content}</Text>
                    ) : (
                        <Text style={[styles.noContent, s.author]}>
                            Full article content is not available in the preview.
                        </Text>
                    )}

                    {/* Read full article */}
                    <TouchableOpacity
                        style={styles.readMoreBtn}
                        onPress={handleOpenBrowser}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.readMoreText}>Read full article ↗</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    backBtn: { padding: 4 },
    backIcon: { fontSize: 24, fontWeight: '600' },
    bookmarkBtn: { padding: 4 },
    bookmarkIcon: { fontSize: 22 },
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: 100 },
    image: { width: '100%', height: 220 },
    body: { padding: 18 },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sourceBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    sourceName: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
    date: { fontSize: 12 },
    title: { fontSize: 22, fontWeight: '800', lineHeight: 30, marginBottom: 10 },
    author: { fontSize: 13, marginBottom: 14, fontStyle: 'italic' },
    description: { fontSize: 16, lineHeight: 24, marginBottom: 16, fontWeight: '500' },
    divider: { height: StyleSheet.hairlineWidth, marginBottom: 16 },
    content: { fontSize: 15, lineHeight: 25, marginBottom: 24 },
    noContent: { fontSize: 14, marginBottom: 24, textAlign: 'center' },
    readMoreBtn: {
        backgroundColor: '#1a73e8',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    readMoreText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});

const light = StyleSheet.create({
    container: { backgroundColor: '#fff' },
    border: { borderColor: '#eee' },
    sourceBadge: { backgroundColor: '#e8f0fe' },
    sourceName: { color: '#1a73e8' },
    date: { color: '#999' },
    title: { color: '#111' },
    author: { color: '#777' },
    description: { color: '#333' },
    divider: { backgroundColor: '#eee' },
    content: { color: '#222' },
});

const dark = StyleSheet.create({
    container: { backgroundColor: '#0d0d0d' },
    border: { borderColor: '#222' },
    sourceBadge: { backgroundColor: '#1a2a3a' },
    sourceName: { color: '#4fa3f7' },
    date: { color: '#777' },
    title: { color: '#f0f0f0' },
    author: { color: '#888' },
    description: { color: '#ccc' },
    divider: { backgroundColor: '#222' },
    content: { color: '#bbb' },
});

export default ArticleDetailScreen;