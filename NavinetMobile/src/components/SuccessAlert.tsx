import {
  Animated,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ThemeColors} from '../theme/colors.ts';
import useThemeContext from '../theme/useThemeContext.ts';
import {useEffect, useRef, useState} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const SuccessAlert = ({visible, navigateBack, text}) => {
  const [showModal, setShowModal] = useState(visible);
  const scaleValue = useRef(new Animated.Value(0)).current;
  const {colors} = useThemeContext();
  const themeStyles = styles(colors);

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setShowModal(false), 200);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <View style={themeStyles.container}>
      <Modal transparent visible={showModal}>
        <View style={themeStyles.modalBackGround}>
          <Animated.View
            style={[
              themeStyles.modalContainer,
              {transform: [{scale: scaleValue}]},
            ]}>
            <View style={{alignItems: 'center'}}>
              <View style={themeStyles.header}>
                <TouchableOpacity
                  onPress={async () => {
                    await navigateBack();
                    setShowModal(false);
                  }}>
                  <MaterialIcon
                    style={themeStyles.closeIcon}
                    name={'close'}
                    size={30}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('../assets/images/success.png')}
                style={{
                  height: 150,
                  width: 150,
                  marginVertical: 10,
                }}
              />
            </View>
            <Text style={themeStyles.successText}>{text}</Text>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalBackGround: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '80%',
      backgroundColor: colors.backgrounds.light,
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderRadius: 20,
      elevation: 20,
    },
    header: {
      width: '100%',
      height: 30,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    closeIcon: {
      color: colors.text.default,
    },
    successText: {
      marginVertical: 30,
      fontSize: 20,
      textAlign: 'center',
      color: colors.text.default,
    },
  });

export default SuccessAlert;
