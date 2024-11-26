import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import AdminNetworksScreen from './AdminNetworksScreen.tsx';
import AdminNetworkDetailScreen from './AdminNetworkDetailScreen.tsx';
import useThemeContext from '../../theme/useThemeContext.ts';
import NetworkPostDetailScreen from '../networks/NetworkPostDetailScreen.tsx';

const AdminStackNavigator = () => {
  const stack = createNativeStackNavigator();
  const {colors} = useThemeContext();

  return (
    <stack.Navigator initialRouteName={'AdminList'}>
      <stack.Screen
        name="AdminList"
        component={AdminNetworksScreen}
        options={{
          headerShown: true,
          title: 'Admin',
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
      <stack.Screen
        name="AdminDetail"
        component={AdminNetworkDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <stack.Screen
        name="NetworkPostDetail"
        component={NetworkPostDetailScreen}
        options={{
          headerShown: false,
        }}
      />
    </stack.Navigator>
  );
};

export default AdminStackNavigator;
