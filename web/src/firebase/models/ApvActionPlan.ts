import {Timestamp} from 'firebase/firestore';

export interface ApvActionPlan {
    apvId: string;
    createdByUid: string;
    createdAt: Timestamp;
    actions: ApvActions[];
}

export interface ApvActions {
    issue: string;
    action: string;
    responsible: ApvActionResponsible;
    deadline: Timestamp;
    status: 'notStarted' | 'inProgress' | 'completed' | 'onHold';
}

export interface ApvActionResponsible {
    displayName: string;
    uid: string;
}
