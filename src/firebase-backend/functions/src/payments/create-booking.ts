/**
 * @fileoverview Callable Cloud Function to create a booking and a Stripe Payment Intent.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { stripe } from '../services/stripe-service';
import { Booking } from '../models/booking.model';

const db = admin.firestore();

export const createBooking = functions.https.onCall(async (data, context) => {
  // 1. Check for authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to make a booking.');
  }

  const { destination, package: pkg, travelDates, groupSize } = data;
  const userID = context.auth.uid;

  // 2. Validate input data (basic)
  if (!destination || !pkg || !travelDates || !groupSize) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing booking information.');
  }
  
  // TODO: Fetch package price from Firestore to calculate amount
  const amount = 10000; // Example amount in cents ($100.00)
  const currency = 'usd';

  try {
    // 3. Create a preliminary booking document in Firestore
    const bookingRef = db.collection('bookings').doc();
    const newBooking: Booking = {
      bookingID: bookingRef.id,
      userID,
      destination,
      package: pkg,
      travelDates: new Date(travelDates),
      groupSize,
      paymentStatus: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await bookingRef.set(newBooking);
    
    // 4. Create a Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { 
        bookingID: bookingRef.id,
        userID,
      },
    });

    functions.logger.info(`Created Payment Intent for booking ${bookingRef.id}`);

    // 5. Return the client_secret to the client to confirm payment
    return { 
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret 
    };

  } catch (error) {
    functions.logger.error('Error creating booking:', error);
    throw new functions.https.HttpsError('internal', 'Could not create booking.');
  }
});
