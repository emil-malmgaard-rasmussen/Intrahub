import React, {useContext, useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {NavigationContainer} from '@react-navigation/native';
import {ActivityIndicator, Text, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useRecoilValue, useResetRecoilState} from 'recoil';
import {
  createUserAtom,
  creatingUserAtom,
  loginMethodAtom,
} from '../utils/Atoms.ts';
import AuthStackNavigator from '../features/auth/AuthStackNavigator.tsx';
import {AuthContext} from '../auth/AuthProvider.tsx';
import AppDrawerStack from './AppStack.tsx';

const Router = () => {
  const {user, setUser} = useContext<any>(AuthContext);
  const [loading, setLoading] = useState(true);
  const userRef = firestore().collection('USERS');
  const creatingUser = useRecoilValue(creatingUserAtom);

  const onAuthStateChanged = async (authUser: any) => {
    setLoading(true)
    if (authUser && !creatingUser) {
      await userRef
        .doc(authUser.uid)
        .get()
    }

    setUser(authUser);
    setLoading(false);
  };

  useEffect(() => {
    return auth().onAuthStateChanged(onAuthStateChanged);
  }, []);

  if (loading || creatingUser) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  // return (
  //   <NavigationContainer>
  //     {user ? (
  //       previousLoginType === 'user' ? <UsersAppStack /> : <CompaniesAppStack />
  //       )
  //     ) : (
  //       <AuthStackNavigator />
  //     )}
  //   </NavigationContainer>
  // );
  return (
    <NavigationContainer>
      {user ? <AppDrawerStack /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
};

export default Router;
