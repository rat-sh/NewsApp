import React, { useCallback } from 'react';
import { View, StyleSheet, useColorScheme, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList, Article } from '../types';
import { useHeadlines } from '../hooks/useHeadlines';
import ArticleList from '../components/ArticleList';
import CategoryTabs from '../components/CategoryTabs';

type Props = NativeStackScreenProps<AppStackParamList, 'Tabs'>;

const HomeScreen = ({ navigation }: Props) => {
    const isDark = useColorScheme() === 'dark';
    const {
        articles,
        status,
        refreshing,
        error,
        category,
        hasMore,
        changeCategory,
        refresh,
        loadMore,
    } = useHeadlines();

    const handleArticlePress = useCallback(
        (article: Article) => {
            navigation.navigate('ArticleDetail', { article });
        },
        [navigation],
    );

    return (
        <SafeAreaView style={[styles.container, isDark ? dark.container : light.container]}>
            <ArticleList
                articles={articles}
                status={status}
                error={error}
                refreshing={refreshing}
                hasMore={hasMore}
                onRefresh={refresh}
                onEndReached={loadMore}
                onArticlePress={handleArticlePress}
                ListHeaderComponent={
                    <CategoryTabs selected={category} onSelect={changeCategory} />
                }
                emptyMessage="No headlines found. Pull to refresh."
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
});

const light = StyleSheet.create({ container: { backgroundColor: '#f5f5f5' } });
const dark = StyleSheet.create({ container: { backgroundColor: '#121212' } });

export default HomeScreen;