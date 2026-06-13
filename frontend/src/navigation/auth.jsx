import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import CompanyRegisterScreen from '../screens/auth/CompanyRegisterScreen';
import EmployeeRegisterScreen from '../screens/auth/EmployeeRegisterScreen';

const Stack = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#0B0F19' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="CompanyRegister" component={CompanyRegisterScreen} />
      <Stack.Screen name="EmployeeRegister" component={EmployeeRegisterScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;