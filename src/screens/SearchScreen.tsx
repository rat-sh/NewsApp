import React, { useCallback, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    useColorScheme,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Article } from '../types';
import { useSearch } from '../hooks/useSearch';
import SearchBar from '../components/SearchBar';
import ArticleList from '../components/ArticleList';

const SearchScreen = () => {
    const isDark = useColorScheme() === 'dark';
    const s = isDark ? dark : light;
    const navigation = useNavigation<any>();
    const { query, articles, status, error, hasMore, onQueryChange, loadMore, clear } =
        useSearch();

    const handleArticlePress = useCallback(
        (article: Article) => {
            navigation.navigate('ArticleDetail', { article });
        },
        [navigation],
    );

    const showEmpty = status === 'idle' && query.length < 2;

    return (
        <SafeAreaView style={[styles.container, s.container]}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <SearchBar value={query} onChangeText={onQueryChange} onClear={clear} />

                {showEmpty ? (
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.prompt}>
                            <Text style={styles.promptIcon}>🔍</Text>
                            <Text style={[styles.promptText, s.subText]}>
                                Search for any topic, person, or event
                            </Text>
                            <Text style={[styles.promptHint, s.hint]}>
                                Results are shown in your preferred language
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                ) : (
                    <ArticleList
                        articles={articles}
                        status={status}
                        error={error}
                        hasMore={hasMore}
                        onEndReached={loadMore}
                        onArticlePress={handleArticlePress}
                        emptyMessage={`No results for "${query}"`}
                    />
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    flex: { flex: 1 },
    prompt: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    promptIcon: { fontSize: 52, marginBottom: 16 },
    promptText: { fontSize: 16, fontWeight: '600', textAlign: 'center', marginBottom: 8 },
    promptHint: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
});

const light = StyleSheet.create({
    container: { backgroundColor: '#f5f5f5' },
    subText: { color: '#333' },
    hint: { color: '#999' },
});
const dark = StyleSheet.create({
    container: { backgroundColor: '#121212' },
    subText: { color: '#ccc' },
    hint: { color: '#666' },
});

export default SearchScreen;