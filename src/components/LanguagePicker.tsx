import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    useColorScheme,
    ScrollView,
} from 'react-native';
import { Language, LANGUAGE_LABELS } from '../types';
import { useAppSelector } from "../store";

const LANGUAGES = Object.entries(LANGUAGE_LABELS) as [Language, string][];

interface Props {
    selected: Language;
    onSelect: (lang: Language) => void;
}

const LanguagePicker = ({ selected, onSelect }: Props) => {
    const isDark = useAppSelector(state => state.preferences.theme) === 'dark';
    const s = isDark ? dark : light;

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
            bounces={false}
        >
            {LANGUAGES.map(([code, label]) => {
                const isSelected = code === selected;
                return (
                    <TouchableOpacity
                        key={code}
                        style={[styles.pill, s.pill, isSelected && s.pillSelected]}
                        onPress={() => onSelect(code)}
                        activeOpacity={0.75}
                    >
                        <Text style={[styles.code, s.code]}>{code.toUpperCase()}</Text>
                        <Text style={[styles.label, s.label, isSelected && s.labelSelected]}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        gap: 8,
        paddingVertical: 4,
    },
    pill: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1.5,
        alignItems: 'center',
        minWidth: 70,
    },
    code: {
        fontSize: 11,
        fontWeight: '700',
        marginBottom: 2,
        letterSpacing: 0.5,
    },
    label: {
        fontSize: 12,
    },
});

const light = StyleSheet.create({
    pill: { backgroundColor: '#f5f5f5', borderColor: '#ddd' },
    pillSelected: { backgroundColor: '#1a73e8', borderColor: '#1a73e8' },
    code: { color: '#888' },
    label: { color: '#444' },
    labelSelected: { color: '#fff' },
});

const dark = StyleSheet.create({
    pill: { backgroundColor: '#2a2a2a', borderColor: '#444' },
    pillSelected: { backgroundColor: '#4fa3f7', borderColor: '#4fa3f7' },
    code: { color: '#888' },
    label: { color: '#ccc' },
    labelSelected: { color: '#000' },
});

export default LanguagePicker;