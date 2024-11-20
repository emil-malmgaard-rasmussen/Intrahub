import {
  Animated,
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
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
  } = useForm();
  const {register} = useContext<any>(AuthContext);
  const imageHeight = useRef(new Animated.Value(270)).current;
  const {colors} = useThemeContext();
  const onSubmit = (data: any) => {
    register(data);
  };

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        Animated.timing(imageHeight, {
          toValue: 0, // Animate the image height to 0 (hide it)
          duration: 300,
          useNativeDriver: false,
        }).start();
      },
    );

    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        Animated.timing(imageHeight, {
          toValue: 270, // Animate the image height back to 270 (show it)
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
      <Animated.View style={{height: imageHeight, overflow: 'hidden'}}>
        <Image
          source={require('../../assets/images/onboarding1.png')}
          style={styles.image}
        />
      </Animated.View>
      <View style={{marginTop: 50, paddingHorizontal: 15}}>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          name={'name'}
          render={({field: {onBlur, value, onChange}}) => (
            <InputField
              onChange={onChange}
              value={value}
              onBlur={onBlur}
              label={'Navn...'}
              icon={
                <MaterialIcons
                  name="person-outline"
                  size={20}
                  color={errors.name ? 'red' : '#666'}
                  style={{marginRight: 5}}
                />
              }
              inputType={'name'}
              error={errors.name}
            />
          )}
        />
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          name={'email'}
          render={({field: {onBlur, value, onChange}}) => (
            <InputField
              onChange={onChange}
              value={value}
              onBlur={onBlur}
              label={'E-mail...'}
              icon={
                <MaterialIcons
                  name="alternate-email"
                  size={20}
                  color={errors.email ? 'red' : '#666'}
                  style={{marginRight: 5}}
                />
              }
              keyboardType="email-address"
              inputType={'email'}
              error={errors.email}
            />
          )}
        />
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          name={'password'}
          render={({field: {onBlur, value, onChange}}) => (
            <InputField
              onChange={onChange}
              value={value}
              onBlur={onBlur}
              label={'Password...'}
              icon={
                <MaterialIcons
                  name="lock-outline"
                  size={20}
                  color={errors.password ? 'red' : '#666'}
                  style={{marginRight: 5}}
                />
              }
              error={errors.password}
              inputType="password"
            />
          )}
        />
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          name={'repeatPassword'}
          render={({field: {onBlur, value, onChange}}) => (
            <InputField
              onChange={onChange}
              value={value}
              onBlur={onBlur}
              label={'Gentag password...'}
              icon={
                <MaterialIcons
                  name="lock-outline"
                  size={20}
                  color={errors.repeatPassword ? 'red' : '#666'}
                  style={{marginRight: 5}}
                />
              }
              error={errors.repeatPassword}
              inputType="password"
            />
          )}
        />
        <CustomButton
          title="Registrer"
          onPress={handleSubmit(onSubmit)}
          backgroundColor={colors.button.main} // Optional: uses theme by default
          textColor="#fff"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '80%',
    height: '100%',
    alignSelf: 'center',
  },
  title: {
    color: '#1ba16e',
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  description: {
    color: '#7598a5',
    width: '80%',
    textAlign: 'center',
    marginVertical: 16,
    alignSelf: 'center',
  },
  prevText: {
    color: '#2196F3',
    fontSize: 16,
  },
  chevronLeft: {
    color: '#2196F3',
    paddingRight: 4,
  },
  navigateBack: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
});

export default RegisterScreen;
