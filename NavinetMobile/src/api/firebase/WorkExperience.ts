import firestore from "@react-native-firebase/firestore";
import {firebase} from "@react-native-firebase/auth";
import {ICreateUerExperienceDto} from "../interfaces/UserDto";

export const createWorkExperienceFirebase = async (workExperience: ICreateUerExperienceDto[], uid: string) => {
    const workExpRef = firestore().collection('WORKEXPERIENCE');

    const firebaseWorkExperience: any[] = [];
    workExperience.map((experience) => {
        firebaseWorkExperience.push({
            companyName: experience.companyName,
            description: experience.description,
            title: experience.title,
            startDate: experience.time.start,
            endDate: experience.time.end,
        });
    })

    try {
        await workExpRef.doc().set({companyName: "navn!", description: "Tester lige", title: "Tester", startDate: new Date(), endDate: new Date(), uid: uid});
    } catch (e) {
    }
}
