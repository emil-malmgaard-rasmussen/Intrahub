import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Image, SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../utils/Dimensions.ts';
import Carousel from 'react-native-reanimated-carousel';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import firestore from '@react-native-firebase/firestore';
import ProfileNetworksTab from './components/tabs/ProfileNetworksTab.tsx';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EditUserForm from './forms/EditUserForm.tsx';
import {useRefreshContext} from '../../navigation/RefreshContext.tsx';
import ProfileInformationTab from './components/tabs/ProfileInformationTab.tsx';
import {useSetRecoilState} from 'recoil';
import {overlayActiveAtom} from '../../utils/Atoms.ts';
import {Overlay} from '../../components/Overlay.tsx';
import useThemeContext from '../../theme/useThemeContext.ts';
import {ThemeColors} from '../../theme/colors.ts';

const ProfileScreen = () => {
  const authUser: any = auth().currentUser;
  const tabRefs = useRef<Array<any>>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const carouselRef = useRef<any>(null);
  const underlinePosition = useRef(new Animated.Value(0)).current;
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const bottomSheetModalRef = useRef<BottomSheetModal | null>(null);
  const [bottomSheetRender, setBottomSheetRender] = useState<
    'edit' | undefined
  >(undefined);
  const underlineScale = useRef(new Animated.Value(1)).current;
  const snapPoints = useMemo(() => ['25%', '50%', '80%'], []);
  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const {refresh} = useRefreshContext();
  const setOverlayActive = useSetRecoilState(overlayActiveAtom);
  const {colors} = useThemeContext();
  const themeStyles = styles(colors);

  const handleCloseSheet = () => {
    bottomSheetModalRef.current?.close();
  };
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setOverlayActive(false);
    }
  }, []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
    setOverlayActive(true);
  }, []);

  const bottomSheetModalHeader = () => {
    switch (bottomSheetRender) {
      case 'edit':
        return (
          <>
            <View style={themeStyles.contentContainer}>
              <Text style={themeStyles.bottomSheetHeaderText}>Rediger</Text>
            </View>
            <BottomSheetScrollView style={{padding: 10}}>
              <EditUserForm user={user} />
            </BottomSheetScrollView>
          </>
        );
      default:
        return null;
    }
  };

  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);

    if (carouselRef.current) {
      carouselRef.current.scrollTo({index, animated: true});
    }

    tabRefs.current[index]?.measure((x, y, width) => {
      underlineScale.setValue(width / ((SCREEN_WIDTH - 60) / 3));

      Animated.timing(underlinePosition, {
        toValue: x, // Position it at the starting x position of the tab
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const getUser = async () => {
    setLoading(true);
    const networksSnapshot = await firestore()
      .collection('USERS')
      .where('uid', '==', authUser!.uid)
      .get();

    setUser(networksSnapshot.docs.map(doc => doc.data())[0]);
    setLoading(false);
  };

  const renderTabContent = (index: number) => {
    switch (index) {
      case 0:
        return (
          <View
            style={{
              backgroundColor: '#e1e1e1',
              flex: 1,
              marginHorizontal: 10,
              borderRadius: 10,
              marginBottom: '20%',
            }}>
            <ProfileNetworksTab user={user} />
          </View>
        );
      case 1:
        return (
          <View
            style={{
              backgroundColor: '#e1e1e1',
              flex: 1,
              marginHorizontal: 10,
              borderRadius: 10,
              marginBottom: '20%',
            }}>
            <ProfileInformationTab user={user} />
          </View>
        );
      default:
        return (
          <View style={themeStyles.tabContent}>
            <Text>Default content</Text>
          </View>
        );
    }
  };

  useEffect(() => {
    setActiveTabIndex(0);
    getUser();
  }, [refresh]);

  if (loading) {
    return (
      <View style={[themeStyles.container, {justifyContent: 'center'}]}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={themeStyles.container}>
      <View style={themeStyles.headerContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <View style={{flex: 2, alignItems: 'flex-end'}}>
            <Image
              style={themeStyles.profileImage}
              source={{
                uri: user?.profileImage
                  ? user.profileImage
                  : `https://ui-avatars.com/api/?name=${user?.displayName}&background=0D8ABC&color=fff&size=100`,
              }}
            />
          </View>
          <View style={{flex: 1}}>
            <TouchableOpacity
              onPress={() => {
                setBottomSheetRender('edit');
                handlePresentModalPress();
              }}>
              <MaterialIcons name={'edit'} color={'#FFF'} size={25} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={themeStyles.name}>{user?.displayName}</Text>
        <View style={themeStyles.statContainer}>
          {/*<View style={themeStyles.statItem}>*/}
          {/*  <Text style={themeStyles.statItemNumber}>{user?.networks.length}</Text>*/}
          {/*  <Text style={themeStyles.statItemLabel}>antal netværk</Text>*/}
          {/*</View>*/}
          {/*<View style={themeStyles.statItem}>*/}
          {/*  <Text style={themeStyles.statItemNumber}>56</Text>*/}
          {/*  <Text style={themeStyles.statItemLabel}>antal aktiviter</Text>*/}
          {/*</View>*/}
        </View>
        <View style={themeStyles.test}>
          <View style={{flex: 0.1}}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={themeStyles.tabButtonContainer}>
              {['Mine netværk', 'Mine Informationer'].map((tab, index) => (
                <TouchableOpacity
                  key={index}
                  style={themeStyles.tabButton}
                  onPress={() => handleTabChange(index)}
                  ref={ref => (tabRefs.current[index] = ref)}>
                  <Text
                    style={[
                      themeStyles.tabButtonText,
                      activeTabIndex === index && themeStyles.activeTabButtonText,
                    ]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Animated.View
              style={[
                themeStyles.underline,
                {
                  transform: [
                    {translateX: underlinePosition},
                    {scaleX: underlineScale},
                  ],
                  position: 'absolute',
                  bottom: 0,
                  height: 3,
                  backgroundColor: '#B3E5FC',
                  left: 20,
                },
              ]}
            />
          </View>
          <Carousel
            style={{height: SCREEN_HEIGHT / 1.95, flex: 1}}
            ref={carouselRef}
            width={SCREEN_WIDTH}
            height={SCREEN_HEIGHT / 1.95}
            data={[0, 1]}
            renderItem={({index}) => renderTabContent(index)}
            scrollAnimationDuration={800}
            loop={false}
            pagingEnabled={true}
            onScrollEnd={index => setActiveTabIndex(index)}
          />
        </View>
        <Overlay closeModal={handleCloseSheet} />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          keyboardBlurBehavior="restore"
          snapPoints={snapPoints}
          handleIndicatorStyle={themeStyles.bottomSheetStack}
          backgroundStyle={themeStyles.bottomSheetModalContainer}
          onChange={handleSheetChanges}>
          {bottomSheetModalHeader()}
        </BottomSheetModal>
      </View>
    </SafeAreaView>
  );
};

const styles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.backgrounds.main,
      alignItems: 'center',
      flex: 1,
    },
    headerContainer: {
      paddingTop: 10,
      alignItems: 'center',
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 75,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#FFFFFF',
    },
    name: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#FFFFFF',
    },
    tabContent: {
      marginTop: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabButtonContainer: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      gap: 30,
    },
    tabButton: {
      flex: 1,
      alignItems: 'center',
      minWidth: 100,
    },
    tabButtonText: {
      fontSize: 16,
      color: '#FFFFFF',
    },
    activeTabButtonText: {
      color: '#B3E5FC',
      fontWeight: 'bold',
    },
    statContainer: {
      flexDirection: 'row',
      gap: 20,
      paddingVertical: 10,
      marginBottom: 10,
    },
    statItem: {
      backgroundColor: '#e1e1e1',
      padding: 25,
      borderRadius: 20,
      alignItems: 'center',
    },
    statItemLabel: {
      fontSize: 10,
      fontStyle: 'italic',
      color: '#959595',
    },
    statItemNumber: {
      fontSize: 18,
    },
    underline: {
      position: 'absolute',
      bottom: 0,
      height: 3,
      backgroundColor: '#B3E5FC',
      marginBottom: 10,
    },
    contentContainer: {
      height: 40,
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#1ba16e',
      paddingHorizontal: 15,
      flexDirection: 'row',
    },
    bottomSheetHeaderText: {
      fontWeight: 'bold',
      fontSize: 16,
      color: '#FFF',
    },
    bottomSheetStack: {
      backgroundColor: '#959595',
    },
    bottomSheetModalContainer: {
      backgroundColor: '#FFF',
    },
    test: {
      alignItems: 'center',
      flex: 1,
    },
  });

export default ProfileScreen;
