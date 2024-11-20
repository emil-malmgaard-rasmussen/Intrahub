import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import AdminStackNavigator from '../features/admin/AdminStackNavigator.tsx';
import ProfileStackNavigator from '../features/profile/ProfileStackNavigator.tsx';
import AboutStackNavigator from '../features/about/AboutStackNavigator.tsx';
import HelpStackNavigator from '../features/help/HelpStackNavigator.tsx';
import ApvListScreen from '../features/apv/ApvListScreen.tsx';
import ApvStackNavigator from '../features/apv/ApvStackNavigator.tsx';

const MoreStack = createDrawerNavigator();

const MoreStackNavigator = () => {
    return (
        <MoreStack.Navigator screenOptions={{swipeEdgeWidth: 0}}>
            <MoreStack.Screen
                name="ProfileStack"
                component={ProfileStackNavigator}
                options={{
                    headerShown: false,
                }}
            />
          <MoreStack.Screen
            name="ApvStack"
            component={ApvStackNavigator}
            options={{
              headerShown: false,
            }}
          />
          <MoreStack.Screen
            name="AdminNetworkStack"
            component={AdminStackNavigator}
            options={{
              headerShown: false,
            }}
          />
          <MoreStack.Screen
            name="AboutStack"
            component={AboutStackNavigator}
            options={{
              headerShown: false,
            }}
          />
          <MoreStack.Screen
            name="HelpStack"
            component={HelpStackNavigator}
            options={{
              headerShown: false,
            }}
          />
        </MoreStack.Navigator>
    );
};

export default MoreStackNavigator;
