import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {DrawerContentComponentProps} from '@react-navigation/drawer/src/types';
import React, {useContext} from 'react';
import {useRecoilState} from 'recoil';
import {AuthContext} from '../auth/AuthProvider.tsx';
import {activeSideBarAtom} from '../utils/Atoms.ts';

const CustomDrawer = (props: DrawerContentComponentProps) => {
  const [active, setActive] = useRecoilState(activeSideBarAtom);
  const {logout} = useContext<any>(AuthContext);

  return (
    <View style={[{flex: 1}, {backgroundColor: '#fff'}]}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          backgroundColor: '#fff',
          zIndex: 10,
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            paddingTop: 10,
          }}>
          <DrawerItem
            focused={active === '1'}
            label="Profil"
            labelStyle={{color: '#000'}}
            onPress={() => {
              props.navigation.navigate('MoreStack', {
                screen: 'ProfileStack',
              });
              setActive('1');
            }}
          />
          <DrawerItem
            focused={active === '2'}
            label="Apv"
            labelStyle={{color: '#000'}}
            onPress={() => {
              props.navigation.navigate('MoreStack', {
                screen: 'ApvStack',
              });
              setActive('2');
            }}
          />
          <DrawerItem
            focused={active === '3'}
            label="Administrer"
            labelStyle={{color: '#000'}}
            onPress={() => {
              props.navigation.navigate('MoreStack', {
                screen: 'AdminNetworkStack',
              });
              setActive('3');
            }}
          />
          <DrawerItem
            focused={active === '4'}
            label="Om"
            labelStyle={{color: '#000'}}
            onPress={() => {
              props.navigation.navigate('MoreStack', {
                screen: 'AboutStack',
              });
              setActive('4');
            }}
          />
          <DrawerItem
            focused={active === '5'}
            label="Hjælp"
            labelStyle={{color: '#000'}}
            onPress={() => {
              props.navigation.navigate('MoreStack', {
                screen: 'HelpStack',
              });
              setActive('5');
            }}
          />
        </View>
      </DrawerContentScrollView>
      {/*<View*/}
      {/*  style={{*/}
      {/*    borderTopWidth: 1,*/}
      {/*    borderTopColor: '#ccc',*/}
      {/*  }}>*/}
      {/*  <Text style={styles.preferences}>Præferencer</Text>*/}
      {/*  <View style={styles.switchTextContainer}>*/}
      {/*    <Switch*/}
      {/*      trackColor={{false: '#767577', true: '#81b0ff'}}*/}
      {/*      thumbColor="#f4f3f4"*/}
      {/*      style={{transform: [{scaleX: 0.9}, {scaleY: 0.9}]}}*/}
      {/*      // onValueChange={on =>*/}
      {/*      //     setColorTheme(on ? 'dark' : 'light')*/}
      {/*      // }*/}
      {/*      // value={colorTheme === 'dark'}*/}
      {/*    />*/}
      {/*    <Text*/}
      {/*      style={{*/}
      {/*        fontSize: 15,*/}
      {/*        color: '#000',*/}
      {/*        paddingLeft: 8,*/}
      {/*      }}>*/}
      {/*      Mørk tema*/}
      {/*    </Text>*/}
      {/*  </View>*/}
      {/*</View>*/}
      <View
        style={{
          padding: 20,
          borderTopWidth: 1,
          borderTopColor: '#ccc',
        }}>
        <TouchableOpacity
          style={{paddingVertical: 15}}
          onPress={() =>
            Alert.alert(
              'Er du sikker?',
              'Er du sikker på, at du vil logge ud?',
              [
                {
                  text: 'Annullér',
                },
                {
                  text: 'OK',
                  onPress: async () => logout(),
                },
              ],
            )
          }>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="exit-outline" size={22} style={{color: '#000'}} />
            <Text
              style={{
                fontSize: 15,
                color: '#000  ',
                marginLeft: 5,
              }}>
              Logud
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  userAvatar: {
    height: 67.5,
    width: 67.5,
    borderRadius: 40,
    marginBottom: 10,
    marginTop: 30,
  },
  switchTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 7,
    paddingVertical: 5,
  },
  preferences: {
    fontSize: 16,
    color: '#ccc',
    paddingTop: 10,
    fontWeight: '500',
    paddingLeft: 20,
  },
  switchText: {
    fontSize: 17,
    color: '',
    paddingTop: 10,
    fontWeight: 'bold',
  },
});
