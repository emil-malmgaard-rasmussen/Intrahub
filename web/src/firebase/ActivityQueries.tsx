import {getNetworkId} from '../utils/LocalStorage';
import {collection, deleteDoc, doc, getDocs, query, updateDoc, where} from 'firebase/firestore';
import {db} from '../Firebase';
import {ActivityModel} from './models/ActivityModel';

/**
 * Fetches all activities associated with the current network ID.
 * @returns A promise that resolves to an array of ActivityModel objects.
 */
export async function fetchActivities(): Promise<ActivityModel[]> {
    const networkId = getNetworkId();

    if (!networkId) {
        console.error("No network ID found. Unable to fetch activities.");
        return [];
    }

    try {
        const ref = collection(db, "ACTIVITIES");
        const refQuery = query(ref, where("networkId", "==", networkId));
        const refSnapshot = await getDocs(refQuery);

        const activities: ActivityModel[] = refSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        } as ActivityModel));

        console.log(`${activities.length} activities fetched successfully.`);
        return activities;
    } catch (error) {
        console.error("Error fetching activities:", error);
        throw new Error("Failed to fetch activities.");
    }
}


/**
 * Edits an activity document in the Firestore database.
 * @param activityId - The ID of the activity to edit.
 * @param updatedData - Partial data to update the activity with.
 * @returns A promise that resolves when the update is complete.
 */
export async function editActivity(activityId: string, updatedData: Partial<ActivityModel>): Promise<void> {
    try {
        const docRef = doc(db, "ACTIVITIES", activityId);
        await updateDoc(docRef, updatedData);
        console.log(`Activity ${activityId} updated successfully.`);
    } catch (error) {
        console.error(`Error updating activity ${activityId}:`, error);
        throw new Error("Failed to update activity.");
    }
}

/**
 * Deletes an activity document from the Firestore database.
 * @param activityId - The ID of the activity to delete.
 * @returns A promise that resolves when the deletion is complete.
 */
export async function deleteActivity(activityId: string): Promise<void> {
    try {
        const docRef = doc(db, "ACTIVITIES", activityId);
        await deleteDoc(docRef);
        console.log(`Activity ${activityId} deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting activity ${activityId}:`, error);
        throw new Error("Failed to delete activity.");
    }
}
