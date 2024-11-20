import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import useThemeContext from '../../theme/useThemeContext.ts';

interface CustomButtonProps {
  title: string | Element;
  onPress: () => void;
  textColor?: string;
  disabled?: boolean;
  backgroundColor?: string;
}

const CustomButton = (props: CustomButtonProps) => {
  const {title, onPress, backgroundColor, textColor, disabled} = props;
  const {colors} = useThemeContext();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        {backgroundColor: backgroundColor || colors.button.main},
      ]}>
      <Text
        style={[styles.buttonText, {color: textColor || colors.text.inverse}]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 16,
  },
});

export default CustomButton;
