/**
 * @fileoverview Defines the data model for a Booking in Firestore.
 */

import type { FieldValue } from 'firebase-admin/firestore';

export interface Booking {
  bookingID: string;
  userID: string;
  destination: string;
  package: string;
  travelDates: {
    start: FieldValue | Date | string;
    end: FieldValue | Date | string;
  };
  groupSize: number;
  paymentStatus: 'pending' | 'successful' | 'failed' | 'refunded';
  createdAt: FieldValue;
  updatedAt: FieldValue;
}
