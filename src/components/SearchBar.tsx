import React from 'react';
import { useAppSelector } from "../store";
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
    useColorScheme,
} from 'react-native';

interface Props {
    value: string;
    onChangeText: (text: string) => void;
    onClear: () => void;
    placeholder?: string;
}

const SearchBar = ({ value, onChangeText, onClear, placeholder = 'Search news…' }: Props) => {
    const isDark = useAppSelector(state => state.preferences.theme) === 'dark';
    const s = isDark ? dark : light;

    return (
        <View style={[styles.wrapper, s.wrapper]}>
            <Text style={styles.icon}>🔍</Text>
            <TextInput
                style={[styles.input, s.input]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={isDark ? '#666' : '#aaa'}
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="none"
                clearButtonMode="never"
            />
            {value.length > 0 && (
                <TouchableOpacity
                    onPress={onClear}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <View style={[styles.clearBtn, s.clearBtn]}>
                        <Text style={[styles.clearText, s.clearText]}>✕</Text>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        height: 46,
    },
    icon: {
        fontSize: 16,
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 15,
        paddingVertical: 0,
    },
    clearBtn: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 6,
    },
    clearText: {
        fontSize: 11,
        fontWeight: '700',
    },
});

const light = StyleSheet.create({
    wrapper: { backgroundColor: '#efefef' },
    input: { color: '#111' },
    clearBtn: { backgroundColor: '#bbb' },
    clearText: { color: '#fff' },
});

const dark = StyleSheet.create({
    wrapper: { backgroundColor: '#2a2a2a' },
    input: { color: '#f0f0f0' },
    clearBtn: { backgroundColor: '#555' },
    clearText: { color: '#ddd' },
});

export default SearchBar;