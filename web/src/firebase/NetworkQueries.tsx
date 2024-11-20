import {addDoc, collection, Timestamp} from 'firebase/firestore';
import {db} from '../Firebase';

export type CreateNetworkModel = {
    address: string;
    administrators: string[];
    users: string[];
    city: string;
    contactEmail: string;
    contactPhone: string;
    description: string;
    logo: string;
    name: string;
    postalCode: string;
    createdAt: Timestamp;
};

export type NetworkModel = CreateNetworkModel & {
    id: string;
};

export const createNetworkRequest = async (groupData: CreateNetworkModel) => {
    try {
        await addDoc(collection(db, 'NETWORK_REQUESTS'), groupData);
    } catch (error) {
        console.error('Fejl ved oprettelse af gruppe:', error);
        throw new Error('Kunne ikke oprette gruppen. Prøv igen.');
    }
};
