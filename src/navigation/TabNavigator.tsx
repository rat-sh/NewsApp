import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, useColorScheme } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
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
                options={{ tabBarLabel: 'Home', tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text> }}
            />
            <Tab.Screen
                name="Search"
                component={SearchScreen as any}
                options={{ tabBarLabel: 'Search', tabBarIcon: () => <Text style={{ fontSize: 20 }}>🔍</Text> }}
            />
            <Tab.Screen
                name="Bookmarks"
                component={BookmarksScreen as any}
                options={{ tabBarLabel: 'Bookmarks', tabBarIcon: () => <Text style={{ fontSize: 20 }}>🔖</Text> }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;