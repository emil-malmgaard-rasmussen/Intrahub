import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import useThemeContext from '../theme/useThemeContext';
import {ThemeColors} from '../theme/colors.ts';

interface ScreenHeaderProps {
  title: any;
  leftIcon?: any;
  rightIcon?: any;
}

const ScreenHeader = (props: ScreenHeaderProps) => {
  const {title, leftIcon, rightIcon} = props;
  const {colors} = useThemeContext();
  const themeStyles = styles(colors);
  return (
    <View style={[themeStyles.headerContainer]}>
      <View style={themeStyles.headerFillContainer}>
        {leftIcon && leftIcon}
      </View>
      <View style={themeStyles.headerTitleContainer}>
        <Text style={themeStyles.headerTitle} numberOfLines={2}>
          {title}
        </Text>
      </View>
      <View style={themeStyles.headerFillContainer}>
        {rightIcon && rightIcon}
      </View>
    </View>
  );
};

const styles = (colors: ThemeColors) =>
  StyleSheet.create({
    headerContainer: {
      flex: 1,
      paddingBottom: 27,
      flexDirection: 'row',
      backgroundColor: colors.header.main,
    },
    headerTitleContainer: {
      flex: 0.5,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    headerFillContainer: {
      flex: 0.25,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    icon: {
      color: '#fff',
      paddingRight: 20,
    },
    headerTitle: {
      color: colors.text.light,
      fontSize: 19,
    },
  });
export default ScreenHeader;
