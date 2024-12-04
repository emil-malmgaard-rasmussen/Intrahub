import {addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query, Timestamp, where} from 'firebase/firestore';
import {db} from '../Firebase';
import {getNetworkId} from '../utils/LocalStorage';
import {EmployeeApvModel} from './models/EmployeeApvModel';
import {ProjectApvModel} from './models/ProjectApvModel';
import {Answer, ApvAnswer} from './models/ApvAnswerModel';
import {ApvActionPlan, ApvActions} from './models/ApvActionPlan';
import {getAuth} from 'firebase/auth';


export async function fetchApvs(): Promise<EmployeeApvModel[]> {
    const networkId = getNetworkId();

    try {
        const apvRef = collection(db, "APV");
        const apvQuery = query(apvRef, where("networkId", "==", networkId));

        const apvSnapshot = await getDocs(apvQuery);

        return apvSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
            } as EmployeeApvModel;
        }).filter(Boolean) as EmployeeApvModel[];
    } catch (error) {
        console.error("Error fetching APVs:", error);
        return [];
    }
}

export const fetchEmployeeApv = async (apvId: string): Promise<EmployeeApvModel | null> => {
    try {
        const apvRef = doc(db, "APV", apvId);
        const apvSnapshot = await getDoc(apvRef);

        if (apvSnapshot.exists()) {
            const data = apvSnapshot.data();
            return {
                id: apvSnapshot.id,
                ...data,
            } as EmployeeApvModel;
        } else {
            console.warn(`APV with ID ${apvId} not found.`);
            return null;
        }
    } catch (error) {
        console.error("Error fetching the APV:", error);
        return null;
    }
};

export const fetchApv = async (apvId: string): Promise<EmployeeApvModel | ProjectApvModel | null> => {
    try {
        const apvRef = doc(db, "APV", apvId);
        const apvSnapshot = await getDoc(apvRef);

        if (apvSnapshot.exists()) {
            const data = apvSnapshot.data();
            if (data.apvType === 'employeeType') {
                return {
                    id: apvSnapshot.id,
                    ...data,
                } as EmployeeApvModel;
            } else {
                return {
                    id: apvSnapshot.id,
                    ...data,
                } as ProjectApvModel;
            }
        } else {
            console.warn(`APV with ID ${apvId} not found.`);
            return null;
        }
    } catch (error) {
        console.error("Error fetching the APV:", error);
        return null;
    }
};

export const fetchApvEmployeeAnswersByEmployee = async (
    apvId: string,
    participantUid: string
): Promise<ApvAnswer | null> => {
    try {
        const answersQuery = query(
            collection(db, 'APV', apvId, 'answers'),
            where('createdByUid', '==', participantUid),
            orderBy('createdAt', 'desc'),
            limit(1)
        );

        const answersSnapshot = await getDocs(answersQuery);

        if (!answersSnapshot.empty) {
            const doc = answersSnapshot.docs[0];
            const data = doc.data();

            return {
                apvId,
                createdAt: data.createdAt as Timestamp,
                createdBy: data.createdBy as string,
                createdByUid: data.createdByUid as string,
                answers: data.answers as Answer[],
            };
        } else {
            console.log('No answers found for the given participant.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching APV answers:', error);
        throw error;
    }
};

export const fetchApvEmployeeAnswers = async (
    apvId: string,
): Promise<ApvAnswer[] | null> => {
    try {
        const answersQuery = query(
            collection(db, 'APV', apvId, 'answers'),
            orderBy('createdAt', 'desc')
        );

        const answersSnapshot = await getDocs(answersQuery);

        if (!answersSnapshot.empty) {
            const answers: ApvAnswer[] = answersSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    apvId,
                    createdAt: data.createdAt as Timestamp,
                    createdBy: data.createdBy as string,
                    createdByUid: data.createdByUid as string,
                    answers: data.answers as Answer[],
                };
            });

            return answers;
        } else {
            console.log('No answers found for the given participant.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching APV answers:', error);
        throw error;
    }
};

export async function fetchApvStatsForChart(apvId: string) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const lastYear = currentYear - 1;

    const thisYearData = Array(12).fill(0);
    const lastYearData = Array(12).fill(0);

    try {
        const answersQuery = query(collection(db, 'APV', apvId, 'answers'));
        const answersSnapshot = await getDocs(answersQuery);

        answersSnapshot.forEach((doc) => {
            const answer = doc.data();
            const createdAt = (answer.createdAt as Timestamp).toDate();

            const monthIndex = createdAt.getMonth();
            const year = createdAt.getFullYear();

            if (year === currentYear) {
                thisYearData[monthIndex]++;
            } else if (year === lastYear) {
                lastYearData[monthIndex]++;
            }
        });

        const categories = Array.from({length: 12}, (_, i) =>
            new Date(0, i)
                .toLocaleString('da-DK', {month: 'short'})
                .replace('.', '')
        ).reverse();

        const series = [
            {name: `${currentYear}`, data: thisYearData.reverse()},
            {name: `${lastYear}`, data: lastYearData.reverse()},
        ];

        return {categories, series};
    } catch (error) {
        console.error('Error fetching APV stats:', error);
        return {categories: [], series: []};
    }
}


/**
 * Save a new action plan under a specific APV.
 *
 * @param apvId - The ID of the APV to associate the action plan with.
 * @param actionPlanData - The data of the action plan to save.
 * @returns A promise resolving to the ID of the newly created action plan document.
 */

export const saveActionPlan = async (
    apvId: string,
    actionPlanData: ApvActions[]
): Promise<string> => {
    try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
            throw new Error("User not authenticated");
        }

        const actionPlan: ApvActionPlan = {
            apvId,
            createdByUid: currentUser.uid,
            createdAt: Timestamp.fromDate(new Date()),
            actions: actionPlanData.map((action: ApvActions) => ({
                issue: action.issue,
                action: action.action,
                responsible: action.responsible,
                deadline: action.deadline,
                status: action.status,
            })),
        };

        const actionPlansRef = collection(doc(db, "APV", apvId), "actionPlans");

        const docRef = await addDoc(actionPlansRef, {
            ...actionPlan,
        });

        return docRef.id;
    } catch (error) {
        console.error("Error saving action plan:", error);
        throw error;
    }
};


/**
 * Fetch the latest action plan for a specific APV without requiring a Firestore index.
 *
 * @param apvId - The ID of the APV to fetch the latest action plan for.
 * @returns A promise resolving to the latest ApvActionPlan or null if none exist.
 */
export const fetchLatestActionPlan = async (apvId: string): Promise<ApvActionPlan | null> => {
    try {
        const actionPlansRef = collection(doc(db, "APV", apvId), "actionPlans");

        const querySnapshot = await getDocs(actionPlansRef);

        if (querySnapshot.empty) {
            return null;
        }

        const actionPlans = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as unknown as ApvActionPlan[];

        return actionPlans.sort(
            (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
        )[0];
    } catch (error) {
        console.error("Error fetching the latest action plan:", error);
        throw error;
    }
};
