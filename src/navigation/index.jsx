import React, { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import AuthNavigator from './auth';
import MainNavigator from './mainStack';

export const AppNavigation = () => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <AuthNavigator />;
  }

  return <MainNavigator />;
};

export default AppNavigation;
