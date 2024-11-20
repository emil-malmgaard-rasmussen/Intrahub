import React from 'react';
import {Image, StyleSheet} from 'react-native';

const ImageViewer = ({imageUri}) => {
  return (
    <Image source={{uri: imageUri}} style={styles.image} resizeMode="contain" />
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ImageViewer;
