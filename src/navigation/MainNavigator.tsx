import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import { useState } from 'react';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';

const MainNavigator = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  return (
    <NavigationContainer>
      {isAuthenticated === 'success' ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default MainNavigator;