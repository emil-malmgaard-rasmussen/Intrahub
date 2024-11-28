import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import InputField from '../../components/inputs/InputField';
import CustomButton from '../../components/buttons/CustomButton';
import {AuthContext} from '../../auth/AuthProvider';
import useThemeContext from '../../theme/useThemeContext';
import {ThemeColors} from '../../theme/colors.ts';

type LoginFormInputs = {
  email: string;
  password: string;
};

type LoginScreenProps = {
  navigation: any; // Replace `any` with proper type from your navigation library, e.g., `StackNavigationProp`
};

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const {control, handleSubmit} = useForm<LoginFormInputs>();
  const {login} = useContext<any>(AuthContext);
  const {colors} = useThemeContext();
  const imageHeight = useRef(new Animated.Value(270)).current;
  const [isModalVisible, setModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const styles = createStyles(colors);

  const onSubmit = async (data: {email: string; password: string}) => {
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
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Animated.View style={[styles.imageContainer, {height: imageHeight}]}>
            <Image
              source={require('../../assets/images/login-image-user.png')}
              style={styles.image}
            />
          </Animated.View>
          <View style={styles.inputContainer}>
            <Controller
              control={control}
              rules={{required: true}}
              name="email"
              render={({field: {onChange, onBlur, value}}) => (
                <InputField
                  onBlur={onBlur}
                  value={value}
                  onChangeText={onChange}
                  inputType={'default'}
                  label="Email..."
                  icon={
                    <MaterialIcons
                      name="alternate-email"
                      size={20}
                      color={'#666'}
                    />
                  }
                  keyboardType="email-address"
                />
              )}
            />
            <Controller
              control={control}
              rules={{required: true}}
              name="password"
              render={({field: {onChange, onBlur, value}}) => (
                <InputField
                  onBlur={onBlur}
                  value={value}
                  onChangeText={onChange}
                  label="Password..."
                  icon={
                    <MaterialIcons
                      name="lock-outline"
                      size={20}
                      color={'#666'}
                    />
                  }
                  inputType="password"
                  fieldButtonLabel="Glemt?"
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
          <View style={styles.registerContainer}>
            <Text style={styles.newUserText}>Ny bruger?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerText}>Registrer</Text>
            </TouchableOpacity>
          </View>
          <Modal
            transparent
            visible={isModalVisible}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Glemt Password</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Email"
                  value={resetEmail}
                  onChangeText={setResetEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <View style={{flexDirection: 'row', justifyContent: 'center', gap: 50}}>
                  <TouchableOpacity
                    onPress={handlePasswordReset}
                    style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>Send</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.modalCancel}>
                    <Text style={styles.modalCancelText}>Annuller</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {flex: 1},
    content: {paddingHorizontal: 15},
    imageContainer: {overflow: 'hidden'},
    image: {height: '100%', width: '100%'},
    inputContainer: {paddingTop: 60},
    registerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 30,
    },
    registerText: {
      color: colors.button.main,
      fontWeight: '700',
      paddingLeft: 3,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      width: '80%',
      padding: 20,
      backgroundColor: colors.backgrounds.main,
      borderRadius: 10,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
    },
    modalInput: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      marginBottom: 20,
      paddingVertical: 5,
    },
    modalButton: {
      backgroundColor: colors.button.main,
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    modalButtonText: {
      color: colors.text.light,
      fontWeight: '600',
    },
    newUserText: {
      color: colors.text.default,
    },
    modalCancel: {
      marginTop: 10,
      alignItems: 'center',
    },
    modalCancelText: {
      color: colors.text.light,
    },
  });

export default LoginScreen;
