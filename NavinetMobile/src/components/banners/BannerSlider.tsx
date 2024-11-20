import React from 'react';
import {Image, Text, View, StyleSheet} from 'react-native';

interface IBannerSlider {
  data: any;
}

const BannerSlider = (props: IBannerSlider) => {
  const {data} = props;

  return (
    <View style={styles.container}>
      <Image
        source={data.imageUrl ? {uri: data.imageUrl} : require('../../assets/images/no-image-post.jpg')}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.bio} numberOfLines={2}>{data.bio}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#CECECE',
    marginHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  image: {
    height: 150,
    width: '100%',
    resizeMode: 'cover',
  },
  textContainer: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    paddingBottom: 5,
    fontWeight: 'bold',
    color: '#676767',
  },
  bio: {
    fontStyle: 'italic',
    color: '#676767',
  },
});

export default BannerSlider;
