import React, {useEffect, useRef, useState} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useRoute} from '@react-navigation/native';

interface AssigmentFloatingButtonProps {
  navigation: any;
  test: any;
}

const FloatingNetworksActionButton = (props: AssigmentFloatingButtonProps) => {
  const {navigation, test} = props;
  const route = useRoute();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [openActionButton, setOpenActionButton] = useState<boolean>(false);
  const unsubscribe = navigation.addListener('focus', () => {
    if (openActionButton) {
      Animated.timing(fadeAnim, {
        useNativeDriver: false,
        toValue: 0,
        duration: 0,
      }).start();
      setOpenActionButton(false);
    }
  });
  const createToolAction = () => {
    navigation.navigate('CreateTool');
  };

  const toolPositionInterpolate = fadeAnim.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [-30, -60, -90],
  });

  const opacityInterpolate = fadeAnim.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [0, 0, 1],
  });

  const toolTextStyle = {
    opacity: opacityInterpolate,
    transform: [
      {
        translateX: toolPositionInterpolate,
      },
    ],
  };

  const firstButtonInterpolate = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -70],
  });

  const secondButtonInterpolate = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -140],
  });

  const thirdButtonInterpolate = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -210],
  });

  const firstButtonStyle = {
    transform: [
      {
        translateY: firstButtonInterpolate,
      },
    ],
  };

  const secondButtonStyle = {
    transform: [
      {
        translateY: secondButtonInterpolate,
      },
    ],
  };

  const thirdButtonStyle = {
    transform: [
      {
        translateY: thirdButtonInterpolate,
      },
    ],
  };

  useEffect(() => {
    return () => unsubscribe;
  }, [navigation]);

  const toggleOpen = () => {
    if (openActionButton) {
      Animated.timing(fadeAnim, {
        useNativeDriver: false,
        toValue: 0,
        duration: 300,
      }).start();
      setOpenActionButton(false);
    } else {
      Animated.timing(fadeAnim, {
        useNativeDriver: false,
        toValue: 1,
        duration: 300,
      }).start();
      setOpenActionButton(true);
    }
  };

  const scaleInterpolate = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });

  const bgStyle = {
    transform: [
      {
        scale: scaleInterpolate,
      },
    ],
  };

  const mainButtonInterpolate = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const mainButtonStyle = {
    transform: [
      {
        rotate: mainButtonInterpolate,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.background, bgStyle]} />
      <TouchableWithoutFeedback
        onPress={async () => {
          await toggleOpen();
          test('post');
        }}>
        <Animated.View style={[styles.button, styles.other, firstButtonStyle]}>
          <Animated.Text style={[styles.label, toolTextStyle]}>
            Opret opslag
          </Animated.Text>
          <MaterialIcon name="add" size={20} color="#555" />
        </Animated.View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={async () => {
          await toggleOpen();
          test('activity');
        }}>
        <Animated.View style={[styles.button, styles.other, secondButtonStyle]}>
          <Animated.Text style={[styles.label, toolTextStyle]}>
            Opret aktivitet
          </Animated.Text>
          <MaterialIcon name="add" size={20} color="#555" />
        </Animated.View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={async () => {
          await toggleOpen();
          test('documents');
        }}>
        <Animated.View style={[styles.button, styles.other, thirdButtonStyle]}>
          <Animated.Text style={[styles.label, toolTextStyle]}>
            Upload dokumenter
          </Animated.Text>
          <MaterialIcon name="file-upload" size={20} color="#555" />
        </Animated.View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={() => toggleOpen()}>
        <Animated.View
          style={[styles.button, styles.primaryBtn, mainButtonStyle]}>
          <MaterialIcon name="add" size={30} color="#fff" />
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    right: 0,
    bottom: 0,
    zIndex: 20,
  },
  background: {
    backgroundColor: 'rgba(0,0,0,.4)',
    position: 'absolute',
    width: 60,
    height: 60,
    bottom: 20,
    right: 20,
    borderRadius: 30,
  },
  button: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#333',
    shadowOpacity: 0.1,
    shadowOffset: {width: 2, height: 0},
    shadowRadius: 2,
    borderRadius: 30,
    position: 'absolute',
    bottom: 40,
    right: 5,
  },
  other: {
    backgroundColor: '#FFF',
  },
  primaryBtn: {
    backgroundColor: '#FF7043',
  },
  label: {
    color: '#FFF',
    position: 'absolute',
    fontSize: 18,
    backgroundColor: 'transparent',
    width: 150,
  },
});

export default FloatingNetworksActionButton;
