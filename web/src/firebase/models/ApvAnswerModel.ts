import { Timestamp } from "firebase/firestore";

export interface ApvAnswer {
    apvId: string;
    createdAt: Timestamp;
    createdBy: string;
    createdByUid: string;
    answers: Answer[];
}

export interface Answer {
    answer: boolean;
    description: string;
    title: string;
    comment: string;
}
