import {collection, getDocs, query, where} from 'firebase/firestore';
import {db} from '../Firebase';
import {UserModel} from './models/UserModel';

export const fetchGroupUsers = async (
    networkId: string,
): Promise<UserModel[] | null> => {
    try {
        const usersRef = query(
            collection(db, 'USERS'),
        );

        const usersQuery = query(usersRef, where('networks', 'array-contains', networkId));
        const querySnapshot = await getDocs(usersQuery);

        if(!querySnapshot.empty) {
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                uid: doc.data().uid,
                displayName: doc.data().displayName,
                email: doc.data().email,
                networks: doc.data().networks,
                deviceToken: doc.data().deviceToken,
            }));
        } else {
            console.log('No users found for the given network.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching APV answers:', error);
        throw error;
    }
};
