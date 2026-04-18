import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import { AppStackParamList } from '../types';
import TabNavigator from './TabNavigator';
import ArticleDetailScreen from '../screens/ArticleDetailScreen';
import { useAppSelector } from "../store";

const Stack = createNativeStackNavigator<AppStackParamList>();

const RootNavigator = () => {
    const isDark = useAppSelector(state => state.preferences.theme) === 'dark';

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
        </Stack.Navigator>
    );
};

export default RootNavigator;