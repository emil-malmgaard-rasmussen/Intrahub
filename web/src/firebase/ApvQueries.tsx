import {collection, doc, getDoc, getDocs, query, Timestamp, where} from 'firebase/firestore';
import {db} from '../Firebase';
import LocalStorage from '../utils/LocalStorage';
import { EmployeeApvModel } from './models/EmployeeApvModel';


export async function fetchApvs(): Promise<EmployeeApvModel[]> {
    const networkId = LocalStorage.getNetworkId();

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
        console.log(apvId)
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
