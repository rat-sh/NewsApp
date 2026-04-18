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
import { registerUser, clearError } from '../../store/slices/authSlice';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen = ({ navigation }: Props) => {
    const isDark = useColorScheme() === 'dark';
    const dispatch = useAppDispatch();
    const { isLoading, error } = useAppSelector(state => state.auth);
    const s = isDark ? dark : light;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [localError, setLocalError] = useState('');

    const validate = () => {
        if (!name.trim()) return 'Name is required.';
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return 'Enter a valid email.';
        if (password.length < 6) return 'Password must be at least 6 characters.';
        if (password !== confirm) return 'Passwords do not match.';
        return null;
    };

    const handleRegister = useCallback(async () => {
        const validationError = validate();
        if (validationError) {
            setLocalError(validationError);
            return;
        }
        setLocalError('');
        dispatch(clearError());
        await dispatch(registerUser({ email: email.trim(), password, name: name.trim() }));
    }, [name, email, password, confirm, dispatch]);

    const displayError = localError || error;

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
                    {/* Back */}
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Text style={[styles.backText, { color: '#1a73e8' }]}>← Back</Text>
                    </TouchableOpacity>

                    <Text style={styles.logo}>✨</Text>
                    <Text style={[styles.title, s.title]}>Create account</Text>
                    <Text style={[styles.subtitle, s.subtitle]}>Join NewsFlow today</Text>

                    {displayError ? (
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>{displayError}</Text>
                        </View>
                    ) : null}

                    {[
                        { label: 'Full Name', value: name, set: setName, type: 'default', placeholder: 'John Doe', secure: false },
                        { label: 'Email', value: email, set: setEmail, type: 'email-address', placeholder: 'you@example.com', secure: false },
                        { label: 'Password', value: password, set: setPassword, type: 'default', placeholder: '••••••••', secure: true },
                        { label: 'Confirm Password', value: confirm, set: setConfirm, type: 'default', placeholder: '••••••••', secure: true },
                    ].map(field => (
                        <View key={field.label} style={styles.fieldWrapper}>
                            <Text style={[styles.label, s.label]}>{field.label}</Text>
                            <TextInput
                                style={[styles.input, s.input]}
                                value={field.value}
                                onChangeText={field.set}
                                keyboardType={field.type as any}
                                autoCapitalize={field.type === 'email-address' ? 'none' : 'words'}
                                autoCorrect={false}
                                placeholder={field.placeholder}
                                placeholderTextColor={isDark ? '#555' : '#bbb'}
                                secureTextEntry={field.secure}
                                returnKeyType="next"
                            />
                        </View>
                    ))}

                    <TouchableOpacity
                        style={[styles.btn, isLoading && styles.btnDisabled]}
                        onPress={handleRegister}
                        disabled={isLoading}
                        activeOpacity={0.85}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.btnText}>Create Account</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Login')}>
                        <Text style={[styles.linkText, s.subtitle]}>
                            Already have an account?{' '}
                            <Text style={styles.linkAccent}>Sign in</Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1 },
    content: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
    backBtn: { marginBottom: 20 },
    backText: { fontSize: 15, fontWeight: '600' },
    logo: { fontSize: 48, marginBottom: 16 },
    title: { fontSize: 28, fontWeight: '800', marginBottom: 4 },
    subtitle: { fontSize: 15, marginBottom: 24 },
    errorBox: { backgroundColor: '#fdecea', borderRadius: 10, padding: 12, marginBottom: 16 },
    errorText: { color: '#c62828', fontSize: 13 },
    fieldWrapper: { marginBottom: 14 },
    label: { fontSize: 12, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
    input: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, borderWidth: 1.5 },
    btn: { backgroundColor: '#1a73e8', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 10, marginBottom: 20 },
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

export default RegisterScreen;