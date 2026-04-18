import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    useColorScheme,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginUser, clearError } from '../../store/slices/authSlice';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
    const isDark = useAppSelector(state => state.preferences.theme) === 'dark';
    const dispatch = useAppDispatch();
    const { isLoading, error } = useAppSelector(state => state.auth);
    const s = isDark ? dark : light;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const validate = () => {
        if (!email.trim()) return 'Email is required.';
        if (!/\S+@\S+\.\S+/.test(email)) return 'Enter a valid email.';
        if (!password) return 'Password is required.';
        if (password.length < 6) return 'Password must be at least 6 characters.';
        return null;
    };

    const handleLogin = useCallback(async () => {
        const err = validate();
        if (err) return;
        dispatch(clearError());
        await dispatch(loginUser({ email: email.trim(), password }));
        // RootNavigator watches auth state and switches to App automatically
    }, [email, password, dispatch]);

    return (
        <SafeAreaView style={[styles.flex, s.container]}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    bounces={false}
                >
                    <Text style={styles.logo}>📰</Text>
                    <Text style={[styles.title, s.title]}>Welcome back</Text>
                    <Text style={[styles.subtitle, s.subtitle]}>Sign in to NewsFlow</Text>

                    {error ? (
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    {/* Email */}
                    <View style={styles.fieldWrapper}>
                        <Text style={[styles.label, s.label]}>Email</Text>
                        <TextInput
                            style={[styles.input, s.input]}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder="you@example.com"
                            placeholderTextColor={isDark ? '#555' : '#bbb'}
                            returnKeyType="next"
                        />
                    </View>

                    {/* Password */}
                    <View style={styles.fieldWrapper}>
                        <Text style={[styles.label, s.label]}>Password</Text>
                        <View style={[styles.input, s.input, styles.passwordRow]}>
                            <TextInput
                                style={[styles.passwordInput, s.title]}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                placeholder="••••••••"
                                placeholderTextColor={isDark ? '#555' : '#bbb'}
                                returnKeyType="done"
                                onSubmitEditing={handleLogin}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
                                <Text style={s.subtitle}>{showPassword ? '🙈' : '👁'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Login button */}
                    <TouchableOpacity
                        style={[styles.btn, isLoading && styles.btnDisabled]}
                        onPress={handleLogin}
                        disabled={isLoading}
                        activeOpacity={0.85}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.btnText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    {/* Register link */}
                    <TouchableOpacity
                        style={styles.link}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={[styles.linkText, s.subtitle]}>
                            Don't have an account?{' '}
                            <Text style={styles.linkAccent}>Create one</Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1 },
    content: {
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 40,
    },
    logo: { fontSize: 48, marginBottom: 20 },
    title: { fontSize: 28, fontWeight: '800', marginBottom: 4 },
    subtitle: { fontSize: 15, marginBottom: 28 },
    errorBox: {
        backgroundColor: '#fdecea',
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
    },
    errorText: { color: '#c62828', fontSize: 13 },
    fieldWrapper: { marginBottom: 16 },
    label: { fontSize: 13, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
    input: {
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 13,
        fontSize: 15,
        borderWidth: 1.5,
    },
    passwordRow: { flexDirection: 'row', alignItems: 'center' },
    passwordInput: { flex: 1, fontSize: 15, paddingVertical: 0 },
    btn: {
        backgroundColor: '#1a73e8',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 20,
    },
    btnDisabled: { opacity: 0.6 },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    link: { alignItems: 'center' },
    linkText: { fontSize: 14 },
    linkAccent: { color: '#1a73e8', fontWeight: '700' },
});

const light = StyleSheet.create({
    container: { backgroundColor: '#fff' },
    title: { color: '#111' },
    subtitle: { color: '#777' },
    label: { color: '#555' },
    input: { backgroundColor: '#f5f5f5', borderColor: '#e0e0e0', color: '#111' },
});

const dark = StyleSheet.create({
    container: { backgroundColor: '#0d0d0d' },
    title: { color: '#f0f0f0' },
    subtitle: { color: '#888' },
    label: { color: '#aaa' },
    input: { backgroundColor: '#1e1e1e', borderColor: '#333', color: '#f0f0f0' },
});

export default LoginScreen;