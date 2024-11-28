import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import CloseSvg from '../../assets/misc/CloseSvg';
import useThemeContext from '../../theme/useThemeContext';
import {ThemeColors} from '../../theme/colors.ts';

interface InputFieldProps extends Omit<TextInputProps, 'onChangeText'> {
  label: string;
  icon?: React.ReactNode;
  inputType?: 'row' | 'zipcode' | 'password' | 'default';
  onChangeText: (text: string) => void;
  value: string;
  onBlur?: () => void;
  fieldButtonLabel?: string;
  fieldButtonFunction?: () => void;
  error?: boolean;
  errorText?: string | undefined;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  inputType = 'default',
  onChangeText,
  value,
  onBlur,
  keyboardType = 'default',
  fieldButtonLabel,
  fieldButtonFunction,
  error,
  errorText,
  ...rest
}) => {
  const {colors} = useThemeContext();
  const styles = createStyles(colors);

  const handleClear = () => {
    onChangeText('');
  };

  const renderTextInput = () => {
    const inputStyles = [styles.input, error && {color: 'red'}];

    const placeholderTextColor = error ? 'red' : '#C6C6C6';

    switch (inputType) {
      case 'row':
        return (
          <TextInput
            onChangeText={onChangeText}
            value={value}
            onBlur={onBlur}
            placeholder={label}
            keyboardType={keyboardType}
            style={[...inputStyles, {width: 150}]}
            placeholderTextColor={placeholderTextColor}
            {...rest}
          />
        );
      case 'zipcode':
        return (
          <TextInput
            onChangeText={onChangeText}
            value={value}
            onBlur={onBlur}
            placeholder={label}
            keyboardType={keyboardType}
            style={[...inputStyles, {width: 70}]}
            placeholderTextColor={placeholderTextColor}
            {...rest}
          />
        );
      case 'password':
        return (
          <TextInput
            onChangeText={onChangeText}
            value={value}
            onBlur={onBlur}
            placeholder={label}
            keyboardType={keyboardType}
            style={[...inputStyles, {flex: 1, paddingVertical: 0}]}
            placeholderTextColor={placeholderTextColor}
            secureTextEntry
            {...rest}
          />
        );
      default:
        return (
          <TextInput
            onChangeText={onChangeText}
            value={value}
            onBlur={onBlur}
            placeholder={label}
            keyboardType={keyboardType}
            style={[...inputStyles, {flex: 1, paddingVertical: 0}]}
            placeholderTextColor={placeholderTextColor}
            {...rest}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, error && {borderBottomColor: 'red'}]}>
        {icon}
        {renderTextInput()}
        {value ? (
          <TouchableOpacity onPress={handleClear}>
            <CloseSvg color={error ? 'red' : '#C6C6C6'} />
          </TouchableOpacity>
        ) : null}
        {fieldButtonLabel && (
          <TouchableOpacity onPress={fieldButtonFunction}>
            <Text
              style={[styles.fieldButtonLabel, {color: colors.button.main}]}>
              {fieldButtonLabel}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{errorText}</Text>}
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      marginBottom: 25,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
      paddingBottom: 8,
    },
    input: {
      fontSize: 16,
      color: colors.text.default,
      paddingVertical: 0,
    },
    fieldButtonLabel: {
      fontWeight: '700',
      paddingLeft: 10,
    },
    errorText: {
      color: 'red',
      fontSize: 12,
      marginBottom: 4,
    },
  });

export default InputField;
