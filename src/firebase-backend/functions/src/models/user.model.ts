/**
 * @fileoverview Defines the data model for a User profile in Firestore.
 */

import type { FieldValue } from 'firebase-admin/firestore';

interface Device {
  type: 'mobile' | 'desktop' | 'tablet';
  lastLogin: FieldValue | Date | string;
}

export interface UserProfile {
  userID: string;
  name: string;
  email: string;
  phone?: string;
  photoURL?: string;
  role: 'admin' | 'user' | 'guest';
  devices?: { [deviceID: string]: Device };
  bookingHistory?: string[]; // Array of bookingIDs
  createdAt: FieldValue;
  fcmToken?: string; // For push notifications
  notificationsOptIn?: boolean;
}
