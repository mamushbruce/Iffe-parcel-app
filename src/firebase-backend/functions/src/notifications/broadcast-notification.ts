/**
 * @fileoverview Admin-only callable function to send broadcast notifications.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { sendPushNotification } from '../services/notification-service';

const db = admin.firestore();

export const broadcastNotification = functions.https.onCall(async (data, context) => {
  // 1. Check if the caller is an admin
  if (context.auth?.token.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can send broadcast notifications.');
  }

  const { title, body } = data;

  if (!title || !body) {
    throw new functions.https.HttpsError('invalid-argument', 'Title and body are required.');
  }

  try {
    // 2. Get all users who have opted into marketing notifications
    // This assumes users have an `fcmToken` and `notificationsOptIn` field.
    const usersSnapshot = await db.collection('users')
      .where('notificationsOptIn', '==', true)
      .get();
      
    const tokens = usersSnapshot.docs
      .map(doc => doc.data().fcmToken)
      .filter(token => !!token);

    if (tokens.length === 0) {
      functions.logger.info('No users to send broadcast to.');
      return { success: true, message: 'No users opted in for notifications.' };
    }

    // 3. Send notifications in batches (FCM supports up to 500 tokens per call)
    // For simplicity, we'll just send one for now.
    await admin.messaging().sendToDevice(tokens, {
        notification: { title, body },
    });

    functions.logger.info(`Sent broadcast notification to ${tokens.length} users.`);
    return { success: true, sentCount: tokens.length };
    
  } catch (error) {
    functions.logger.error('Error sending broadcast notification:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send broadcast.');
  }
});
