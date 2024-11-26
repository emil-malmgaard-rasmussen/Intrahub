import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useRecoilState} from 'recoil';
import {overlayActiveAtom} from '../utils/Atoms.ts';

interface OverlayProps {
  closeModal: () => void;
}

export const Overlay = (props: OverlayProps) => {
  const {closeModal} = props;
  const [overlayActive, setOverlayActive] = useRecoilState(overlayActiveAtom);

  // Animated value for controlling the opacity
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const windowHeight = Dimensions.get('window').height;

  // Trigger fade-in and fade-out animations when overlayActive changes
  useEffect(() => {
    if (overlayActive) {
      // Fade in when overlayActive is true
      Animated.timing(fadeAnim, {
        toValue: 0.5, // Fully visible at 50% opacity
        duration: 300, // Animation duration (in ms)
        useNativeDriver: true, // Optimize performance
      }).start();
    } else {
      // Fade out when overlayActive is false
      Animated.timing(fadeAnim, {
        toValue: 0, // Fully invisible
        duration: 300, // Animation duration (in ms)
        useNativeDriver: true,
      }).start();
    }
  }, [overlayActive, fadeAnim]);

  return (
    <View
      style={[
        s.overlayContainer,
        {height: overlayActive ? windowHeight : 0}, // Conditionally set height based on activity
      ]}>
      <Animated.View style={[s.overlay, {opacity: fadeAnim}]}>
        <TouchableOpacity
          activeOpacity={0}
          onPress={() => {
            closeModal();
            setOverlayActive(false);
          }}
          style={{flex: 1}}
        />
      </Animated.View>
    </View>
  );
};

const s = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    zIndex: 11,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'black',
    width: '100%',
  },
});
