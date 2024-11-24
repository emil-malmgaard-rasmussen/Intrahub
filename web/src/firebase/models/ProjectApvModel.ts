import {Timestamp} from 'firebase/firestore';

export type EvaluationModel = {
    title: string;
    description: string;
}

export type HealthSafetyModel = {
    title: string;
    description: string;
}

export type RiskModel = {
    name: string;
    description: string;
    assessment: string;
    preventiveMeasures: string;
}

export type ProjectApvModel = {
    id: string;
    networkId: string;
    createdBy: string;
    project: { name: string; id: string };
    startDate: Timestamp;
    risks: RiskModel[];
    healthSafety: HealthSafetyModel[];
    evaluation: EvaluationModel[];
    conclusion: string;
    apvType: 'employeeApv' | 'projectApv';
};
