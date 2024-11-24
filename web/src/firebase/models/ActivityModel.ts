import { Timestamp } from "firebase/firestore";

export interface CreateActivityModel {
    title: string;
    createdAt: Timestamp;
    createdBy: string;
    createdByUid: string;
    networkId: string;
    description: string;
    dateFrom: Timestamp;
    dateTo: Timestamp;
    id: string;
}

export interface ActivityModel extends CreateActivityModel {
    id: string
}
