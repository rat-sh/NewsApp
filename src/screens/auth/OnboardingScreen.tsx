import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    useColorScheme,
    SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList, Language } from '../../types';
import { useAppDispatch } from '../../store';
import { setLanguage, completeOnboarding } from '../../store/slices/preferencesSlice';
import LanguagePicker from '../../components/LanguagePicker';
import { useAppSelector } from "../../store";

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

const OnboardingScreen = ({ navigation }: Props) => {
    const isDark = useAppSelector(state => state.preferences.theme) === 'dark';
    const dispatch = useAppDispatch();
    const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
    const s = isDark ? dark : light;

    const handleContinue = () => {
        dispatch(setLanguage(selectedLanguage));
        dispatch(completeOnboarding());
        navigation.replace('Login');
    };

    return (
        <SafeAreaView style={[styles.container, s.container]}>
            <ScrollView contentContainerStyle={styles.content} bounces={false}>
                {/* Hero */}
                <Text style={styles.emoji}>🌍</Text>
                <Text style={[styles.title, s.title]}>Read news in{'\n'}your language</Text>
                <Text style={[styles.subtitle, s.subtitle]}>
                    NewsFlow fetches articles and AI summaries in your preferred language.
                    You can change this anytime in Settings.
                </Text>

                {/* Language picker */}
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, s.label]}>Choose your language</Text>
                    <LanguagePicker
                        selected={selectedLanguage}
                        onSelect={setSelectedLanguage}
                    />
                </View>

                {/* Feature highlights */}
                <View style={[styles.features, s.features]}>
                    {FEATURES.map(f => (
                        <View key={f.label} style={styles.featureRow}>
                            <Text style={styles.featureIcon}>{f.icon}</Text>
                            <View style={styles.featureText}>
                                <Text style={[styles.featureTitle, s.title]}>{f.label}</Text>
                                <Text style={[styles.featureDesc, s.subtitle]}>{f.desc}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* CTA */}
                <TouchableOpacity style={styles.btn} onPress={handleContinue} activeOpacity={0.85}>
                    <Text style={styles.btnText}>Get Started →</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const FEATURES = [
    { icon: '📰', label: 'Top Headlines', desc: 'Curated news across 7 categories' },
    { icon: '🔍', label: 'Smart Search', desc: 'Find any story in your language' },
    { icon: '🔖', label: 'Bookmarks', desc: 'Saved articles sync to the cloud' },
    { icon: '🤖', label: 'AI Summaries', desc: 'Summarized in your language, instantly' },
];

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: {
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 40,
        alignItems: 'center',
    },
    emoji: { fontSize: 64, marginBottom: 20 },
    title: {
        fontSize: 30,
        fontWeight: '800',
        textAlign: 'center',
        lineHeight: 38,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 32,
    },
    section: { width: '100%', marginBottom: 28 },
    sectionLabel: {
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 12,
        marginLeft: 4,
    },
    features: {
        width: '100%',
        borderRadius: 14,
        padding: 16,
        marginBottom: 32,
        gap: 14,
    },
    featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
    featureIcon: { fontSize: 22, marginTop: 2 },
    featureText: { flex: 1 },
    featureTitle: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
    featureDesc: { fontSize: 13, lineHeight: 17 },
    btn: {
        backgroundColor: '#1a73e8',
        paddingHorizontal: 40,
        paddingVertical: 16,
        borderRadius: 14,
        width: '100%',
        alignItems: 'center',
    },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

const light = StyleSheet.create({
    container: { backgroundColor: '#fff' },
    title: { color: '#111' },
    subtitle: { color: '#777' },
    label: { color: '#555' },
    features: { backgroundColor: '#f5f8ff' },
});

const dark = StyleSheet.create({
    container: { backgroundColor: '#0d0d0d' },
    title: { color: '#f0f0f0' },
    subtitle: { color: '#888' },
    label: { color: '#aaa' },
    features: { backgroundColor: '#1a1a1a' },
});

export default OnboardingScreen;