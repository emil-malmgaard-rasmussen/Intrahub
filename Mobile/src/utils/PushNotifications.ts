import axios from "axios";
import messaging from "@react-native-firebase/messaging";

const SERVER_KEY = 'AAAAf7tSmXw:APA91bF0DYPJEPr-0AP4SL699iijpzeGQxjgN62hCZ1DOj6ofR0kiKs9TmdGX-AmFZUq1fDHBwt6jW-WyydHCI-ZlvvfEEDNgVGn26XJUKaVbT4jBCpNw4e5mcLb1vHFCreFueZ0bN2Z';

export const sendPushNotification = async (deviceToken, companyName) => {
    const notification = {
        title: 'JobOp Notifikation',
        body: `Ny ansøgning i ${companyName}`,
    };

    const payload = {
        to: deviceToken,
        notification,
    };

    try {
        const response = await axios.post('https://fcm.googleapis.com/fcm/send', payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SERVER_KEY}`,
            },
        });
    } catch (error) {
        console.error('Error sending push notification:', error);
    }
};

export const sendPushNotificationMessage = async (deviceToken, displayName) => {
    const notification = {
        title: 'JobOp Notifikation',
        body: `Ny besked fra ${displayName}`,
    };

    const payload = {
        to: deviceToken,
        notification,
    };

    try {
        await axios.post('https://fcm.googleapis.com/fcm/send', payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SERVER_KEY}`,
            },
        });
    } catch (error) {
        console.error('Error sending push notification:', error);
    }
}

export const getDeviceToken = async () => {
    try {
        return await messaging().getToken();
    } catch (error) {
        console.error('Error getting device token:', error);
    }
};

