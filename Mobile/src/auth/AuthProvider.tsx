import React, {createContext, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';

export type AuthContextType = {
  user: any;
  setUser: any;
  login: any;
  logout: any;
  register: any;
};
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children}: any) => {
  const [user, setUser] = useState(null);
  const userRef = firestore().collection('USERS');

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email: string, password: string) => {
          try {
            await auth()
              .signInWithEmailAndPassword(email, password)
              .catch(error => {
                switch (error.code) {
                  case 'auth/too-many-requests':
                    Alert.alert(
                      'Ups!',
                      'Ikke flere forsøg. Prøv igen om 5 min.',
                    );
                    break;
                  case 'auth/wrong-password':
                    Alert.alert(
                      'Ups!',
                      'E-mail og password matchede ikke. Prøv igen.',
                    );
                    break;
                  case 'auth/invalid-email':
                    Alert.alert(
                      'Ups!',
                      'E-mail og password matchede ikke. Prøv igen.',
                    );
                    break;
                  case 'auth/user-not-found':
                    Alert.alert(
                      'Ups!',
                      'E-mail og password matchede ikke. Prøv igen.',
                    );
                    break;
                  default:
                    Alert.alert('Ups!', 'Der skete en fejl.');
                }
              });
          } catch (e) {
            console.log(e);
          }
        },
        logout: async () => {
          console.log("called")
          try {
            // const userStorage = await AsyncStorage.getItem('user');
            //
            // if (userStorage) {
            //   await AsyncStorage.clear();
            // }
            await auth().signOut();
          } catch (e) {
            console.error(e);
          }
        },
        register: async (user: any) => {
          try {
            await auth().createUserWithEmailAndPassword(
              user.email!,
              user.password!,
            );

            const newUser = auth().currentUser;

            if (newUser) {
              await newUser.updateProfile({
                displayName: user.name,
              });
            }

            const updatedUser = {
              displayName: user.name,
              uid: newUser?.uid,
              email: newUser?.email,
              type: 'User',
              deviceToken: '', // await getDeviceToken(),
            };

            // Ensure user data is valid
            if (updatedUser.uid && updatedUser.email) {
              // Create Firestore user record
              await userRef.doc(newUser?.uid).set(updatedUser);
            } else {
              throw new Error('User data is invalid');
            }
          } catch (error) {
            console.error('Error during registration:', error);

            // Handle specific Firebase Authentication errors
            switch (error.code) {
              case 'auth/too-many-requests':
                Alert.alert('Ups!', 'Ikke flere forsøg. Prøv igen om 5 min.');
                break;
              case 'auth/invalid-email':
                Alert.alert('Ups!', 'E-mailen er ikke formateret korrekt.');
                break;
              case 'auth/email-already-in-use':
                Alert.alert('Ups!', 'Denne e-mail er allerede brugt.');
                break;
              case 'auth/weak-password':
                Alert.alert('Ups!', 'Adgangskoden er for svag.');
                break;
              default:
                return;
            }
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
