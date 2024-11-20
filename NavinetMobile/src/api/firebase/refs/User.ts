import firestore from "@react-native-firebase/firestore";

export const userRef = firestore().collection('USERS');
