import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Platform, SafeAreaView, Text, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import SearchBar from '../../components/SearchBar.tsx';
import ApvList from './components/lists/ApvList.tsx';

const ApvListScreen = ({navigation}) => {
  const [apvs, setApvs] = useState<any[]>([]); // Default to empty array
  const [searchQuery, setSearchQuery] = useState<string>('');

  const bottomSheetRef = useRef<any>();

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleNavigateToApv = item => {
    navigation.navigate('ApvDetail', {apv: item});
  };

  const getApvs = async () => {
    const networksSnapshot = await firestore().collection('APV').where('apvType', '==', 'employeeApv').get();

    setApvs(
      networksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })),
    );
  };

  useEffect(() => {
    if (apvs.length === 0) {
      getApvs();
    }
  }, [apvs]);

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
            Apv
          </Text>
          <ApvList networks={apvs} navigation={handleNavigateToApv} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ApvListScreen;
