import React, { useRef, useEffect } from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    Animated,
    useColorScheme,
} from 'react-native';

interface Props {
    onPress: () => void;
    isOnline: boolean;
}

const FloatingChatButton = ({ onPress, isOnline }: Props) => {
    const isDark = useColorScheme() === 'dark';
    const scale = useRef(new Animated.Value(0)).current;
    const pulse = useRef(new Animated.Value(1)).current;

    // Mount animation
    useEffect(() => {
        Animated.spring(scale, {
            toValue: 1,
            tension: 80,
            friction: 6,
            useNativeDriver: true,
        }).start();
    }, [scale]);

    // Pulse animation when online
    useEffect(() => {
        if (!isOnline) return;
        const anim = Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1.08, duration: 900, useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
            ]),
        );
        anim.start();
        return () => anim.stop();
    }, [isOnline, pulse]);

    return (
        <Animated.View style={[styles.wrapper, { transform: [{ scale }, { scale: pulse }] }]}>
            <TouchableOpacity
                style={[
                    styles.fab,
                    isOnline
                        ? isDark
                            ? dark.fab
                            : light.fab
                        : isDark
                            ? dark.fabOff
                            : light.fabOff,
                ]}
                onPress={isOnline ? onPress : undefined}
                activeOpacity={isOnline ? 0.8 : 1}
            >
                <Text style={styles.icon}>🤖</Text>
                {!isOnline && (
                    <Text style={styles.offlineDot}>•</Text>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 28,
        right: 20,
        zIndex: 100,
    },
    fab: {
        width: 58,
        height: 58,
        borderRadius: 29,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
    },
    icon: {
        fontSize: 26,
    },
    offlineDot: {
        position: 'absolute',
        bottom: 6,
        right: 6,
        fontSize: 12,
        color: '#f44336',
    },
});

const light = StyleSheet.create({
    fab: { backgroundColor: '#1a73e8' },
    fabOff: { backgroundColor: '#c5c5c5' },
});

const dark = StyleSheet.create({
    fab: { backgroundColor: '#4fa3f7' },
    fabOff: { backgroundColor: '#444' },
});

export default FloatingChatButton;