import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Animated,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    useColorScheme,
    Dimensions,
    Keyboard,
} from 'react-native';
import { Article, ChatMessage, Language } from '../types';
import { sendChatMessage, summarizeArticle } from '../services/aiService';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.65;

interface Props {
    article: Article;
    language: Language;
    visible: boolean;
    onClose: () => void;
}

const ChatBottomSheet = ({ article, language, visible, onClose }: Props) => {
    const isDark = useColorScheme() === 'dark';
    const s = isDark ? dark : light;

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);

    const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);

    // ── Sheet animation ────────────────────────────────────────────────────
    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(translateY, {
                    toValue: 0,
                    tension: 65,
                    friction: 10,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto-summarize on first open
            if (messages.length === 0) {
                autoSummarize();
            }
        } else {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: SHEET_HEIGHT,
                    duration: 220,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    const autoSummarize = async () => {
        setIsSummarizing(true);
        try {
            const summary = await summarizeArticle(article, language);
            const assistantMsg: ChatMessage = {
                id: `auto-${Date.now()}`,
                role: 'assistant',
                content: summary,
                timestamp: Date.now(),
            };
            setMessages([assistantMsg]);
        } catch (err: any) {
            const errorMsg: ChatMessage = {
                id: `err-${Date.now()}`,
                role: 'assistant',
                content: `⚠️ Couldn't load summary: ${err.message}`,
                timestamp: Date.now(),
            };
            setMessages([errorMsg]);
        } finally {
            setIsSummarizing(false);
        }
    };

    const handleSend = useCallback(async () => {
        const text = input.trim();
        if (!text || isSending) return;

        const userMsg: ChatMessage = {
            id: `u-${Date.now()}`,
            role: 'user',
            content: text,
            timestamp: Date.now(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsSending(true);
        Keyboard.dismiss();

        try {
            const reply = await sendChatMessage(article, messages, text, language);
            const assistantMsg: ChatMessage = {
                id: `a-${Date.now()}`,
                role: 'assistant',
                content: reply,
                timestamp: Date.now(),
            };
            setMessages(prev => [...prev, assistantMsg]);
        } catch (err: any) {
            const errorMsg: ChatMessage = {
                id: `err-${Date.now()}`,
                role: 'assistant',
                content: `⚠️ ${err.message}`,
                timestamp: Date.now(),
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsSending(false);
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }
    }, [input, isSending, article, messages, language]);

    if (!visible) return null;

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            {/* Backdrop */}
            <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
                <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
            </Animated.View>

            {/* Sheet */}
            <Animated.View
                style={[
                    styles.sheet,
                    s.sheet,
                    { transform: [{ translateY }], height: SHEET_HEIGHT },
                ]}
            >
                {/* Handle */}
                <View style={styles.handleWrapper}>
                    <View style={[styles.handle, s.handle]} />
                </View>

                {/* Header */}
                <View style={[styles.header, s.border]}>
                    <Text style={[styles.headerTitle, s.text]}>🤖 AI Assistant</Text>
                    <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Text style={[styles.closeBtn, s.subText]}>✕</Text>
                    </TouchableOpacity>
                </View>

                {/* Summarizing state */}
                {isSummarizing && (
                    <View style={styles.summarizing}>
                        <ActivityIndicator size="small" color="#1a73e8" />
                        <Text style={[styles.summarizingText, s.subText]}>Summarizing article…</Text>
                    </View>
                )}

                {/* Message list */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View
                            style={[
                                styles.bubble,
                                item.role === 'user'
                                    ? [styles.userBubble, s.userBubble]
                                    : [styles.aiBubble, s.aiBubble],
                            ]}
                        >
                            <Text
                                style={[
                                    styles.bubbleText,
                                    item.role === 'user' ? styles.userText : s.text,
                                ]}
                            >
                                {item.content}
                            </Text>
                        </View>
                    )}
                    contentContainerStyle={styles.messageList}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />

                {/* Input */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={20}
                >
                    <View style={[styles.inputRow, s.border]}>
                        <TextInput
                            style={[styles.textInput, s.textInput]}
                            value={input}
                            onChangeText={setInput}
                            placeholder="Ask about this article…"
                            placeholderTextColor={isDark ? '#555' : '#aaa'}
                            multiline
                            maxLength={500}
                            returnKeyType="send"
                            onSubmitEditing={handleSend}
                        />
                        <TouchableOpacity
                            style={[styles.sendBtn, (!input.trim() || isSending) && styles.sendBtnDisabled]}
                            onPress={handleSend}
                            disabled={!input.trim() || isSending}
                        >
                            {isSending ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.sendIcon}>↑</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    handleWrapper: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 4,
    },
    handle: {
        width: 36,
        height: 4,
        borderRadius: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    closeBtn: {
        fontSize: 18,
    },
    summarizing: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 8,
    },
    summarizingText: {
        fontSize: 13,
    },
    messageList: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 8,
        flexGrow: 1,
    },
    bubble: {
        maxWidth: '82%',
        padding: 12,
        borderRadius: 14,
        marginVertical: 3,
    },
    userBubble: {
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
    },
    bubbleText: {
        fontSize: 14,
        lineHeight: 20,
    },
    userText: {
        color: '#fff',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderTopWidth: StyleSheet.hairlineWidth,
        gap: 8,
    },
    textInput: {
        flex: 1,
        fontSize: 14,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        maxHeight: 90,
    },
    sendBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#1a73e8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendBtnDisabled: {
        backgroundColor: '#aaa',
    },
    sendIcon: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});

const light = StyleSheet.create({
    sheet: { backgroundColor: '#fff' },
    handle: { backgroundColor: '#ddd' },
    border: { borderColor: '#eee' },
    text: { color: '#111' },
    subText: { color: '#888' },
    userBubble: { backgroundColor: '#1a73e8' },
    aiBubble: { backgroundColor: '#f0f4ff' },
    textInput: { backgroundColor: '#f0f0f0', color: '#111' },
});

const dark = StyleSheet.create({
    sheet: { backgroundColor: '#1a1a1a' },
    handle: { backgroundColor: '#444' },
    border: { borderColor: '#333' },
    text: { color: '#f0f0f0' },
    subText: { color: '#888' },
    userBubble: { backgroundColor: '#4fa3f7' },
    aiBubble: { backgroundColor: '#2a2a2a' },
    textInput: { backgroundColor: '#2a2a2a', color: '#f0f0f0' },
});

export default ChatBottomSheet;