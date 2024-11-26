import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from './LoginScreen.tsx';
import RegisterScreen from './RegisterScreen.tsx';
import useThemeContext from '../../theme/useThemeContext.ts';

const AuthStackNavigator = () => {
  const authStackNavigator = createNativeStackNavigator();
  const {colors} = useThemeContext();

  return (
    <authStackNavigator.Navigator>
      <authStackNavigator.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: true,
          title: '',
          headerTitleAlign: 'center',
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: colors.header.main,
          },
          headerBackTitle: 'Tilbage',
          headerShadowVisible: false,
        }}
      />
      <authStackNavigator.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: true,
          title: '',
          headerTitleAlign: 'center',
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: colors.header.main,
          },
          headerBackTitle: 'Tilbage',
          headerShadowVisible: false,
        }}
      />
    </authStackNavigator.Navigator>
  );
};

export default AuthStackNavigator;
