import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import AdminNetworksScreen from './AdminNetworksScreen.tsx';
import AdminNetworkDetailScreen from './AdminNetworkDetailScreen.tsx';
import useThemeContext from '../../theme/useThemeContext.ts';
import NetworkPostDetailScreen from '../networks/NetworkPostDetailScreen.tsx';
import AboutScreen from './AboutScreen.tsx';
import HelpScreen from './HelpScreen.tsx';

const HelpStackNavigator = () => {
  const stack = createNativeStackNavigator();
  const {colors} = useThemeContext();

  return (
    <stack.Navigator initialRouteName={'AdminList'}>
      <stack.Screen
        name="Help"
        component={HelpScreen}
        options={{
          headerShown: true,
          title: '',
          headerTitleAlign: 'center',
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: colors.backgrounds.main,
          },
          headerBackTitle: 'Tilbage',
          headerShadowVisible: false,
        }}
      />
    </stack.Navigator>
  );
};

export default HelpStackNavigator;
