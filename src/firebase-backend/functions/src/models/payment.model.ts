/**
 * @fileoverview Defines the data model for a Payment in Firestore.
 */

import type { FieldValue } from 'firebase-admin/firestore';
 
export interface Payment {
  paymentID: string; // Can be Stripe Payment Intent ID
  bookingID: string;
  userID: string;
  amount: number; // in cents
  currency: string;
  method: 'Visa' | 'Mastercard' | 'Apple Pay' | 'Google Pay' | 'Mobile Money' | string;
  status: 'succeeded' | 'processing' | 'failed';
  timestamp: FieldValue;
  invoiceURL?: string;
}
