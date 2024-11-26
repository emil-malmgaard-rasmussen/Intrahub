import { StyleSheet, Text, View } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import React from 'react';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import useThemeContext from '../../../theme/useThemeContext';
import { ThemeColors } from '../../../theme/colors.ts';

interface YesOrNoComponentProps {
  questionIndex: number;
}

export const YesOrNoComponent = ({ questionIndex }: YesOrNoComponentProps) => {
  const { colors } = useThemeContext();
  const themeStyles = styles(colors);

  const { control } = useFormContext();

  return (
    <View style={themeStyles.yesOrNoTextContainer}>
      <View
        style={{
          alignItems: 'center',
          flex: 1,
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <Text style={themeStyles.yesOrNoText}>Ja</Text>
        <Controller
          control={control}
          name={`answers.${questionIndex}.answer`}
          rules={{
            validate: (value) => value !== undefined || 'Udfyld venligst',
          }}
          render={({ field: { onChange, value } }) => (
            <BouncyCheckbox
              size={35}
              fillColor={colors.backgrounds.main}
              iconStyle={{ borderRadius: 5 }}
              innerIconStyle={{
                borderColor: colors.border,
                borderRadius: 5,
              }}
              isChecked={value === true}
              onPress={() => onChange(true)} // Set value to `true` for "Ja"
              disableText
            />
          )}
        />
      </View>
      <View
        style={{
          alignItems: 'center',
          flex: 1,
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <Text style={themeStyles.yesOrNoText}>Nej</Text>
        <Controller
          control={control}
          name={`answers.${questionIndex}.answer`}
          rules={{
            validate: (value) => value !== undefined || 'Udfyld venligst',
          }}
          render={({ field: { onChange, value } }) => (
            <BouncyCheckbox
              size={35}
              fillColor={colors.backgrounds.main}
              iconStyle={{ borderRadius: 5 }}
              innerIconStyle={{
                borderColor: colors.border,
                borderRadius: 5,
              }}
              isChecked={value === false}
              onPress={() => onChange(false)}
              disableText
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = (colors: ThemeColors) =>
  StyleSheet.create({
    yesOrNoText: {
      color: colors.text.default,
      fontSize: 18,
    },
    yesOrNoTextContainer: {
      flex: 1,
      flexDirection: 'row',
    },
  });
