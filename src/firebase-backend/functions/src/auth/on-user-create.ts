/**
 * @fileoverview Cloud Function to handle new user creation.
 * - Creates a user profile in Firestore.
 * - Sends a welcome email.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { sendEmail } from '../services/mailing-service';
import { UserProfile } from '../models/user.model';

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL, phoneNumber } = user;

  const newUserProfile: UserProfile = {
    userID: uid,
    name: displayName || 'New User',
    email: email || '',
    phone: phoneNumber || '',
    photoURL: photoURL || '',
    role: 'guest', // Default role
    bookingHistory: [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  try {
    // 1. Create user profile in Firestore
    await db.collection('users').doc(uid).set(newUserProfile);
    functions.logger.info(`Created user profile for UID: ${uid}`);

    // 2. Send a welcome email (if email is available)
    if (email) {
      await sendEmail({
        to: email,
        templateId: 'WELCOME_EMAIL', // ID of the welcome email template in Firestore
        templateData: {
          name: displayName || 'there',
        },
      });
      functions.logger.info(`Sent welcome email to ${email}`);
    }

  } catch (error) {
    functions.logger.error(`Error in onUserCreate for UID: ${uid}`, error);
  }
});
