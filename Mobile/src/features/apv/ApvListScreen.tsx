import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Platform, SafeAreaView, Text, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import SearchBar from '../../components/SearchBar.tsx';
import ApvList from './components/lists/ApvList.tsx';
import auth from '@react-native-firebase/auth';
import {EmployeeApvModel} from '../../firebase/models/EmployeeApvModel.tsx';

const ApvListScreen = ({navigation}) => {
  const [apvs, setApvs] = useState<any[]>([]); // Default to empty array
  const [searchQuery, setSearchQuery] = useState<string>('');
  const currentUser = auth().currentUser;
  const bottomSheetRef = useRef<any>();
  console.log(currentUser?.uid)
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleNavigateToApv = item => {
    navigation.navigate('ApvDetail', {apv: item});
  };

  const getApvs = async () => {
    const networksSnapshot = await firestore()
      .collection('APV')
      .where('apvType', '==', 'employeeApv')
      .get();

    const matchingApvs = networksSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() } as EmployeeApvModel)) // Ensure correct typing here
      .filter((apv) =>
        apv.participants?.some((participant) => participant.uid === currentUser?.uid)
      );

    setApvs(matchingApvs);
  };

  useEffect(() => {
    if (apvs.length === 0) {
      getApvs();
    }
  }, []);

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
