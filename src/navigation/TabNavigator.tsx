import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, useColorScheme } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { TabParamList } from '../types';

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
    const isDark = useColorScheme() === 'dark';

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
                    borderTopColor: isDark ? '#333' : '#e0e0e0',
                },
                tabBarActiveTintColor: '#1a73e8',
                tabBarInactiveTintColor: isDark ? '#666' : '#aaa',
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen as any}
                options={{ tabBarLabel: 'Home', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⌂</Text> }}
            />
            <Tab.Screen
                name="Search"
                component={SearchScreen as any}
                options={{ tabBarLabel: 'Search', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⌕</Text> }}
            />
            <Tab.Screen
                name="Bookmarks"
                component={BookmarksScreen as any}
                options={{ tabBarLabel: 'Saved', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>♡</Text> }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen as any}
                options={{ tabBarLabel: 'Settings', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⚙</Text> }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;