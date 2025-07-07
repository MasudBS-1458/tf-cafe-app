import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import { useState } from 'react';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';

const MainNavigator = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const isLoggedIn = isAuthenticated === 'success';
  return (
    <NavigationContainer>
      {isLoggedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default MainNavigator;