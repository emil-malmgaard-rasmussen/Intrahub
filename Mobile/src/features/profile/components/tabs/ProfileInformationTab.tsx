import {StyleSheet, Text, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {ThemeColors} from '../../../../theme/colors.ts';
import useThemeContext from '../../../../theme/useThemeContext.ts';

const ProfileInformationTab = ({user}) => {
  const {colors} = useThemeContext();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={{padding: 10, gap: 10}}>
        <View style={styles.informationContainer}>
          <MaterialIcons name={'person-outline'} color={colors.icon.default} size={20} />
          <Text numberOfLines={2} style={styles.text}>{user?.displayName}</Text>
        </View>
        <View style={styles.informationContainer}>
          <MaterialIcons name={'alternate-email'} color={colors.icon.default} size={20} />
          <Text numberOfLines={2} style={styles.text}>{user?.email}</Text>
        </View>
        <View style={styles.informationContainer}>
          <MaterialIcons name={'phone-iphone'} color={colors.icon.default} size={20} />
          <Text numberOfLines={2} style={styles.text}>{user?.phoneNumber}</Text>
        </View>
        <View style={styles.informationContainer}>
          <FontAwesome name={'building-o'} color={colors.icon.default} size={20} />
          <Text numberOfLines={2} style={styles.text}>{user?.companyName}</Text>
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      paddingBottom: 40,
    },
    informationContainer: {
      borderRadius: 5,
      alignItems: 'center',
      padding: 10,
      paddingVertical: 10,
      flexDirection: 'row',
      gap: 10,
    },
    text: {
      color: colors.text.default,
    },
  });

export default ProfileInformationTab;
