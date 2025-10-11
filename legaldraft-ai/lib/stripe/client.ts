import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    stripePriceId: '', // No Stripe price for free plan
    documentLimit: 3,
    features: [
      '3 documents per month',
      'Basic templates',
      'PDF export',
      'Watermarked documents',
    ],
  },
  pro: {
    name: 'Pro',
    price: 29,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
    documentLimit: null, // unlimited
    features: [
      'Unlimited documents',
      'All templates',
      'PDF & DOCX export',
      'No watermark',
      'Priority support',
    ],
  },
  firm: {
    name: 'Firm',
    price: 99,
    stripePriceId: process.env.STRIPE_FIRM_PRICE_ID || 'price_firm',
    documentLimit: null, // unlimited
    features: [
      'Unlimited documents',
      'All templates',
      'PDF & DOCX export',
      'No watermark',
      '5 team members',
      'Custom templates',
      'Priority support',
      'Dedicated account manager',
    ],
  },
};
