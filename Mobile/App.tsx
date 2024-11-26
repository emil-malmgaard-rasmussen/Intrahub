import {RecoilRoot} from 'recoil';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import 'react-native-gesture-handler';
import {Alert, StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {AuthProvider} from './src/auth/AuthProvider';
import Router from './src/navigation/Router.tsx';
import {RefreshProvider} from './src/navigation/RefreshContext.tsx';
import './src/utils/CalendarConfig.ts';
import 'moment/locale/da';
import moment from 'moment';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

const App = () => {
  //For some reason, Reanimated needs this for some warnings - looks like bug in plugin
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
  });
  moment.locale('da');
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    }
  };

  useEffect(() => {
    requestUserPermission();
  }, []);

  return (
    <RecoilRoot>
      <GestureHandlerRootView style={{flex: 1}}>
        <StatusBar barStyle={'dark-content'} translucent={true} />
        <RefreshProvider>
          <BottomSheetModalProvider>
            <AuthProvider>
              <Router />
            </AuthProvider>
          </BottomSheetModalProvider>
        </RefreshProvider>
      </GestureHandlerRootView>
    </RecoilRoot>
  );
};

export default App;
