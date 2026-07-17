import Stripe from "stripe";

/**
 * Stripe is optional -- with no keys in .env.local, checkout falls back
 * to Cash on Delivery only (see app/checkout). Add real test keys from
 * https://dashboard.stripe.com/test/apikeys to enable it.
 */
export const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export const isStripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
