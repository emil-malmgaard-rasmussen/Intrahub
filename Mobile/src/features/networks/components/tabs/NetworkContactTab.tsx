import {StyleSheet, Text, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ThemeColors} from '../../../../theme/colors.ts';
import useThemeContext from '../../../../theme/useThemeContext.ts';

const NetworkContactTab = ({network}) => {
  const {colors} = useThemeContext();
  const themeStyles = styles(colors);

  return (
    <View style={themeStyles.container}>
      <View style={{padding: 10, gap: 10}}>
        <View style={themeStyles.informationContainer}>
          <MaterialIcons name={'alternate-email'} size={20} color={'#FFFFFF'} />
          <Text numberOfLines={2} style={{color: '#FFFFFF'}}>
            {network?.contactEmail}
          </Text>
        </View>
        <View style={themeStyles.informationContainer}>
          <MaterialIcons name={'phone'} size={20} color={'#FFFFFF'} />
          <Text numberOfLines={2} style={{color: '#FFFFFF'}}>
            {network?.contactPhone}
          </Text>
        </View>
        <View style={themeStyles.informationContainer}>
          <MaterialIcons name={'location-on'} size={20} color={'#FFFFFF'} />
          <Text numberOfLines={2} style={{color: '#FFFFFF'}}>
            {network?.address}, {network.postalCode} {network.city}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      paddingBottom: 40,
    },
    informationContainer: {
      backgroundColor: colors.backgrounds.main,
      borderRadius: 5,
      alignItems: 'center',
      padding: 10,
      paddingVertical: 10,
      flexDirection: 'row',
      gap: 10,
    },
  });

export default NetworkContactTab;
