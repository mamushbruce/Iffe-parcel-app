/**
 * @fileoverview Defines the data model for a Payment in Firestore.
 */

import type { FieldValue } from 'firebase-admin/firestore';
 
export interface Payment {
  paymentID: string; // Stripe Payment Intent ID
  bookingID: string;
  userID: string;
  amount: number; // in cents
  currency: string;
  method: 'card' | 'apple_pay' | 'google_pay' | 'mobile_money' | string;
  status: 'succeeded' | 'processing' | 'failed';
  timestamp: FieldValue;
}
