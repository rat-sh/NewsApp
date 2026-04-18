import React, { useCallback, useEffect } from 'react';
import { StyleSheet, useColorScheme, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList, Article } from '../types';
import { useAppDispatch, useAppSelector } from '../store';
import { syncBookmarks } from '../store/slices/bookmarksSlice';
import ArticleList from '../components/ArticleList';

type Props = NativeStackScreenProps<AppStackParamList, 'Tabs'>;

const BookmarksScreen = ({ navigation }: Props) => {
    const isDark = useAppSelector(state => state.preferences.theme) === 'dark';
    const dispatch = useAppDispatch();
    const articles = useAppSelector(state => state.bookmarks.articles);
    const { user, token } = useAppSelector(state => state.auth);

    // Sync bookmarks from Supabase on mount
    useEffect(() => {
        if (user && token) {
            dispatch(syncBookmarks());
        }
    }, [dispatch, user, token]);

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
                // Bookmarks are always "succeeded" — they come from local + Supabase
                status="succeeded"
                error={null}
                onArticlePress={handleArticlePress}
                emptyMessage="No bookmarks yet. Tap 🔖 on any article to save it."
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
});
const light = StyleSheet.create({ container: { backgroundColor: '#f5f5f5' } });
const dark = StyleSheet.create({ container: { backgroundColor: '#121212' } });

export default BookmarksScreen;