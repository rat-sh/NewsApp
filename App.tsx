import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { View, ActivityIndicator } from 'react-native';
import { store, persistor } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';

/**
 * App entry point.
 *
 * Layers:
 *  1. Redux Provider  — makes store available everywhere
 *  2. PersistGate     — waits for rehydration from AsyncStorage before rendering
 *                       Shows a spinner during this brief window (app cold-start)
 *  3. NavigationContainer — required by React Navigation
 *  4. RootNavigator   — decides Auth or App stack based on persisted user state
 */
const LoadingFallback = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
    <ActivityIndicator size="large" color="#1a73e8" />
  </View>
);

const App = () => (
  <Provider store={store}>
    <PersistGate loading={<LoadingFallback />} persistor={persistor}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </PersistGate>
  </Provider>
);

export default App;