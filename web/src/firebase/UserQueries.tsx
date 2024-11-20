import {doc, getDoc} from 'firebase/firestore';
import {db} from '../Firebase';

export async function fetchUserById(userId: string) {
    try {
        const userRef = doc(db, 'USERS', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            return {
                id: userDoc.id,
                ...userDoc.data(),
            };
        }

        console.log("User not found");
        return null;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
    }
}
