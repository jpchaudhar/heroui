import { Router } from 'express';
import Stripe from 'stripe';

export const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

router.post('/checkout', async (req, res) => {
  const { priceId, customerEmail } = req.body ?? {};
  if (!priceId) return res.status(400).json({ error: 'Missing priceId' });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: process.env.CHECKOUT_SUCCESS_URL || 'http://localhost:3001/billing?success=1',
      cancel_url: process.env.CHECKOUT_CANCEL_URL || 'http://localhost:3001/billing?canceled=1',
      customer_email: customerEmail,
    });
    res.json({ url: session.url });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/portal', async (_req, res) => {
  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: (process.env.STRIPE_CUSTOMER_ID as string) || '',
      return_url: process.env.BILLING_RETURN_URL || 'http://localhost:3001/billing',
    });
    res.json({ url: portalSession.url });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});
