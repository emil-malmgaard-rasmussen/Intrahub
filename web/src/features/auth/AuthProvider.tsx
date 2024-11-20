import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {
    browserLocalPersistence,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    setPersistence,
    signInWithEmailAndPassword,
    signOut,
    User
} from 'firebase/auth';
import {auth} from '../../Firebase';

interface AuthContextType {
    user: User | null;
    register: (email: string, password: string) => Promise<void>;
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

    const register = async (email: string, password: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user);
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
