import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {SCREEN_HEIGHT} from '../../../../utils/Dimensions';
import {ThemeColors} from '../../../../theme/colors.ts';
import useThemeContext from '../../../../theme/useThemeContext.ts';

const ApvList = ({networks, navigation}) => {
  const {colors} = useThemeContext();
  const styles = createStyles(colors);

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
        styles.userContainer,
        index !== networks.length - 1 && styles.userItemBorder,
      ]}
      onPress={() => navigation(item)}>
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {item.name}
        </Text>
      </View>
      <View style={styles.chevronContainer}>
        <FontAwesome5 name={'chevron-right'} style={styles.chevron} size={20} />
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
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
    />
  );
};

const createStyles = (colors: ThemeColors) =>
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
    titleContainer: {
      flex: 2.5 / 3,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text.default,
    },
    userTitle: {
      fontSize: 14,
      fontWeight: 'normal',
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

export default ApvList;
