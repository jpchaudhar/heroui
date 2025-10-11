import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2024-06-20',
});

export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      '3 documents per month',
      'Basic templates',
      'PDF export',
      'Email support'
    ],
    limits: {
      documentsPerMonth: 3,
      teamMembers: 1,
      customTemplates: false,
      prioritySupport: false,
      removeWatermark: false
    }
  },
  pro: {
    name: 'Pro',
    price: 29,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      'Unlimited documents',
      'All templates',
      'PDF & DOCX export',
      'No watermarks',
      'Priority support'
    ],
    limits: {
      documentsPerMonth: -1, // unlimited
      teamMembers: 1,
      customTemplates: true,
      prioritySupport: true,
      removeWatermark: true
    }
  },
  firm: {
    name: 'Firm',
    price: 99,
    priceId: process.env.STRIPE_FIRM_PRICE_ID,
    features: [
      'Everything in Pro',
      '5 team members',
      'Custom templates',
      'Advanced analytics',
      'Dedicated support'
    ],
    limits: {
      documentsPerMonth: -1, // unlimited
      teamMembers: 5,
      customTemplates: true,
      prioritySupport: true,
      removeWatermark: true,
      analytics: true
    }
  }
};

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS;