import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {
    browserLocalPersistence,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    setPersistence,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User
} from 'firebase/auth';
import {auth, db} from '../../Firebase';
import {doc, setDoc} from 'firebase/firestore';

interface AuthContextType {
    user: User | null;
    register: (email: string, password: string, name: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        setPersistence(auth, browserLocalPersistence)
            .catch(error => console.error("Error setting persistence:", error));

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const register = async (email: string, password: string, name: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            const newUser = userCredential.user;

            await updateProfile(newUser, {displayName: name});

            const updatedUser = {
                displayName: name,
                uid: newUser.uid,
                email: newUser.email,
                type: 'User',
                deviceToken: '',
            };

            const userRef = doc(db, 'USERS', newUser.uid);
            await setDoc(userRef, updatedUser);

            setUser(newUser);
        } catch (error) {
            console.error('Error during registration:', error);

            if (typeof error === 'object' && error !== null && 'code' in error) {
                const errorCode = (error as { code: string }).code;

                switch (errorCode) {
                    case 'auth/too-many-requests':
                        window.alert('Ups! Ikke flere forsøg. Prøv igen om 5 min');
                        break;
                    case 'auth/invalid-email':
                        window.alert('Ups! E-mailen er ikke formateret korrekt.');
                        break;
                    case 'auth/email-already-in-use':
                        window.alert('Ups! Denne e-mail er allerede brugt.');
                        break;
                    case 'auth/weak-password':
                        window.alert('Ups! Adgangskoden er for svag.');
                        break;
                    default:
                        return;
                }
            } else {
                window.alert('Ups! Noget gik galt. Prøv igen senere.');
            }
        }
    };

    const login = async (email: string, password: string) => {
        await setPersistence(auth, browserLocalPersistence);  // Ensure persistence is set for login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user);
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, register, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for accessing AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
