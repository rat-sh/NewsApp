import React, { useRef, useCallback } from 'react';
import {
    ScrollView,
    TouchableOpacity,
    Text,
    StyleSheet,
    useColorScheme,
    View,
} from 'react-native';
import { Category, CATEGORY_LABELS } from '../types';

const CATEGORIES: Category[] = [
    'general',
    'technology',
    'sports',
    'business',
    'entertainment',
    'health',
    'science',
];

interface Props {
    selected: Category;
    onSelect: (category: Category) => void;
}

const CategoryTabs = ({ selected, onSelect }: Props) => {
    const isDark = useColorScheme() === 'dark';
    const scrollRef = useRef<ScrollView>(null);

    const handleSelect = useCallback(
        (cat: Category, index: number) => {
            onSelect(cat);
            // Scroll selected tab into view
            scrollRef.current?.scrollTo({ x: index * 90, animated: true });
        },
        [onSelect],
    );

    return (
        <View style={[styles.wrapper, isDark ? darkStyles.wrapper : lightStyles.wrapper]}>
            <ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.container}
                bounces={false}
            >
                {CATEGORIES.map((cat, index) => {
                    const isSelected = cat === selected;
                    return (
                        <TouchableOpacity
                            key={cat}
                            style={[
                                styles.tab,
                                isSelected && styles.tabSelected,
                                isDark
                                    ? isSelected
                                        ? darkStyles.tabSelected
                                        : darkStyles.tab
                                    : isSelected
                                        ? lightStyles.tabSelected
                                        : lightStyles.tab,
                            ]}
                            onPress={() => handleSelect(cat, index)}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.label,
                                    isSelected && styles.labelSelected,
                                    isDark
                                        ? isSelected
                                            ? darkStyles.labelSelected
                                            : darkStyles.label
                                        : isSelected
                                            ? lightStyles.labelSelected
                                            : lightStyles.label,
                                ]}
                            >
                                {CATEGORY_LABELS[cat]}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    container: {
        paddingHorizontal: 12,
        gap: 8,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1.5,
    },
    tabSelected: {
        borderWidth: 0,
    },
    label: {
        fontSize: 13,
        fontWeight: '500',
    },
    labelSelected: {
        fontWeight: '700',
    },
});

const lightStyles = StyleSheet.create({
    wrapper: { backgroundColor: '#fff', borderBottomColor: '#e0e0e0' },
    tab: { backgroundColor: '#f5f5f5', borderColor: '#ddd' },
    tabSelected: { backgroundColor: '#1a73e8' },
    label: { color: '#444' },
    labelSelected: { color: '#fff' },
});

const darkStyles = StyleSheet.create({
    wrapper: { backgroundColor: '#1a1a1a', borderBottomColor: '#333' },
    tab: { backgroundColor: '#2a2a2a', borderColor: '#444' },
    tabSelected: { backgroundColor: '#4fa3f7' },
    label: { color: '#bbb' },
    labelSelected: { color: '#000' },
});

export default CategoryTabs;