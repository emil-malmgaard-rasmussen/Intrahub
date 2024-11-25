import {deleteDoc, doc} from 'firebase/firestore';
import {db} from '../Firebase';

/**
 * Deletes an project document from the Firestore database.
 * @param projectId - The ID of the project to delete.
 * @returns A promise that resolves when the deletion is complete.
 */
export async function deleteProject(projectId: string): Promise<void> {
    try {
        const docRef = doc(db, "PROJECTS", projectId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error(`Error deleting activity ${projectId}:`, error);
        throw new Error("Failed to delete activity.");
    }
}
