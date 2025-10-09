/**
 * @fileoverview Cloud Function webhook to handle payment events from Stripe.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { stripe, stripeWebhookSecret } from '../services/stripe-service';
import type { Stripe } from 'stripe';

const db = admin.firestore();

export const onPaymentWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  if (!sig) {
    res.status(400).send('Webhook Error: Missing stripe-signature header');
    return;
  }
  
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, stripeWebhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    functions.logger.error('Webhook signature verification failed.', errorMessage);
    res.status(400).send(`Webhook Error: ${errorMessage}`);
    return;
  }

  // Handle the 'payment_intent.succeeded' event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const { bookingID, userID } = paymentIntent.metadata;

    functions.logger.info(`Payment succeeded for bookingID: ${bookingID}`);

    try {
      // 1. Update Firestore booking status
      const bookingRef = db.collection('bookings').doc(bookingID);
      await bookingRef.update({ paymentStatus: 'successful', updatedAt: admin.firestore.FieldValue.serverTimestamp() });

      // 2. Create payment record in Firestore
      await db.collection('payments').add({
        paymentID: paymentIntent.id,
        bookingID,
        userID,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        method: paymentIntent.payment_method_types[0],
        status: 'succeeded',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
      
      // 3. Trigger invoice generation and confirmation email (e.g., via another function or Pub/Sub)
      // For simplicity, we can call it directly here.
      // await generateInvoiceAndSendEmail(bookingID);

    } catch (error) {
      functions.logger.error(`Error handling successful payment for booking ${bookingID}`, error);
      res.status(500).send('Internal server error.');
      return;
    }
  }

  res.status(200).json({ received: true });
});
