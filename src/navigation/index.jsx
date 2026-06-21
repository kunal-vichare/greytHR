import React from 'react';
import { useSelector } from 'react-redux';
import AuthNavigator from './auth';
import MainNavigator from './mainStack';

export const AppNavigation = () => {
  const currentUser = useSelector((state) => state.auth.currentUser);

  if (!currentUser) {
    return <AuthNavigator />
  }

  return <MainNavigator />
};

export default AppNavigation;
