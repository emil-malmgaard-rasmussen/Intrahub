import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {SCREEN_HEIGHT} from '../../utils/Dimensions.ts';
import {ThemeColors} from '../../theme/colors.ts';
import useThemeContext from '../../theme/useThemeContext.ts';

const NetworksList = ({networks, navigation}) => {
  const {colors} = useThemeContext();
  const themeStyles = styles(colors);

  if (networks.length <= 0) {
    return (
      <View style={{alignItems: 'center'}}>
        <Text style={{color: '#959595', fontStyle: 'italic'}}>
          Ingen netværk
        </Text>
      </View>
    );
  }

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      style={[
        themeStyles.userContainer,
        index !== networks.length - 1 && themeStyles.userItemBorder,
      ]}
      onPress={() => navigation(item)}>
      <View style={themeStyles.imageContainer}>
        <Image
          source={{
            uri: item.logo
              ? item.logo
              : `https://ui-avatars.com/api/?name=${item.name}&background=0D8ABC&color=fff&size=100`,
          }}
          style={themeStyles.profilePicture}
        />
      </View>
      <View style={themeStyles.networkInfoContainer}>
        <Text style={themeStyles.networkTitleText}>{item.name}</Text>
        <Text style={themeStyles.networkBioText} numberOfLines={1}>
          {item.description}
        </Text>
      </View>
      <View style={themeStyles.chevronContainer}>
        <FontAwesome5
          name={'chevron-right'}
          style={themeStyles.chevron}
          size={20}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      style={{
        height: SCREEN_HEIGHT / 1.45,
      }}
      data={networks}
      renderItem={renderItem}
      keyExtractor={item => item.name}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = (colors: ThemeColors) =>
  StyleSheet.create({
    userContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
      marginHorizontal: 10,
    },
    userItemBorder: {
      borderBottomWidth: 0.5,
      borderBottomColor: '#CCCCCC',
      paddingBottom: 10,
    },
    profilePicture: {
      width: 40,
      height: 40,
      borderRadius: 30,
    },
    networkInfoContainer: {
      flex: 2 / 3,
      marginLeft: 15,
    },
    networkTitleText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text.default,
    },
    networkBioText: {
      fontSize: 14,
      fontWeight: 'normal',
      color: colors.text.default,
    },
    userLocation: {
      fontSize: 14,
      fontWeight: 'normal',
    },
    chevronContainer: {
      flex: 0.5 / 3,
    },
    chevron: {
      alignSelf: 'flex-end',
      color: '#CCCCCC',
    },
    imageContainer: {
      flex: 0.5 / 3,
    },
  });

export default NetworksList;
