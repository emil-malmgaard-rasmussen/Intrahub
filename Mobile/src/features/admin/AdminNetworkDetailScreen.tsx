import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../utils/Dimensions';
import NetworkCalendarTab from '../networks/components/tabs/NetworkCalendarTab.tsx';
import NetworkPostsTab from '../networks/components/tabs/NetworkPostsTab.tsx';
import NetworkContactTab from '../networks/components/tabs/NetworkContactTab.tsx';
import AdminNetworkMembersTab from './tabs/AdminNetworkMembersTab.tsx';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {useSetRecoilState} from 'recoil';
import {overlayActiveAtom} from '../../utils/Atoms.ts';
import {Overlay} from '../../components/Overlay.tsx';
import {Controller, useForm} from 'react-hook-form';
import firestore from '@react-native-firebase/firestore';
import {useRefreshContext} from '../../navigation/RefreshContext.tsx';
import ScreenHeader from '../../components/ScreenHeader.tsx';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useThemeContext from '../../theme/useThemeContext.ts';
import {ThemeColors} from '../../theme/colors.ts';
import CustomButton from '../../components/buttons/CustomButton.tsx';

const AdminNetworkDetailScreen = ({route, navigation}) => {
  const {network} = route.params;
  const {control, handleSubmit} = useForm();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const tabRefs = useRef<Array<any>>([]);
  const bottomSheetModalRef = useRef<BottomSheetModal | null>(null);
  const snapPoints = useMemo(() => ['25%', '50%', '80%'], []);
  const setOverlayActive = useSetRecoilState(overlayActiveAtom);
  const [uploading, setUploading] = useState(false);
  const {triggerRefresh} = useRefreshContext();
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
  const carouselRef = useRef<any>(null);

  const underlinePosition = useRef(new Animated.Value(0)).current;
  const numTabs = 5;

  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);

    if (carouselRef.current) {
      carouselRef.current.scrollTo({index, animated: true});
    }

    Animated.timing(underlinePosition, {
      toValue: (index * (SCREEN_WIDTH - 60)) / numTabs,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const renderTabContent = (index: number) => {
    switch (index) {
      case 0:
        return (
          <AdminNetworkMembersTab
            network={network}
            handlePresentModalPress={handlePresentModalPress}
            handleRemoveMember={handleRemoveMember}
          />
        );
      case 1:
        return <NetworkCalendarTab networkId={network.id} />;
      case 2:
        return <NetworkPostsTab networkId={network.id} />;
      case 3:
        return <NetworkContactTab network={network} />;
      default:
        return (
          <View style={themeStyles.tabContent}>
            <Text>Default content</Text>
          </View>
        );
    }
  };

  const handleRemoveMember = (uid: string) => {
    network.users = network.users.filter(d => d !== uid);
  };

  const onSubmit = async data => {
    setUploading(true);

    try {
      const userQuery = await firestore()
        .collection('USERS')
        .where('email', '==', data.email.toLowerCase())
        .limit(1)
        .get();

      if (!userQuery.empty) {
        const userDoc = userQuery.docs[0];
        const userId = userDoc.id;

        const networkRef = firestore().collection('NETWORKS').doc(network.id);

        await networkRef.update({
          users: firestore.FieldValue.arrayUnion(userId),
        });

        network.users = [...network.users, userId];
        handleCloseSheet();
        Alert.alert('Udført', 'Brugeren tilføjet');
        triggerRefresh();
      } else {
        Alert.alert('Fejl', 'Kunne ikke finde brugeren');
      }
    } catch (error) {
      console.error('Error updating network:', error);
      Alert.alert(
        'Error',
        'An error occurred while adding the user to the network',
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={themeStyles.container}>
      <ScreenHeader
        title={network.name}
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
        <View style={themeStyles.header}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={themeStyles.tabButtonContainer}>
            {['Medlemmer', 'Kalender', 'Opslag', 'Kontakt'].map(
              (tab, index) => (
                <TouchableOpacity
                  key={index}
                  style={themeStyles.tabButton}
                  onPress={() => handleTabChange(index)}
                  ref={ref => (tabRefs.current[index] = ref)}>
                  <Text
                    style={[
                      themeStyles.tabButtonText,
                      activeTabIndex === index &&
                        themeStyles.activeTabButtonText,
                    ]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </ScrollView>
          {/*<Animated.View*/}
          {/*  style={[*/}
          {/*    themeStyles.underline,*/}
          {/*    {*/}
          {/*      transform: [{translateX: underlinePosition}], // Move underline with animation*/}
          {/*    },*/}
          {/*  ]}*/}
          {/*/>*/}
        </View>
        <Carousel
          ref={carouselRef}
          width={SCREEN_WIDTH}
          height={SCREEN_HEIGHT}
          data={[0, 1, 2, 3, 4]} // 5 tabs now
          renderItem={({index}) => renderTabContent(index)}
          scrollAnimationDuration={800}
          loop={false}
          pagingEnabled={true}
          enabled={false}
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
        <BottomSheetView>
          <View style={themeStyles.contentContainer}>
            <Text style={themeStyles.bottomSheetHeaderText}>Tilføj medlem</Text>
          </View>
          <View style={{padding: 20}}>
            <Controller
              name="email"
              control={control}
              rules={{required: true}}
              render={({field: {onChange, value}}) => (
                <TextInput
                  placeholder="Email"
                  value={value}
                  onChangeText={onChange}
                  style={themeStyles.input}
                />
              )}
            />
            {/*<TouchableOpacity*/}
            {/*  onPress={handleSubmit(onSubmit)}*/}
            {/*  style={themeStyles.button}*/}
            {/*  disabled={uploading}>*/}
            {/*  {uploading ? (*/}
            {/*    <ActivityIndicator size={'small'} color={'#FFF'} />*/}
            {/*  ) : (*/}
            {/*    <Text style={themeStyles.buttonText}>Tilføj</Text>*/}
            {/*  )}*/}
            {/*</TouchableOpacity>*/}
            <CustomButton
              title={
                uploading ? (
                  <ActivityIndicator size={'small'} color={'#FFF'} />
                ) : (
                  'Tilføj'
                )
              }
              onPress={handleSubmit(onSubmit)}
              disabled={uploading}
              backgroundColor={colors.button.secondary}
            />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

const styles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    header: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingBottom: 15,
      backgroundColor: colors.backgrounds.main,
    },
    tabContent: {
      marginTop: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: SCREEN_WIDTH, // Adjust width to screen width
      marginTop: 10,
    },
    tabButton: {
      flex: 1,
      alignItems: 'center',
      width: SCREEN_WIDTH / 5, // Adjust width for each tab
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
      width: SCREEN_WIDTH / 5,
      height: 3,
      backgroundColor: '#B3E5FC',
    },
    details: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      paddingBottom: 40,
    },

    bottomSheetStack: {
      backgroundColor: '#959595',
    },
    bottomSheetModalContainer: {
      backgroundColor: '#FFF',
    },
    contentContainer: {
      height: 40,
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.backgrounds.main,
      paddingHorizontal: 15,
      flexDirection: 'row',
    },
    bottomSheetHeaderText: {
      fontWeight: 'bold',
      fontSize: 16,
      color: '#FFF',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 8,
      marginBottom: 10,
      width: '100%',
      color: colors.text.default
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

export default AdminNetworkDetailScreen;
