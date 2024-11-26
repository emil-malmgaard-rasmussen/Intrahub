import auth, {
  getAuth,
  reauthenticateWithCredential,
  updateEmail,
} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useRefreshContext} from '../../../navigation/RefreshContext.tsx';
import {SCREEN_WIDTH} from '../../../utils/Dimensions.ts';
import {useSetRecoilState} from 'recoil';
import {overlayActiveAtom} from '../../../utils/Atoms.ts';

const EditUserForm = ({user}) => {
  const [uploading, setUploading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const {triggerRefresh} = useRefreshContext();
  const getAuthTest = getAuth();
  const authUser = getAuthTest.currentUser;
  const uid = authUser!.uid;
  const setOverlayActive = useSetRecoilState(overlayActiveAtom);

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      displayName: user.displayName,
      email: user.email,
      companyName: user.companyName,
      phoneNumber: user.phoneNumber,
    },
  });

  const onSubmit = async data => {
    if (data.email !== user.email) {
      setIsModalVisible(true);
      return;
    }

    setUploading(true);

    try {
      const temp = await firestore()
        .collection('USERS')
        .where('uid', '==', uid)
        .limit(1)
        .get();

      await firestore().collection('USERS').doc(temp.docs[0].id).set(
        {
          displayName: data.displayName,
          companyName: data.companyName,
          phoneNumber: data.phoneNumber,
        },
        {merge: true},
      );

      setOverlayActive(false);
      Alert.alert('Success', 'Profile updated');
      triggerRefresh();
    } catch (error) {
      console.error('Error updating user:', error);
      Alert.alert('Error', 'An error occurred while updating your profile');
    } finally {
      setUploading(false);
    }
  };

  const reauthenticateAndUpdateEmail = async (data: any) => {
    try {
      setUploading(true);
      // Reauthenticate with the entered password
      const credential = auth.EmailAuthProvider.credential(
        user.email,
        password,
      );
      await reauthenticateWithCredential(authUser!, credential);

      const temp = await firestore()
        .collection('USERS')
        .where('uid', '==', uid)
        .limit(1)
        .get();

      await firestore().collection('USERS').doc(temp.docs[0].id).set(
        {
          displayName: data.displayName,
          companyName: data.companyName,
          phoneNumber: data.phoneNumber,
          email: data.email,
        },
        {merge: true},
      );
      await updateEmail(authUser!, data.email);
      triggerRefresh();
      setOverlayActive(false);
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error reauthenticating user:', error);
      Alert.alert('Error', 'Reauthentication failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <View style={{padding: 20}}>
      <Controller
        name="displayName"
        control={control}
        rules={{required: true}}
        render={({field: {onChange, value}}) => (
          <TextInput
            placeholder="Navn"
            value={value}
            onChangeText={onChange}
            placeholderTextColor={'#676767'}
            style={[errors.displayName ? styles.errorInput : styles.input]}
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        rules={{required: true}}
        render={({field: {onChange, value}}) => (
          <TextInput
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            placeholderTextColor={'#676767'}
            style={[errors.email ? styles.errorInput : styles.input]}
          />
        )}
      />
      <Controller
        name="phoneNumber"
        control={control}
        rules={{required: true}}
        render={({field: {onChange, value}}) => (
          <TextInput
            placeholder="Tlf. nr."
            value={value}
            onChangeText={onChange}
            multiline
            placeholderTextColor={'#676767'}
            style={[errors.phoneNumber ? styles.errorInput : styles.input]}
          />
        )}
      />
      <Controller
        name="companyName"
        control={control}
        rules={{required: true}}
        render={({field: {onChange, value}}) => (
          <TextInput
            placeholder="Virksomhedsnavn"
            value={value}
            onChangeText={onChange}
            multiline
            placeholderTextColor={'#676767'}
            style={[errors.companyName ? styles.errorInput : styles.input]}
          />
        )}
      />
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        style={styles.button}
        disabled={uploading}>
        {uploading ? (
          <ActivityIndicator size={'small'} color={'#FFF'} />
        ) : (
          <Text style={styles.buttonText}>Opdater profil</Text>
        )}
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{marginBottom: 10}}>
              Verificer ved at indtaste dit password
            </Text>
            <TextInput
              placeholder="Password"
              value={password}
              secureTextEntry
              onChangeText={setPassword}
              style={styles.input}
            />
            <View style={{flexDirection: 'row', gap: 10}}>
              <TouchableOpacity
                onPress={handleSubmit(reauthenticateAndUpdateEmail)}
                style={styles.button}>
                <Text style={styles.buttonText}>Godkend</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.button}>
                <Text style={styles.buttonText}>Afbryd</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  errorInput: {
    borderWidth: 1,
    borderColor: '#ff0000',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1ba16e',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: SCREEN_WIDTH - 40,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default EditUserForm;
