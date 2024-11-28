import {
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useContext, useEffect, useRef} from 'react';
import InputField from '../../components/inputs/InputField';
import {Controller, useForm} from 'react-hook-form';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {AuthContext} from '../../auth/AuthProvider.tsx';
import CustomButton from '../../components/buttons/CustomButton.tsx';
import useThemeContext from '../../theme/useThemeContext.ts';

const RegisterScreen = () => {
  const {
    control,
    formState: {errors},
    handleSubmit,
    watch,
  } = useForm();
  const {register} = useContext<any>(AuthContext);
  const imageHeight = useRef(new Animated.Value(270)).current;
  const {colors} = useThemeContext();

  const passwordValue = watch('password');

  const onSubmit = (data: any) => {
    register(data);
  };

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        Animated.timing(imageHeight, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      },
    );

    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        Animated.timing(imageHeight, {
          toValue: 270,
          duration: 300,
          useNativeDriver: false,
        }).start();
      },
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [imageHeight]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 45 : 0,
      }}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled">
          <Animated.View style={{height: imageHeight, overflow: 'hidden'}}>
            <Image
              source={require('../../assets/images/onboarding1.png')}
              style={styles.image}
            />
          </Animated.View>
          <View style={{marginTop: 50, paddingHorizontal: 15}}>
            {/* Name Field */}
            <Controller
              control={control}
              rules={{required: 'Navn er påkrævet'}}
              name="name"
              render={({field: {onBlur, value, onChange}}) => (
                <InputField
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                  label="Navn..."
                  icon={
                    <MaterialIcons
                      name="person-outline"
                      size={20}
                      color={errors.name ? 'red' : '#666'}
                      style={{marginRight: 5}}
                    />
                  }
                  error={!!errors.name}
                  errorText={errors.name?.message?.toString()}
                />
              )}
            />
            <Controller
              control={control}
              rules={{
                required: 'E-mail er påkrævet',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Indtast en gyldig e-mail',
                },
              }}
              name="email"
              render={({field: {onBlur, value, onChange}}) => (
                <InputField
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                  label="E-mail..."
                  icon={
                    <MaterialIcons
                      name="alternate-email"
                      size={20}
                      color={errors.email ? 'red' : '#666'}
                      style={{marginRight: 5}}
                    />
                  }
                  keyboardType="email-address"
                  error={!!errors.email}
                  errorText={errors.email?.message?.toString()}
                />
              )}
            />
            <Controller
              control={control}
              rules={{
                required: 'Password er påkrævet',
                minLength: {
                  value: 6,
                  message: 'Password skal være mindst 6 tegn',
                },
              }}
              name="password"
              render={({field: {onBlur, value, onChange}}) => (
                <InputField
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                  label="Password..."
                  icon={
                    <MaterialIcons
                      name="lock-outline"
                      size={20}
                      color={errors.password ? 'red' : '#666'}
                      style={{marginRight: 5}}
                    />
                  }
                  inputType="password"
                  error={!!errors.password}
                  errorText={errors.password?.message?.toString()}
                />
              )}
            />
            <Controller
              control={control}
              rules={{
                required: 'Gentag password er påkrævet',
                validate: value =>
                  value === passwordValue || 'Passwords matcher ikke',
              }}
              name="repeatPassword"
              render={({field: {onBlur, value, onChange}}) => (
                <InputField
                  onChangeText={onChange}
                  value={value}
                  onBlur={onBlur}
                  label="Gentag password..."
                  icon={
                    <MaterialIcons
                      name="lock-outline"
                      size={20}
                      color={errors.repeatPassword ? 'red' : '#666'}
                      style={{marginRight: 5}}
                    />
                  }
                  inputType="password"
                  error={!!errors.repeatPassword}
                  errorText={errors.repeatPassword?.message?.toString()}
                />
              )}
            />
            <CustomButton
              title="Registrer"
              onPress={handleSubmit(onSubmit)}
              backgroundColor={colors.button.main}
              textColor="#fff"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '80%',
    height: '100%',
    alignSelf: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 4,
  },
});

export default RegisterScreen;
