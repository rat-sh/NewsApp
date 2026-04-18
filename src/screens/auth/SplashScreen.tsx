import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    useColorScheme,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types';
import { useAppSelector } from '../../store';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

const SplashScreen = ({ navigation }: Props) => {
    const isDark = useColorScheme() === 'dark';
    const user = useAppSelector(state => state.auth.user);
    const onboardingComplete = useAppSelector(state => state.preferences.onboardingComplete);

    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        // Animate logo in
        Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.spring(scale, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
        ]).start();

        // After a short delay, route based on state
        const timer = setTimeout(() => {
            if (user) {
                // Already authenticated — RootNavigator handles the switch to App
                // This screen is only shown on first launch (before rehydration completes)
                // Navigation to App is handled by RootNavigator watching auth state
            } else if (!onboardingComplete) {
                navigation.replace('Onboarding');
            } else {
                navigation.replace('Login');
            }
        }, 1800);

        return () => clearTimeout(timer);
    }, [user, onboardingComplete, navigation, opacity, scale]);

    return (
        <View style={[styles.container, isDark ? dark.container : light.container]}>
            <Animated.View style={{ opacity, transform: [{ scale }] }}>
                <Text style={styles.logo}>📰</Text>
                <Text style={[styles.title, isDark ? dark.title : light.title]}>NewsFlow</Text>
                <Text style={[styles.tagline, isDark ? dark.tagline : light.tagline]}>
                    The world in your language
                </Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        fontSize: 72,
        textAlign: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    tagline: {
        fontSize: 15,
        textAlign: 'center',
        marginTop: 8,
        letterSpacing: 0.3,
    },
});

const light = StyleSheet.create({
    container: { backgroundColor: '#ffffff' },
    title: { color: '#111' },
    tagline: { color: '#888' },
});

const dark = StyleSheet.create({
    container: { backgroundColor: '#0d0d0d' },
    title: { color: '#f0f0f0' },
    tagline: { color: '#777' },
});

export default SplashScreen;