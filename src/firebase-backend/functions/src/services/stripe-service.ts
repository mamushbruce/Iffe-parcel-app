/**
 * @fileoverview Service for initializing and configuring the Stripe client.
 */

import * as functions from 'firebase-functions';
import { Stripe } from 'stripe';

// Get API keys from Firebase config
const stripeApiKey = functions.config().stripe.secret_key;
export const stripeWebhookSecret = functions.config().stripe.webhook_secret;

if (!stripeApiKey || !stripeWebhookSecret) {
    throw new Error('Stripe API keys are not configured in Firebase Functions config.');
}

export const stripe = new Stripe(stripeApiKey, {
    apiVersion: '2024-06-20',
});
