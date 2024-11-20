import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../utils/Dimensions';
import FloatingNetworksActionButton from './components/FloatingNetworksActionButton.tsx';
import auth from '@react-native-firebase/auth';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import CreateNetworkPosts from './components/form/CreateNetworkPosts.tsx';
import NetworkPostsTab from './components/tabs/NetworkPostsTab.tsx';
import NetworkContactTab from './components/tabs/NetworkContactTab.tsx';
import NetworkMembersTab from './components/tabs/NetworkMembersTab.tsx';
import NetworkCalendarTab from './components/tabs/NetworkCalendarTab.tsx';
import CreateNetworkActivities from './components/form/CreateNetworkActivities.tsx';
import {useSetRecoilState} from 'recoil';
import {overlayActiveAtom} from '../../utils/Atoms.ts';
import {Overlay} from '../../components/Overlay.tsx';
import NetworkDocumentsTab from './components/tabs/NetworkDocumentsTab.tsx';
import CreateNetworkDocuments from './components/form/CreateNetworkDocuments.tsx';
import ScreenHeader from '../../components/ScreenHeader.tsx';
import {ThemeColors} from '../../theme/colors.ts';
import useThemeContext from '../../theme/useThemeContext.ts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const NetworkDetailScreen = ({route, navigation}) => {
  const {network} = route.params;
  const user = auth().currentUser;
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const bottomSheetModalRef = useRef<BottomSheetModal | null>(null);
  const snapPoints = useMemo(() => ['25%', '50%', '80%'], []);
  const carouselRef = useRef<any>(null);
  const [bottomSheetRender, setBottomSheetRender] = useState<
    'post' | 'activity' | 'documents' | undefined
  >(undefined);
  const underlinePosition = useRef(new Animated.Value(0)).current;
  const underlineScale = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const tabRefs = useRef<Array<any>>([]);
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

  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);

    if (carouselRef.current) {
      carouselRef.current.scrollTo({index, animated: true});
    }

    Animated.timing(underlinePosition, {
      toValue: (index * (SCREEN_WIDTH - 60)) / 3,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const renderTabContent = (index: number) => {
    switch (index) {
      case 0:
        return <NetworkMembersTab network={network} />;
      case 1:
        return <NetworkDocumentsTab networkId={network.id} />;
      case 2:
        return <NetworkCalendarTab networkId={network.id} />;
      case 3:
        return <NetworkPostsTab networkId={network.id} />;
      case 4:
        return <NetworkContactTab network={network} />;
      default:
        return (
          <View style={themeStyles.tabContent}>
            <Text>Default content</Text>
          </View>
        );
    }
  };

  const bottomSheetModalHeader = () => {
    switch (bottomSheetRender) {
      case 'post':
        return (
          <>
            <View style={themeStyles.contentContainer}>
              <Text style={themeStyles.bottomSheetHeaderText}>Opret opslag</Text>
            </View>
            <BottomSheetScrollView style={{padding: 10}}>
              <CreateNetworkPosts networkId={network.id} close={handleCloseSheet} />
            </BottomSheetScrollView>
          </>
        );
      case 'activity':
        return (
          <>
            <View style={themeStyles.contentContainer}>
              <Text style={themeStyles.bottomSheetHeaderText}>Opret aktivitet</Text>
            </View>
            <BottomSheetScrollView style={{padding: 10}}>
              <CreateNetworkActivities networkId={network.id} close={handleCloseSheet} />
            </BottomSheetScrollView>
          </>
        );
      case 'documents':
        return (
          <>
            <View style={themeStyles.contentContainer}>
              <Text style={themeStyles.bottomSheetHeaderText}>Upload dokument</Text>
            </View>
            <BottomSheetScrollView style={{padding: 10}}>
              <CreateNetworkDocuments networkId={network.id} close={handleCloseSheet} />
            </BottomSheetScrollView>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={themeStyles.container}>
      <ScreenHeader
        title={''}
        leftIcon={
          <TouchableOpacity
            style={themeStyles.leftIconContainer}
            onPress={() => navigation.goBack()}>
            <MaterialIcons
              style={themeStyles.headerIcon}
              size={30}
              name={'chevron-left'}
            />
            <Text style={themeStyles.leftIconText}>Tilbage</Text>
          </TouchableOpacity>
        }
      />
      <View style={{flex: 8}}>
        <View style={themeStyles.headerContainer}>
          <Image
            style={themeStyles.profileImage}
            source={{
              uri: network.logo
                ? network.logo
                : `https://ui-avatars.com/api/?name=${network.name}&background=0D8ABC&color=fff&size=100`,
            }}
          />
          <Text style={themeStyles.name}>{network.name}</Text>
          <View style={themeStyles.secondContainer}>
            <Text style={themeStyles.second}>{network.description}</Text>
          </View>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={themeStyles.tabButtonContainer}>
            {['Medlemmer', 'Dokumenter', 'Kalender', 'Opslag', 'Kontakt'].map((tab, index) => (
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
          {/*<Animated.View*/}
          {/*  style={[*/}
          {/*    themeStyles.underline,*/}
          {/*    {*/}
          {/*      transform: [*/}
          {/*        {translateX: underlinePosition},*/}
          {/*        {scaleX: underlineScale},*/}
          {/*      ],*/}
          {/*      position: 'absolute',*/}
          {/*      bottom: 0,*/}
          {/*      height: 3,*/}
          {/*      backgroundColor: '#B3E5FC',*/}
          {/*      left: 0,*/}
          {/*    },*/}
          {/*  ]}*/}
          {/*/>*/}
        </View>
        <Carousel
          style={{height: SCREEN_HEIGHT / 1.95}}
          ref={carouselRef}
          width={SCREEN_WIDTH}
          height={SCREEN_HEIGHT / 1.95}
          data={[0, 1, 2, 3, 4]}
          renderItem={({index}) => renderTabContent(index)}
          scrollAnimationDuration={800}
          loop={false}
          pagingEnabled={true}
          onScrollEnd={index => setActiveTabIndex(index)}
        />
        {network.administrators.includes(user?.uid) && (
          <FloatingNetworksActionButton
            navigation={navigation}
            test={(resurce: 'post' | 'activity') => {
              setBottomSheetRender(resurce);
              handlePresentModalPress();
            }}
          />
        )}
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
  );
};

const styles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingBottom: 15,
    backgroundColor: colors.header.main,
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
  secondContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 5,
  },
  second: {
    fontSize: 18,
    marginBottom: 5,
    color: '#FFFFFF',
  },
  tabContent: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap', // Prevent wrapping to maintain a single line
    alignItems: 'center', // Center items vertically
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  tabButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  activeTabButtonText: {
    color: '#B3E5FC',
    fontWeight: 'bold',
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    left: 30,
    width: (SCREEN_WIDTH - 100) / 4,
    height: 3,
    backgroundColor: '#B3E5FC',
  },
  bottomSheetModalContainer: {
    backgroundColor: '#FFF',
  },
  bottomSheetStack: {
    backgroundColor: '#959595',
  },
  bottomSheetHeaderText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFF',
  },
  bottomSheetHeaderActionButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFF',
  },
  contentContainer: {
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.header.main,
    paddingHorizontal: 15,
    flexDirection: 'row',
  },
  headerIcon: {
    color: '#fff',
  },
  leftIconContainer: {
    marginBottom: -2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIconText: {
    color: colors.text.light,
    fontSize: 16,
  },
});

export default NetworkDetailScreen;
