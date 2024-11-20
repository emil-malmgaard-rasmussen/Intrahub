import {
  Alert,
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useContext, useEffect, useRef, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {AuthContext} from '../../auth/AuthProvider.tsx';
import InputField from '../../components/inputs/InputField.tsx';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import useThemeContext from '../../theme/useThemeContext.ts';
import CustomButton from '../../components/buttons/CustomButton.tsx';

const LoginScreen = ({navigation}) => {
  const {control, handleSubmit} = useForm();
  const {login} = useContext<any>(AuthContext);
  const imageHeight = useRef(new Animated.Value(270)).current;
  const {colors} = useThemeContext();
  const [isModalVisible, setModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const onSubmit = async data => {
    login(data.email, data.password);
  };

  const handlePasswordReset = async () => {
    try {
      await auth().sendPasswordResetEmail(resetEmail);
      Alert.alert('Anmodning om nyt password sendt!');
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Fejl, prøv igen eller kontakt support');
    }
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <View style={{paddingHorizontal: 15}}>
          <Animated.View style={{height: imageHeight, overflow: 'hidden'}}>
            <Image
              source={require('../../assets/images/login-image-user.png')}
              style={{height: '100%', width: '100%'}}
            />
          </Animated.View>
          <View style={{paddingTop: 60}}>
            <Controller
              control={control}
              rules={{required: true}}
              name={'email'}
              render={({field: {onChange, onBlur, value}}) => (
                <InputField
                  onBlur={onBlur}
                  value={value}
                  onChange={onChange}
                  label={'Email...'}
                  icon={
                    <MaterialIcons
                      name="alternate-email"
                      size={20}
                      color="#666"
                      style={{marginRight: 5}}
                    />
                  }
                  keyboardType="email-address"
                  inputType={'email'}
                />
              )}
            />
            <Controller
              control={control}
              rules={{required: true}}
              name={'password'}
              render={({field: {onChange, onBlur, value}}) => (
                <InputField
                  onBlur={onBlur}
                  value={value}
                  onChange={onChange}
                  label={'Password...'}
                  icon={
                    <MaterialIcons
                      name="lock-outline"
                      size={20}
                      color="#666"
                      style={{marginRight: 5}}
                    />
                  }
                  inputType="password"
                  fieldButtonLabel={'Glemt?'}
                  fieldButtonFunction={() => setModalVisible(true)}
                />
              )}
            />
          </View>
          <CustomButton
            title="Login"
            onPress={handleSubmit(onSubmit)}
            backgroundColor={colors.button.main}
            textColor="#fff"
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 30,
            }}>
            <Text>Ny bruger?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text
                style={{
                  color: colors.button.main,
                  fontWeight: '700',
                  paddingLeft: 3,
                }}>
                Registrer
              </Text>
            </TouchableOpacity>
          </View>
          <Modal
            transparent={true}
            visible={isModalVisible}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <View
                style={{
                  width: '80%',
                  padding: 20,
                  backgroundColor: 'white',
                  borderRadius: 10,
                }}>
                <Text
                  style={{fontSize: 18, fontWeight: 'bold', marginBottom: 15}}>
                  Glemt Password
                </Text>
                <TextInput
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#ccc',
                    marginBottom: 20,
                    paddingVertical: 5,
                  }}
                  placeholder="Email"
                  value={resetEmail}
                  onChangeText={setResetEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={handlePasswordReset}
                  style={{
                    backgroundColor: '#1ba16e',
                    padding: 10,
                    borderRadius: 5,
                    alignItems: 'center',
                  }}>
                  <Text style={{color: 'white', fontWeight: '600'}}>Send</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{marginTop: 10, alignItems: 'center'}}>
                  <Text style={{color: '#1ba16e'}}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
