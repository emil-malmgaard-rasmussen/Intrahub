import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import OverviewScreen from '../features/overview/OverviewScreen.tsx';
import NetworkStackNavigator from '../features/networks/NetworkStackNavigator.tsx';
import {DrawerActions} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer.tsx';
import MoreStackNavigator from './MoreStackNavigator.tsx';
import useThemeContext from '../theme/useThemeContext.ts';

const Tab = createBottomTabNavigator();

const AppDrawerStack = () => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{drawerPosition: 'right'}}>
      <Drawer.Screen
        options={{headerShown: false}}
        name="Placeholder"
        component={UsersAppStack}
      />
    </Drawer.Navigator>
  );
};

const UsersAppStack = () => {
  const {colors} = useThemeContext();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.navigation.bottom.active,
        headerShown: false,
        unmountOnBlur: true,
      }}>
      <Tab.Screen
        name="OverviewStack"
        component={OverviewScreen}
        options={() => ({
          tabBarStyle: {},
          title: 'Forside',
          tabBarIcon: ({color, size}) => (
            <FontAwesome5 name="home" color={color} size={size} />
          ),
        })}
      />
      <Tab.Screen
        name="NetworksStack"
        component={NetworkStackNavigator}
        options={() => ({
          tabBarStyle: {},
          title: 'Mine Netværk',
          tabBarIcon: ({color, size}) => (
            <FontAwesome name="users" color={color} size={size} />
          ),
        })}
      />
      <Tab.Screen
        name="MoreStack"
        component={MoreStackNavigator}
        listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.dispatch(DrawerActions.toggleDrawer());
          },
        })}
        options={() => ({
          tabBarStyle: {},
          title: 'Mere',
          tabBarIcon: ({color, size}) => (
            <FontAwesome5 name="bars" color={color} size={size} />
          ),

        })}
      />
    </Tab.Navigator>
  );
};

export default AppDrawerStack;
