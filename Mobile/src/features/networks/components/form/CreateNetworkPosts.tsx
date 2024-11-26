import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {SCREEN_WIDTH} from '../../../../utils/Dimensions.ts';
import {useRefreshContext} from '../../../../navigation/RefreshContext.tsx';
import {launchImageLibrary} from 'react-native-image-picker';
import useThemeContext from '../../../../theme/useThemeContext.ts';
import {ThemeColors} from '../../../../theme/colors.ts';
import CustomButton from '../../../../components/buttons/CustomButton.tsx';
import SuccessAlert from '../../../../components/SuccessAlert.tsx';

const CreateNetworkPosts = ({networkId, close}) => {
  const [uploading, setUploading] = useState(false);
  const {colors} = useThemeContext();
  const themeStyles = styles(colors);
  const {triggerRefresh} = useRefreshContext();
  const [displaySuccessAlert, setDisplaySuccessAlert] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {
      title: '',
      bio: '',
      text: '',
      image: null,
    },
  });

  const onSubmit = async data => {
    const user = auth().currentUser;
    if (!user) return;

    const uid = user.uid;
    setUploading(true);
    let imageUrl = '';

    if (data.image) {
      const imageRef = storage().ref(`posts/${networkId}/${Date.now()}`);
      await imageRef
        .putFile(data.image)
        .then(async () => {
          imageUrl = await imageRef.getDownloadURL();
        })
        .catch(error => {
          console.error('Error uploading image: ', error);
        });
    }

    await firestore()
      .collection('POSTS')
      .add({
        title: data.title,
        bio: data.bio,
        text: data.text,
        imageUrl,
        uid,
        networkId,
        createdAt: firestore.FieldValue.serverTimestamp(),
      })
      .finally(() => {
        setUploading(false);
        triggerRefresh();
        setDisplaySuccessAlert(!displaySuccessAlert);
      });
  };

  useEffect(() => {
    reset();
  }, [reset, uploading]);

  const handleImagePicker = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
    });

    if (!result.didCancel && result.assets) {
      const uri = result.assets[0].uri;
      setValue('image', uri); // Set the selected image URI in the form
    }
  };

  return (
    <>
      <SuccessAlert
        visible={displaySuccessAlert}
        navigateBack={() => close()}
        text={'Opslag oprettet'}
      />
      <TouchableOpacity
        onPress={handleImagePicker}
        style={themeStyles.imagePicker}>
        <Controller
          name="image"
          control={control}
          rules={{required: false}}
          render={({field: {onChange, value}}) =>
            value ? (
              <Image source={{uri: value}} style={themeStyles.imagePreview} />
            ) : (
              <Text style={themeStyles.imagePickerText}>Vælg billede</Text>
            )
          }
        />
      </TouchableOpacity>
      {errors.image && (
        <Text style={themeStyles.errorText}>Image is required.</Text>
      )}

      <Controller
        name="title"
        control={control}
        rules={{required: true}}
        render={({field: {onChange, value}}) => (
          <TextInput
            placeholder="Post Title"
            value={value}
            onChangeText={onChange}
            placeholderTextColor={'#676767'}
            style={[errors.title ? themeStyles.errorInput : themeStyles.input]}
          />
        )}
      />
      <Controller
        name="bio"
        control={control}
        rules={{required: true}}
        render={({field: {onChange, value}}) => (
          <TextInput
            placeholder="Short Bio"
            value={value}
            onChangeText={onChange}
            placeholderTextColor={'#676767'}
            style={[errors.bio ? themeStyles.errorInput : themeStyles.input]}
          />
        )}
      />
      <Controller
        name="text"
        control={control}
        rules={{required: true}}
        render={({field: {onChange, value}}) => (
          <TextInput
            placeholder="Post Text"
            value={value}
            onChangeText={onChange}
            multiline
            numberOfLines={6}
            placeholderTextColor={'#676767'}
            style={[errors.text ? themeStyles.errorInput : themeStyles.input]}
          />
        )}
      />
      <CustomButton
        title={uploading ? 'Opretter...' : 'Opret'}
        onPress={handleSubmit(onSubmit)}
        disabled={uploading}
        backgroundColor={colors.button.secondary}
      />
    </>
  );
};

const styles = (colors: ThemeColors) =>
  StyleSheet.create({
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
    },
    errorInput: {
      borderWidth: 1,
      borderColor: '#ff0000',
      padding: 10,
      borderRadius: 8,
      marginBottom: 10,
    },
    button: {
      backgroundColor: colors.button.secondary,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 20,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    imagePicker: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      height: 150,
      marginBottom: 10,
      borderRadius: 8,
    },
    imagePickerText: {
      color: '#888',
    },
    imagePreview: {
      width: SCREEN_WIDTH - 40,
      height: 150,
      borderRadius: 8,
    },
    errorText: {
      color: '#a11d1d',
    },
  });

export default CreateNetworkPosts;
