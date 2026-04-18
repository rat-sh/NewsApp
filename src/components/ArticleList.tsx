import React, { useCallback } from 'react';
import {
    FlatList,
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    RefreshControl,
    useColorScheme,
    ListRenderItem,
} from 'react-native';
import { Article } from '../types';
import { LoadingStatus } from '../types';
import ArticleCard from './ArticleCard';
import LoadingFooter from './LoadingFooter';
import { articleKey } from '../utils/helpers';
import { useAppSelector } from "../store";

interface Props {
    articles: Article[];
    status: LoadingStatus;
    error: string | null;
    refreshing?: boolean;
    hasMore?: boolean;
    onRefresh?: () => void;
    onEndReached?: () => void;
    onArticlePress: (article: Article) => void;
    ListHeaderComponent?: React.ReactElement;
    emptyMessage?: string;
}

const ArticleList = ({
    articles,
    status,
    error,
    refreshing = false,
    hasMore = false,
    onRefresh,
    onEndReached,
    onArticlePress,
    ListHeaderComponent,
    emptyMessage = 'No articles found.',
}: Props) => {
    const isDark = useAppSelector(state => state.preferences.theme) === 'dark';
    const textColor = isDark ? '#f0f0f0' : '#111';
    const subColor = isDark ? '#888' : '#777';
    const bgColor = isDark ? '#121212' : '#f5f5f5';

    const renderItem: ListRenderItem<Article> = useCallback(
        ({ item }) => <ArticleCard article={item} onPress={onArticlePress} />,
        [onArticlePress],
    );

    const keyExtractor = useCallback((item: Article) => articleKey(item), []);

    // ── Loading state (first load) ────────────────────────────────────────
    if (status === 'loading' && articles.length === 0) {
        return (
            <View style={[styles.centered, { backgroundColor: bgColor }]}>
                <ActivityIndicator size="large" color="#1a73e8" />
                <Text style={[styles.loadingText, { color: subColor }]}>Loading articles…</Text>
            </View>
        );
    }

    // ── Error state ───────────────────────────────────────────────────────
    if (status === 'failed' && articles.length === 0) {
        return (
            <View style={[styles.centered, { backgroundColor: bgColor }]}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={[styles.errorTitle, { color: textColor }]}>Something went wrong</Text>
                <Text style={[styles.errorMessage, { color: subColor }]}>{error}</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={articles}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListHeaderComponent={ListHeaderComponent}
            ListFooterComponent={
                hasMore && status === 'loading' ? <LoadingFooter /> : <View style={styles.footer} />
            }
            ListEmptyComponent={
                status === 'succeeded' ? (
                    <View style={styles.centered}>
                        <Text style={styles.emptyIcon}>📰</Text>
                        <Text style={[styles.emptyText, { color: subColor }]}>{emptyMessage}</Text>
                    </View>
                ) : null
            }
            onEndReached={onEndReached}
            onEndReachedThreshold={0.4}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            refreshControl={
                onRefresh ? (
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#1a73e8"
                        colors={['#1a73e8']}
                    />
                ) : undefined
            }
            contentContainerStyle={articles.length === 0 ? styles.emptyContainer : styles.listContent}
            style={{ backgroundColor: bgColor }}
            // Performance props
            removeClippedSubviews={true}
            maxToRenderPerBatch={8}
            updateCellsBatchingPeriod={50}
            initialNumToRender={6}
            windowSize={10}
        />
    );
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    listContent: {
        paddingVertical: 8,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
    },
    errorIcon: {
        fontSize: 40,
        marginBottom: 12,
    },
    errorTitle: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 6,
    },
    errorMessage: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 15,
        textAlign: 'center',
    },
    footer: {
        height: 32,
    },
});

export default ArticleList;