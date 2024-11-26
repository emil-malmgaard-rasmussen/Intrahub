import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import NetworksScreen from './NetworksScreen.tsx';
import NetworkDetailScreen from './NetworkDetailScreen.tsx';
import NetworkPostDetailScreen from './NetworkPostDetailScreen.tsx';
import useThemeContext from '../../theme/useThemeContext.ts';

const NetworkStackNavigator = () => {
  const stack = createNativeStackNavigator();
  const {colors} = useThemeContext();

  return (
    <stack.Navigator>
      <stack.Screen
        name="NetworkList"
        component={NetworksScreen}
        options={{
          headerShown: true,
          title: 'Mine netværk',
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
      <stack.Screen
        name="NetworkDetail"
        component={NetworkDetailScreen}
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

export default NetworkStackNavigator;
