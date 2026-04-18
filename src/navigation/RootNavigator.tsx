import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import { useAppSelector } from '../store';
import { AppStackParamList } from '../types';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import ArticleDetailScreen from '../screens/ArticleDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

const RootNavigator = () => {
    const isDark = useColorScheme() === 'dark';
    const user = useAppSelector(state => state.auth.user);

    if (!user) {
        return <AuthNavigator />;
    }

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: isDark ? '#0d0d0d' : '#f5f5f5',
                },
            }}
        >
            <Stack.Screen name="Tabs" component={TabNavigator} />
            <Stack.Screen
                name="ArticleDetail"
                component={ArticleDetailScreen}
                options={{
                    animation: 'slide_from_right',
                }}
            />
            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    headerShown: true,
                    title: 'Settings',
                    animation: 'slide_from_right',
                    headerStyle: {
                        backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
                    },
                    headerTintColor: isDark ? '#f0f0f0' : '#111',
                    headerTitleStyle: { fontWeight: '700' },
                }}
            />
        </Stack.Navigator>
    );
};

export default RootNavigator;