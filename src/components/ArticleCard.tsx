import React, { memo } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    useColorScheme,
} from 'react-native';
import { Article } from '../types';
import { formatDate, truncate } from '../utils/helpers';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleBookmarkLocal } from '../store/slices/bookmarksSlice';

interface Props {
    article: Article;
    onPress: (article: Article) => void;
}

const PLACEHOLDER = 'https://via.placeholder.com/400x200?text=No+Image';

const ArticleCard = memo(({ article, onPress }: Props) => {
    const isDark = useColorScheme() === 'dark';
    const s = isDark ? darkStyles : lightStyles;
    const dispatch = useAppDispatch();
    const bookmarks = useAppSelector(state => state.bookmarks.articles);
    const isBookmarked = bookmarks.some(a => a.url === article.url);

    return (
        <TouchableOpacity
            style={[styles.card, s.card]}
            onPress={() => onPress(article)}
            activeOpacity={0.85}
        >
            <Image
                source={{ uri: article.urlToImage ?? PLACEHOLDER }}
                style={styles.image}
                resizeMode="cover"
                defaultSource={{ uri: PLACEHOLDER }}
            />
            <View style={styles.body}>
                <View style={styles.meta}>
                    <Text style={[styles.source, s.source]} numberOfLines={1}>
                        {article.source.name}
                    </Text>
                    <View style={styles.metaRight}>
                        <Text style={[styles.date, s.date]}>{formatDate(article.publishedAt)}</Text>
                        <TouchableOpacity
                            onPress={() => dispatch(toggleBookmarkLocal(article))}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            style={styles.bookmarkBtn}
                        >
                            <Text style={[styles.bookmarkIcon, isBookmarked && styles.bookmarkActive]}>
                                {isBookmarked ? '★' : '☆'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={[styles.title, s.title]} numberOfLines={3}>
                    {article.title}
                </Text>
                {article.description ? (
                    <Text style={[styles.description, s.description]} numberOfLines={2}>
                        {truncate(article.description, 120)}
                    </Text>
                ) : null}
            </View>
        </TouchableOpacity>
    );
});

ArticleCard.displayName = 'ArticleCard';

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        marginHorizontal: 16,
        marginVertical: 6,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
    },
    image: {
        width: '100%',
        height: 180,
        backgroundColor: '#e0e0e0',
    },
    body: {
        padding: 12,
    },
    meta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    metaRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    source: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        flex: 1,
        marginRight: 8,
    },
    date: {
        fontSize: 11,
    },
    bookmarkBtn: {
        padding: 2,
    },
    bookmarkIcon: {
        fontSize: 18,
        color: '#bbb',
    },
    bookmarkActive: {
        color: '#1a73e8',
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 22,
        marginBottom: 6,
    },
    description: {
        fontSize: 13,
        lineHeight: 18,
    },
});

const lightStyles = StyleSheet.create({
    card: { backgroundColor: '#ffffff' },
    source: { color: '#1a73e8' },
    date: { color: '#888' },
    title: { color: '#111' },
    description: { color: '#555' },
});

const darkStyles = StyleSheet.create({
    card: { backgroundColor: '#1e1e1e' },
    source: { color: '#4fa3f7' },
    date: { color: '#888' },
    title: { color: '#f0f0f0' },
    description: { color: '#aaa' },
});

export default ArticleCard;