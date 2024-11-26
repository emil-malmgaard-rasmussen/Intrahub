import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SCREEN_WIDTH} from '../../utils/Dimensions';
import ScreenHeader from '../../components/ScreenHeader.tsx';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ThemeColors} from '../../theme/colors.ts';
import useThemeContext from '../../theme/useThemeContext.ts';
import {Controller, FormProvider, useForm} from 'react-hook-form';
import {YesOrNoComponent} from './components/YesNoComponent.tsx';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import SuccessAlert from '../../components/SuccessAlert.tsx';

const ApvDetailScreen = ({route, navigation}) => {
  const {apv} = route.params;
  const currentUser = auth().currentUser;
  const methods = useForm();
  const {colors} = useThemeContext();
  const themeStyles = styles(colors);
  const [displaySuccessAlert, setDisplaySuccessAlert] = useState(false);

  const onSubmit = async (data: any) => {
    console.log(data);
    try {
      data.createdBy = currentUser?.displayName;
      data.createdByUid = currentUser?.uid;
      data.createdAt = firestore.FieldValue.serverTimestamp();
      data.apvId = apv.id;

      const apvAnswersCollection = firestore()
        .collection('APV')
        .doc(apv.id)
        .collection('answers');

      await apvAnswersCollection.add(data);
      setDisplaySuccessAlert(!displaySuccessAlert);
    } catch (error) {
      console.error('Error submitting answers:', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={themeStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}>
      <SuccessAlert
        visible={displaySuccessAlert}
        navigateBack={() => navigation.goBack()}
        text={'APV besvaret'}
      />
      <ScreenHeader
        title={''}
        leftIcon={
          <TouchableOpacity
            style={themeStyles.leftIconContainer}
            onPress={() => navigation.goBack()}>
            <MaterialIcons
              style={themeStyles.headerIcon}
              size={30}
              name={'chevron-left'}
            />
            <Text style={themeStyles.leftIconText}>Tilbage</Text>
          </TouchableOpacity>
        }
        rightIcon={
          <TouchableOpacity onPress={() => methods.handleSubmit(onSubmit)()}>
            <Text style={themeStyles.leftIconText}>Godkend</Text>
          </TouchableOpacity>
        }
      />
      <View style={{flex: 8}}>
        <View style={themeStyles.headerContainer}>
          <Text style={themeStyles.name}>{apv.name}</Text>
        </View>
        <ScrollView style={themeStyles.scrollViewContainer}>
          <FormProvider {...methods}>
            {apv.questions.map((question, index: number) => (
              <View key={index}>
                <View style={themeStyles.columnContainer}>
                  <View style={themeStyles.questionContainer}>
                    <Controller
                      defaultValue={question.title}
                      name={`answers.${index}.title`}
                      render={() => (
                        <Text style={themeStyles.questionTitle}>
                          {question.title}
                        </Text>
                      )}
                    />
                  </View>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <Controller
                      defaultValue={question.description}
                      name={`answers.${index}.description`}
                      render={() => (
                        <Text style={themeStyles.questionDescription}>
                          {question.description}
                        </Text>
                      )}
                    />
                    <View style={themeStyles.expandedContent}>
                      <YesOrNoComponent questionIndex={index} />
                    </View>
                  </View>
                  {methods.watch(`answers.${index}.answer`) === true && (
                    <View style={{marginTop: 10}}>
                      <Controller
                        name={`answers.${index}.comment`}
                        defaultValue=""
                        render={({field: {onChange, onBlur, value}}) => (
                          <TextInput
                            style={themeStyles.textInput}
                            placeholder="Tilføj kommentar"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                          />
                        )}
                      />
                    </View>
                  )}
                  <Controller
                    name={`answers.${index}.answer`}
                    rules={{
                      validate: (value) =>
                        value !== undefined || 'Udfyld venligst', // Ensure value is either true or false
                    }}
                    render={({ fieldState: { error } }) => (
                      <>
                        {error && (
                          <Text style={themeStyles.errorText}>{error.message}</Text>
                        )}
                      </>
                    )}
                  />
                </View>
              </View>
            ))}
          </FormProvider>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    headerContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 15,
      paddingBottom: 15,
      backgroundColor: colors.header.main,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 75,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#FFFFFF',
    },
    name: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#FFFFFF',
    },
    secondContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginBottom: 5,
    },
    second: {
      fontSize: 18,
      marginBottom: 5,
      color: '#FFFFFF',
    },
    tabContent: {
      marginTop: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabButtonContainer: {
      flexDirection: 'row',
      flexWrap: 'nowrap', // Prevent wrapping to maintain a single line
      alignItems: 'center', // Center items vertically
    },
    tabButton: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    tabButtonText: {
      fontSize: 16,
      color: '#FFFFFF',
    },
    activeTabButtonText: {
      color: '#B3E5FC',
      fontWeight: 'bold',
    },
    underline: {
      position: 'absolute',
      bottom: 0,
      left: 30,
      width: (SCREEN_WIDTH - 100) / 4,
      height: 3,
      backgroundColor: '#B3E5FC',
    },
    bottomSheetModalContainer: {
      backgroundColor: '#FFF',
    },
    bottomSheetStack: {
      backgroundColor: '#959595',
    },
    bottomSheetHeaderText: {
      fontWeight: 'bold',
      fontSize: 16,
      color: '#FFF',
    },
    bottomSheetHeaderActionButtonText: {
      fontWeight: 'bold',
      fontSize: 16,
      color: '#FFF',
    },
    contentContainer: {
      height: 40,
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.header.main,
      paddingHorizontal: 15,
      flexDirection: 'row',
    },
    headerIcon: {
      color: '#fff',
    },
    leftIconContainer: {
      marginBottom: -2,
      flexDirection: 'row',
      alignItems: 'center',
    },
    leftIconText: {
      color: colors.text.light,
      fontSize: 16,
    },
    expandedContent: {
      flexDirection: 'row',
      flex: 1,
    },
    scrollViewContainer: {
      padding: 5,
    },
    textInput: {
      color: colors.text.default,
      borderColor: colors.border,
      backgroundColor: colors.input,
      borderWidth: 1,
      flex: 2,
      borderRadius: 5,
      height: 40,
      paddingHorizontal: 20,
    },
    columnContainer: {
      padding: 5,
      flexDirection: 'column',
      width: '100%',
    },
    questionContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: colors.border,
      paddingBottom: 10,
      paddingTop: 10,
      gap: 10,
    },
    hidden: {
      display: 'none',
    },
    questionTitle: {
      flex: 1,
      color: colors.text.default,
      fontSize: 18,
      fontWeight: 'bold',
    },
    questionDescription: {
      flex: 1,
      color: colors.text.default,
      fontSize: 16,
    },
    errorText: {
      color: 'red',
      fontSize: 14,
      marginTop: 5,
    },
  });

export default ApvDetailScreen;
