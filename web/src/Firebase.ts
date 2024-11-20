import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAD5rx1gT8FlDEOCTyAC6870TIbEb-nWQI",
    authDomain: "navinet-1da50.firebaseapp.com",
    projectId: "navinet-1da50",
    storageBucket: "navinet-1da50.appspot.com",
    messagingSenderId: "1043445818803",
    appId: "1:1043445818803:web:d5204851b43ca68ded97c6",
    measurementId: "G-YFY467FBY0"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth: Auth = getAuth(app);

const storage = getStorage(app);

export { auth, storage, db};
