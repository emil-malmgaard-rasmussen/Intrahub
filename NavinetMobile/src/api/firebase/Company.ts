import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';

export const createCompanyFirebase = async (company: any, userUid: string) => {
  const companiesRef = firestore().collection('COMPANIES');
  const userRef = firestore().collection('USERS');

  try {
    const newOrganizationRef = await companiesRef.add({
      ...company,
      createdBy: userUid,
    });

    await userRef.doc(userUid).update({
      organizations: firebase.firestore.FieldValue.arrayUnion(
        newOrganizationRef.id,
      ),
    });

    await newOrganizationRef.update({
      members: firebase.firestore.FieldValue.arrayUnion(userUid),
    });
  } catch (e) {}
};
