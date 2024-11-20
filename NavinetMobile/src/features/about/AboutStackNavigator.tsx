import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import useThemeContext from '../../theme/useThemeContext.ts';
import AboutScreen from './AboutScreen.tsx';

const AboutStackNavigator = () => {
  const stack = createNativeStackNavigator();
  const {colors} = useThemeContext();

  return (
    <stack.Navigator initialRouteName={'AdminList'}>
      <stack.Screen
        name="About"
        component={AboutScreen}
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

export default AboutStackNavigator;
