import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Platform, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useRecoilValue} from 'recoil';
import {companyFilterAtom} from '../../utils/Atoms.ts';
import SearchBar from '../../components/SearchBar.tsx';
import NetworksList from '../../components/lists/NetworksList.tsx';
import auth from '@react-native-firebase/auth';

const NetworksScreen = ({navigation}) => {
  const [myNetworks, setMyNetworks] = useState<any[]>([]); // Default to empty array
  const [otherNetworks, setOtherNetworks] = useState<any[]>([]);
  const snapshot = firestore().collection('USERS');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const companyFilter = useRecoilValue<companyFilterAtom>(companyFilterAtom);

  const bottomSheetRef = useRef<any>();

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleNavigateToUserProfile = item => {
    navigation.navigate('NetworkDetail', {network: item});
  };

  const getUserNetworks = async () => {
    const user = auth().currentUser;
    const networksSnapshot = await firestore()
      .collection('NETWORKS')
      .where('users', 'array-contains', user!.uid)
      .get();

    setMyNetworks(networksSnapshot.docs.map(doc => doc.data()));
  };

  const getNetworks = async () => {
    const user = auth().currentUser;

    if (!user) return;

    const networksSnapshot = await firestore().collection('NETWORKS').get();

    const tempNetworks = networksSnapshot.docs
      .filter(doc => !doc.data().users.includes(user.uid))
      .map(doc => doc.data());

    setOtherNetworks(tempNetworks);
  };

  useEffect(() => {
    if (myNetworks.length === 0) {
      getUserNetworks();
    }

    // if (otherNetworks.length === 0) {
    //   getNetworks();
    // }
  }, [myNetworks, otherNetworks]);

  return (
    <SafeAreaView
      style={[
        {backgroundColor: '#fff', height: '100%'},
        Platform.OS === 'android' && {paddingTop: 40},
      ]}>
      <View style={{padding: 20, marginBottom: 15}}>
        <SearchBar
          showBottomSheet={() => handlePresentModalPress()}
          data={searchQuery}
          setData={setSearchQuery}
        />
        <View style={{marginTop: 10}}>
          <Text style={{textDecorationLine: 'underline', color: '#959595'}}>
            Mine netværk
          </Text>
          <NetworksList
            key={'1'}
            networks={myNetworks}
            navigation={handleNavigateToUserProfile}
          />
        </View>
        {/*<View style={{marginTop: 10}}>*/}
        {/*  <Text style={{textDecorationLine: 'underline', color: '#959595'}}>*/}
        {/*    Alle*/}
        {/*  </Text>*/}
        {/*  <NetworksList*/}
        {/*    key={'2'}*/}
        {/*    networks={otherNetworks}*/}
        {/*    navigation={handleNavigateToUserProfile}*/}
        {/*  />*/}
        {/*</View>*/}
      </View>
    </SafeAreaView>
  );
};

export default NetworksScreen;
