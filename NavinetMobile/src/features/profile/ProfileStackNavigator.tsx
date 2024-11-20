import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import ProfileScreen from './ProfileScreen.tsx';

const ProfileStackNavigator = () => {
  const stack = createNativeStackNavigator();

  return (
    <stack.Navigator initialRouteName={'Profile'}>
      <stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />

    </stack.Navigator>
  );
};

export default ProfileStackNavigator;
