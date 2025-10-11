import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe, SUBSCRIPTION_PLANS } from '@/lib/stripe/client';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan } = await request.json();
    
    if (!['pro', 'firm'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const planConfig = SUBSCRIPTION_PLANS[plan as 'pro' | 'firm'];

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: planConfig.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
      client_reference_id: userId,
      metadata: {
        userId,
        plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
