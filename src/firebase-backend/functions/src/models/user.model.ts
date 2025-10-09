/**
 * @fileoverview Defines the data model for a User profile in Firestore.
 */

import type { FieldValue } from 'firebase-admin/firestore';

export interface UserProfile {
  userID: string;
  name: string;
  email: string;
  phone: string;
  photoURL: string;
  role: 'admin' | 'registered_user' | 'guest';
  bookingHistory: string[]; // Array of bookingIDs
  createdAt: FieldValue;
  fcmToken?: string; // For push notifications
  notificationsOptIn?: boolean;
}
