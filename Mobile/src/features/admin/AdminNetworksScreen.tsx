import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Platform, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import SearchBar from '../../components/SearchBar.tsx';
import NetworksList from '../../components/lists/NetworksList.tsx';
import auth from '@react-native-firebase/auth';

const AdminNetworksScreen = ({navigation}) => {
  const [networks, setNetworks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const bottomSheetRef = useRef<any>();

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleNavigateToUserProfile = item => {
    navigation.navigate('AdminDetail', {network: item});
  };

  const getNetworks = async () => {
    const user = auth().currentUser;
    const networksSnapshot = await firestore()
      .collection('NETWORKS')
      .where('administrators', 'array-contains', user!.uid)
      .get();

    setNetworks(networksSnapshot.docs.map(doc => doc.data()));
  };

  useEffect(() => {
    if (networks.length === 0) {
      getNetworks();
    }
  }, [networks]);

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
            networks={networks}
            navigation={handleNavigateToUserProfile}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
  },
  search: {
    borderColor: '#ccc',
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 15,
    flex: 4 / 5,
  },
  filterContainer: {
    flex: 1 / 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filter: {},
});

export default AdminNetworksScreen;
