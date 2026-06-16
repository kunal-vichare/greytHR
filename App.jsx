import './src/gesture-handler.native';
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/Context/AuthContext';
import { AppProvider } from './src/Context/AppContext';
import AppNavigation from './src/navigation/index';
import { COLORS } from './src/Constants/colors';

const App = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <NavigationContainer>
          <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
          <AppNavigation />
        </NavigationContainer>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;