import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ScreenHeader from '../../components/ScreenHeader.tsx';
import useThemeContext from '../../theme/useThemeContext.ts';
import {ThemeColors} from '../../theme/colors.ts';

const NetworkPostDetailScreen = ({route, navigation}) => {
  const {post} = route.params;
  const {colors} = useThemeContext();
  const themeStyles = styles(colors);

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
      <View style={themeStyles.postContainer}>
        <Text style={themeStyles.title}>{post.title}</Text>
        <Text style={themeStyles.bio}>{post.bio}</Text>
        {post.imageUrl && (
          <Image source={{uri: post.imageUrl}} style={themeStyles.image} />
        )}
        <Text style={themeStyles.description}>{post.text}</Text>
        <View style={themeStyles.detailsContainer}>
          <Text style={themeStyles.date}>
            Oprettet d.: {post.createdAt.toDate().toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    postContainer: {
      flex: 8,
      padding: 20,
      backgroundColor: '#fff',
    },
    backButton: {
      marginBottom: 20,
      padding: 10,
      backgroundColor: '#1ba16e',
      borderRadius: 5,
    },
    backButtonText: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: 8,
      marginBottom: 10,
    },
    description: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 10,
    },
    bio: {
      fontSize: 16,
      marginBottom: 10,
    },
    detailsContainer: {
      marginTop: 10,
    },
    date: {
      fontSize: 14,
      color: '#555',
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

export default NetworkPostDetailScreen;
