import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {SCREEN_WIDTH} from '../../../../utils/Dimensions.ts';
import {useRefreshContext} from '../../../../navigation/RefreshContext.tsx';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Pdf from 'react-native-pdf';
import DropDownPicker from 'react-native-dropdown-picker';
import useThemeContext from '../../../../theme/useThemeContext.ts';
import {ThemeColors} from '../../../../theme/colors.ts';
import CustomButton from '../../../../components/buttons/CustomButton.tsx';
import SuccessAlert from '../../../../components/SuccessAlert.tsx';

const CreateNetworkDocuments = ({networkId, close}) => {
  const [uploading, setUploading] = useState(false);
  const {triggerRefresh} = useRefreshContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [isAddProjectModalVisible, setIsAddProjectModalVisible] =
    useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const {colors} = useThemeContext();
  const themeStyles = styles(colors);
  const [displaySuccessAlert, setDisplaySuccessAlert] = useState(false);

  const getNetworkProjects = async () => {
    firestore()
      .collection('PROJECTS')
      .where('networkId', '==', networkId)
      .onSnapshot(snapshot => {
        const fetchedProjects = snapshot.docs.map(doc => ({
          value: doc.id,
          label: doc.data().name,
        }));
        setProjects(fetchedProjects);
      });
  };

  const addProject = async () => {
    if (newProjectName.trim() === '') return;
    try {
      await firestore()
        .collection('PROJECTS')
        .add({name: newProjectName, networkId});
      setIsAddProjectModalVisible(false);
      setNewProjectName('');
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: {errors},
  } = useForm({
    defaultValues: {
      projectId: '',
      title: '',
      type: '',
      documentUri: null,
    },
  });

  const type = watch('type');
  const documentUri = watch('documentUri');

  const onSubmit = async data => {
    const user = auth().currentUser;
    if (!user) return;

    const uid = user.uid;
    setUploading(true);

    if (data.documentUri) {
      const documentRef = storage().ref(`documents/${networkId}/${Date.now()}`);
      await documentRef
        .putFile(data.documentUri)
        .then(async () => {
          const documentUrl = await documentRef.getDownloadURL();
          await firestore()
            .collection('DOCUMENTS')
            .add({
              title: data.title,
              type: data.type,
              url: documentUrl,
              networkId: networkId,
              createdAt: firestore.FieldValue.serverTimestamp(),
              uploadedByUid: uid,
              uploadedByName: user.displayName,
              projectId: data.projectId,
            })
            .finally(() => {
              setUploading(false);
              triggerRefresh();
              setDisplaySuccessAlert(!displaySuccessAlert);
            });
        })
        .catch(error => {
          console.error('Error uploading document: ', error);
        });
    }
  };

  useEffect(() => {
    getNetworkProjects();
    reset();
  }, [reset, uploading]);

  const handleDocumentPicker = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
      });

      if (result) {
        const uri = result[0].uri;
        const fileName = result[0].name || 'Untitled Document';
        setValue('documentUri', uri); // Set the selected document URI in the form
        setValue('title', fileName);
        setValue('type', result[0].type); // Set document name to editable field
        setIsModalVisible(false);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled document picker');
      } else {
        console.error('Unknown error: ', err);
      }
    }
  };

  const selectToolImage = async () => {
    const option: ImageLibraryOptions = {
      mediaType: 'photo',
    };
    await launchImageLibrary(option, response => {
      if (response && response.assets && !response.didCancel) {
        setValue('title', response.assets[0].fileName);
        setValue('documentUri', response.assets[0].uri); // Set the selected document URI in the form
        setValue('type', response.assets[0].type);
        setIsModalVisible(false);
      }
    });
  };

  const renderDocument = () => {
    if (!type || !documentUri) {
      return <Text style={themeStyles.filePickerText}>Vælg dokument</Text>;
    }

    switch (type) {
      case 'application/pdf':
        return (
          <Pdf
            source={{uri: documentUri}}
            fitPolicy={0}
            minScale={1.0}
            maxScale={1.0}
            scale={1.0}
            spacing={0}
            style={themeStyles.pdf}
          />
        );
      case 'image/jpg' || 'image/png':
        return (
          <Image
            resizeMode="cover"
            resizeMethod="scale"
            style={{width: 200, height: 150}}
            source={{uri: documentUri}}
          />
        );
      default:
        return <Text style={themeStyles.filePickerText}>Vælg dokument</Text>;
    }
  };

  return (
    <>
      <SuccessAlert
        visible={displaySuccessAlert}
        navigateBack={() => close()}
        text={'Dokument uploaded'}
      />
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        style={themeStyles.filePicker}>
        {renderDocument()}
      </TouchableOpacity>
      <Controller
        name="title"
        control={control}
        rules={{required: true}}
        render={({field: {onChange, value}}) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            style={themeStyles.input}
            placeholderTextColor={'#676767'}
            placeholder="Document navn"
          />
        )}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          marginBottom: 10,
          gap: 10,
        }}>
        <View style={{flex: 4}}>
          <Controller
            name="projectId"
            control={control}
            rules={{required: true}}
            render={({field: {onChange, value}}) => (
              <DropDownPicker
                open={open}
                value={value}
                items={projects}
                setOpen={setOpen}
                setValue={val => onChange(val())}
                listMode={'MODAL'}
                placeholder={'Vælg projekt'}
                style={{borderColor: '#ccc'}}
                placeholderStyle={{color: '#676767'}}
              />
            )}
          />
        </View>
        <CustomButton
          title={<MaterialIcons name={'add'} size={24} color="#fff" />}
          onPress={() => setIsAddProjectModalVisible(true)}
          backgroundColor={colors.button.secondary}
        />
      </View>
      <CustomButton
        title={uploading ? 'Opretter...' : 'Upload dokument'}
        onPress={handleSubmit(onSubmit)}
        disabled={uploading}
        backgroundColor={colors.button.secondary}
      />
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={themeStyles.modalContainer}>
          <View style={themeStyles.modalContent}>
            <View
              style={{flexDirection: 'row', width: '100%', marginBottom: 10}}>
              <View style={{flex: 1 / 4}} />
              <View style={{flex: 2 / 4, alignItems: 'center'}}>
                <Text style={{fontSize: 18}}>Vælg dokument type</Text>
              </View>
              <View style={{flex: 1 / 4, alignItems: 'flex-end'}}>
                <TouchableOpacity
                  onPress={() => setIsModalVisible(false)}
                  style={{backgroundColor: '#C6C6C6', borderRadius: 10}}>
                  <MaterialIcons name="close" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{flexDirection: 'row', gap: 15}}>
              <TouchableOpacity
                onPress={selectToolImage}
                style={themeStyles.modalButton}>
                <Text style={themeStyles.buttonText}>Billede</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDocumentPicker}
                style={themeStyles.modalButton}>
                <Text style={themeStyles.buttonText}>Dokument</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={isAddProjectModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsAddProjectModalVisible(false)}>
        <View style={themeStyles.modalContainer}>
          <View style={themeStyles.modalContent}>
            <View
              style={{flexDirection: 'row', width: '100%', marginBottom: 10}}>
              <View style={{flex: 1 / 4}} />
              <View style={{flex: 2 / 4, alignItems: 'center'}}>
                <Text style={{fontSize: 18}}>Tilføj nyt projekt</Text>
              </View>
              <View style={{flex: 1 / 4, alignItems: 'flex-end'}}>
                <TouchableOpacity
                  onPress={() => setIsAddProjectModalVisible(false)}
                  style={{backgroundColor: '#C6C6C6', borderRadius: 10}}>
                  <MaterialIcons name="close" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
            <TextInput
              style={themeStyles.modalInput}
              placeholder="Project Name"
              value={newProjectName}
              onChangeText={setNewProjectName}
            />
            <CustomButton
              title={'Tilføj'}
              onPress={addProject}
              backgroundColor={colors.button.secondary}
            />
          </View>
        </View>
      </Modal>
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
    modalInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 8,
      marginBottom: 10,
      width: '80%',
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
    filePicker: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      height: 150,
      marginBottom: 10,
      borderRadius: 8,
    },
    filePickerText: {
      color: '#888',
    },
    errorText: {
      color: '#a11d1d',
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
    modalButton: {
      backgroundColor: colors.button.secondary,
      padding: 10,
      borderRadius: 8,
      alignItems: 'center',
    },
    pdf: {
      flex: 1,
      width: Dimensions.get('window').width / 3,
      height: Dimensions.get('window').height / 3,
      marginVertical: 10,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    addProjectButton: {
      flex: 1,
      backgroundColor: colors.button.secondary,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default CreateNetworkDocuments;
