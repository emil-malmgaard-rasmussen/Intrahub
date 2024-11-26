import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import ApvListScreen from './ApvListScreen.tsx';
import NetworkDetailScreen from '../networks/NetworkDetailScreen.tsx';
import useThemeContext from '../../theme/useThemeContext.ts';
import ApvDetailScreen from './ApvDetailScreen.tsx';

const ApvStackNavigator = () => {
  const stack = createNativeStackNavigator();
  const {colors} = useThemeContext();

  return (
    <stack.Navigator initialRouteName={'ApvList'}>
      <stack.Screen
        name="ApvList"
        component={ApvListScreen}
        options={{
          headerShown: true,
          title: "APV'er",
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
        name="ApvDetail"
        component={ApvDetailScreen}
        options={{
          headerShown: false,
        }}
      />
    </stack.Navigator>
  );
};

export default ApvStackNavigator;
