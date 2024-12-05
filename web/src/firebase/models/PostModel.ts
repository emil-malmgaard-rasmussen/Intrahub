import {Timestamp} from 'firebase/firestore';

export interface PostModel {
    bio: string;
    uid: string;
    title: string;
    text: string;
    networkId: string;
    imageUrl: string;
    createdAt: Timestamp;
}

export interface FetchedPostModel extends PostModel {
    id: string;
}
