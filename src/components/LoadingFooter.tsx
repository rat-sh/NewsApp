import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingFooter = () => (
    <View style={styles.container}>
        <ActivityIndicator size="small" color="#1a73e8" />
    </View>
);

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});

export default LoadingFooter;