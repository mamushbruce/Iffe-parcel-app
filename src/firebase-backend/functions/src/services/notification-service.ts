/**
 * @fileoverview Service for sending push notifications via FCM.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

interface PushNotificationParams {
    token: string;
    title: string;
    body: string;
    data?: { [key: string]: string };
}

/**
 * Sends a push notification to a single device.
 * @param {PushNotificationParams} params - The notification parameters.
 */
export async function sendPushNotification(params: PushNotificationParams): Promise<void> {
    const { token, title, body, data } = params;

    const message = {
        token,
        notification: {
            title,
            body,
        },
        data: data || {},
    };

    try {
        await admin.messaging().send(message);
        functions.logger.info(`Successfully sent push notification to token: ${token}`);
    } catch (error) {
        functions.logger.error(`Error sending push notification to token: ${token}`, error);
    }
}
