import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {StyleSheet, Text, TextInput, TouchableOpacity} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useRefreshContext} from '../../../../navigation/RefreshContext';
import CustomButton from '../../../../components/buttons/CustomButton.tsx';
import useThemeContext from '../../../../theme/useThemeContext.ts';
import SuccessAlert from '../../../../components/SuccessAlert.tsx';

const CreateNetworkActivities = ({networkId, close}) => {
  const [uploading, setUploading] = useState(false);
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined); // Set initial state to undefined
  const [toDate, setToDate] = useState<Date | undefined>(undefined); // Set initial state to undefined
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'from' | 'to'>('from'); // Track which date picker is visible
  const {currentUser} = auth();
  const {triggerRefresh} = useRefreshContext();
  const {colors} = useThemeContext();
  const [displaySuccessAlert, setDisplaySuccessAlert] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = async (data: any) => {
    const user = auth().currentUser;
    if (!user) return;

    const uid = user.uid;
    setUploading(true);

    await firestore()
      .collection('ACTIVITIES')
      .add({
        title: data.title,
        description: data.description,
        dateFrom: fromDate ? firestore.Timestamp.fromDate(fromDate) : null,
        dateTo: toDate ? firestore.Timestamp.fromDate(toDate) : null,
        uid,
        networkId,
        createdByUid: uid,
        createdByName: user?.displayName,
        createdAt: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        console.log("CREATED")
        triggerRefresh();
        setDisplaySuccessAlert(!displaySuccessAlert);
      })
      .catch(error => {
        console.error('Error adding activity: ', error);
      })
      .finally(() => {
        setUploading(false);
        reset();
        setFromDate(undefined);
        setToDate(undefined);
      });
  };

  useEffect(() => {
    reset();
  }, [reset, uploading]);

  const showDatePicker = (mode: 'from' | 'to') => {
    setDatePickerMode(mode);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate: Date) => {
    if (datePickerMode === 'from') {
      setFromDate(selectedDate);
    } else if (datePickerMode === 'to') {
      setToDate(selectedDate);
    }
    hideDatePicker();
  };

  return (
    <>
      <SuccessAlert
        visible={displaySuccessAlert}
        navigateBack={() => close()}
        text={'Aktivitet oprettet'}
      />
      <Controller
        name="title"
        control={control}
        rules={{required: true}}
        render={({field: {onChange, value}}) => (
          <TextInput
            placeholder="Title"
            value={value}
            onChangeText={onChange}
            placeholderTextColor={'#676767'}
            style={[errors.title ? styles.errorInput : styles.input]}
          />
        )}
      />
      {errors.title && <Text style={styles.errorText}>Title is required.</Text>}

      <Controller
        name="description"
        control={control}
        rules={{required: true}}
        render={({field: {onChange, value}}) => (
          <TextInput
            placeholder="Beskrivelse"
            value={value}
            onChangeText={onChange}
            multiline
            numberOfLines={4}
            placeholderTextColor={'#676767'}
            style={[errors.description ? styles.errorInput : styles.textArea]}
          />
        )}
      />
      {errors.description && (
        <Text style={styles.errorText}>Description is required.</Text>
      )}
      <TouchableOpacity
        onPress={() => showDatePicker('from')}
        style={styles.datePickerButton}>
        <Text style={styles.datePickerText}>
          {fromDate
            ? `Fra d.: ${fromDate.toLocaleDateString()}`
            : 'Vælg startdato'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => showDatePicker('to')}
        style={styles.datePickerButton}>
        <Text style={styles.datePickerText}>
          {toDate ? `Til d.: ${toDate.toLocaleDateString()}` : 'Vælg slutdato'}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <CustomButton
        onPress={handleSubmit(onSubmit)}
        disabled={uploading}
        title={uploading ? 'Opretter...' : 'Opret'}
        backgroundColor={colors.button.secondary}
      />
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: 'red',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  errorText: {
    color: '#a11d1d',
  },
  datePickerButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  datePickerText: {
    color: '#333',
  },
});

export default CreateNetworkActivities;
