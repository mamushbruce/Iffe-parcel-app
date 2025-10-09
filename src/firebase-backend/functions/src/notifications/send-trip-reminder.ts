/**
 * @fileoverview Scheduled Cloud Function to send trip reminders.
 * Runs daily to check for trips starting in 3 days.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { sendEmail } from '../services/mailing-service';
import { sendPushNotification } from '../services/notification-service';

const db = admin.firestore();

export const sendTripReminder = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  functions.logger.info('Running daily trip reminder check.');

  const now = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(now.getDate() + 3);

  // Query for bookings starting in 3 days with 'successful' payment
  const query = db.collection('bookings')
    .where('paymentStatus', '==', 'successful')
    .where('travelDates', '>=', now)
    .where('travelDates', '<=', threeDaysFromNow);

  const snapshot = await query.get();

  if (snapshot.empty) {
    functions.logger.info('No upcoming trips to send reminders for.');
    return null;
  }

  const reminderPromises: Promise<any>[] = [];

  snapshot.forEach(doc => {
    const booking = doc.data();
    const userID = booking.userID;

    // TODO: Fetch user email and FCM token
    const userEmail = 'user@example.com'; // Placeholder
    const fcmToken = 'user-fcm-token'; // Placeholder
    
    // Send email reminder
    reminderPromises.push(sendEmail({
      to: userEmail,
      templateId: 'TRIP_REMINDER',
      templateData: {
        destination: booking.destination,
        travelDate: booking.travelDates.toDate().toLocaleDateString(),
      }
    }));
    
    // Send push notification
    reminderPromises.push(sendPushNotification({
      token: fcmToken,
      title: 'Your Trip is Almost Here!',
      body: `Your adventure to ${booking.destination} starts in 3 days.`
    }));
  });

  await Promise.all(reminderPromises);
  functions.logger.info(`Sent ${snapshot.size} trip reminders.`);
  return null;
});
