export type Participant = {
    displayName: string;
    uid: string;
};

export type Question = {
    description: string;
    title: string;
    type: string;
};

export type EmployeeApvModel = {
    id: string;
    apvType: 'employeeApv' | 'projectApv';
    createdBy: string;
    name: string;
    networkId: string;
    participants: Participant[];
    questions: Question[];
};
