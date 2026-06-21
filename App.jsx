import './src/gesture-handler.native';
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import AppNavigation from './src/navigation/index';
import { COLORS } from './src/Constants/colors';

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <AppNavigation />
      </NavigationContainer>
    </Provider>
  );
};

export default App;