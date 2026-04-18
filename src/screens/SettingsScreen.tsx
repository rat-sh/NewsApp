import React, { useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    useColorScheme,
    SafeAreaView,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../types';
import { useAppDispatch, useAppSelector } from '../store';
import { setTheme } from '../store/slices/preferencesSlice';

type Props = BottomTabScreenProps<TabParamList, 'Settings'>;

const SettingsScreen = ({ navigation }: Props) => {
    const isDark = useAppSelector(state => state.preferences.theme) === 'dark';
    const dispatch = useAppDispatch();
    const { theme } = useAppSelector(state => state.preferences);
    const s = isDark ? dark : light;

    return (
        <SafeAreaView style={[styles.container, s.container]}>
            <ScrollView contentContainerStyle={styles.content}>

                {/* Appearance */}
                <Text style={[styles.sectionLabel, s.sectionLabel]}>Appearance</Text>
                <View style={[styles.card, s.card, { padding: 6 }]}>
                    <View style={[styles.themeToggleContainer, theme === 'dark' && { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                        <TouchableOpacity
                            style={[
                                styles.themeOption,
                                theme !== 'dark' && styles.themeOptionActiveLight
                            ]}
                            onPress={() => { dispatch(setTheme('light')); }}
                            activeOpacity={0.8}
                        >
                            <Text style={[
                                styles.themeOptionText,
                                theme !== 'dark' ? { color: '#1a73e8', fontWeight: '700' } : s.subtitle
                            ]}>
                                Light
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.themeOption,
                                theme === 'dark' && styles.themeOptionActiveDark
                            ]}
                            onPress={() => { dispatch(setTheme('dark')); }}
                            activeOpacity={0.8}
                        >
                            <Text style={[
                                styles.themeOptionText,
                                theme === 'dark' ? { color: '#4fa3f7', fontWeight: '700' } : s.subtitle
                            ]}>
                                Dark
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* About */}
                <Text style={[styles.sectionLabel, s.sectionLabel]}>About</Text>
                <View style={[styles.card, s.card]}>
                    {[
                        { label: 'Version', value: '1.0.0' },
                        { label: 'News source', value: 'NewsAPI.org' },
                        { label: 'AI provider', value: 'OpenAI GPT-3.5' },
                        { label: 'Backend', value: 'Supabase' },
                    ].map(item => (
                        <View key={item.label} style={[styles.aboutRow, s.border]}>
                            <Text style={[styles.aboutLabel, s.subtitle]}>{item.label}</Text>
                            <Text style={[styles.aboutValue, s.title]}>{item.value}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 16, paddingBottom: 40 },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 8,
        marginLeft: 4,
        marginTop: 8,
    },
    card: { borderRadius: 14, marginBottom: 16, padding: 14, overflow: 'hidden' },
    cardNote: { fontSize: 13, marginBottom: 12, lineHeight: 18 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    rowLabel: { fontSize: 15, fontWeight: '500' },
    aboutRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    aboutLabel: { fontSize: 14 },
    aboutValue: { fontSize: 14, fontWeight: '600' },
    themeToggleContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: 10,
        padding: 4,
    },
    themeOption: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    themeOptionActiveLight: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    themeOptionActiveDark: {
        backgroundColor: '#2a2a2a',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
    },
    themeOptionText: {
        fontSize: 15,
        fontWeight: '500',
    },
});

const light = StyleSheet.create({
    container: { backgroundColor: '#f5f5f5' },
    card: { backgroundColor: '#fff' },
    title: { color: '#111' },
    subtitle: { color: '#777' },
    sectionLabel: { color: '#999' },
    border: { borderColor: '#f0f0f0' },
});
const dark = StyleSheet.create({
    container: { backgroundColor: '#0d0d0d' },
    card: { backgroundColor: '#1a1a1a' },
    title: { color: '#f0f0f0' },
    subtitle: { color: '#888' },
    sectionLabel: { color: '#666' },
    border: { borderColor: '#2a2a2a' },
});

export default SettingsScreen;