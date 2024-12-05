import {deleteDoc, doc, getDoc, updateDoc} from 'firebase/firestore';
import {db, storage} from '../Firebase';
import {PostModel} from './models/PostModel';
import {deleteObject, ref} from 'firebase/storage';

/**
 * Fetch a specific post.
 *
 * @param postId - The id of the post to fetch.
 * @returns A promise resolving the post or null if none exist.
 */
export const fetchPost = async (postId: string): Promise<PostModel | undefined> => {
    try {
        const postRef = doc(db, "POSTS", postId);

        const querySnapshot = await getDoc(postRef);

        if (querySnapshot.exists()) {
            return querySnapshot.data() as PostModel;
        } else {
            window.alert(`Post med id ${postId} ikke fundet. Kontakt support`);
            return undefined;
        }
    } catch (error) {
        console.error("Error fetching the latest action plan:", error);
        throw error;
    }
};

/**
 * Update a specific post.
 *
 * @param post - the post to update
 * @param postId - The id of the post to update.
 * @returns null
 */
export const updatePost = async (post: PostModel, postId: string) => {
    const postRef = doc(db, 'POSTS', postId);
    const {...postData} = post;
    await updateDoc(postRef, postData);
};

export const deletePost = async (postId: string, imageUrl: string | undefined) => {
    try {
        if (imageUrl) {
            const networkId = imageUrl.split('posts%2F')[1]?.split('%2')[0];
            const imageId = imageUrl.split('posts%2F')[1]?.split('?alt')[0].replace(`${networkId}%2F`, '');
            const imageRef = ref(storage, `posts/${networkId}/${imageId}`);
            await deleteObject(imageRef);
        }

        const postRef = doc(db, 'POSTS', postId);
        await deleteDoc(postRef);
    } catch (error) {
        console.error('Error deleting post or image:', error);
    }
};
