'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Check, CreditCard, Download, Users } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Perfect for individuals getting started',
    features: [
      '3 documents per month',
      'Basic templates',
      'PDF export',
      'Email support'
    ],
    current: true,
    buttonText: 'Current Plan',
    buttonDisabled: true
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    description: 'Best for professionals and small businesses',
    features: [
      'Unlimited documents',
      'All templates',
      'PDF & DOCX export',
      'No watermarks',
      'Priority support'
    ],
    current: false,
    buttonText: 'Upgrade to Pro',
    buttonDisabled: false,
    popular: true
  },
  {
    id: 'firm',
    name: 'Firm',
    price: 99,
    description: 'For law firms and larger organizations',
    features: [
      'Everything in Pro',
      '5 team members',
      'Custom templates',
      'Advanced analytics',
      'Dedicated support'
    ],
    current: false,
    buttonText: 'Upgrade to Firm',
    buttonDisabled: false
  }
];

const usageStats = {
  documentsThisMonth: 8,
  documentsLimit: 10,
  teamMembers: 1,
  teamMembersLimit: 1
};

export default function BillingPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free') return;

    setIsLoading(planId);
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: planId,
        }),
      });

      const { sessionId } = await response.json();
      
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Stripe checkout error:', error);
        }
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Usage */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Current Usage</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Download className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">Documents This Month</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {usageStats.documentsThisMonth}
                    <span className="text-sm font-normal text-gray-500">
                      /{usageStats.documentsLimit === -1 ? '∞' : usageStats.documentsLimit}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ 
                      width: usageStats.documentsLimit === -1 
                        ? '0%' 
                        : `${Math.min((usageStats.documentsThisMonth / usageStats.documentsLimit) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">Team Members</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {usageStats.teamMembers}
                    <span className="text-sm font-normal text-gray-500">
                      /{usageStats.teamMembersLimit}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Subscription Plans</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-lg border p-6 ${
                  plan.popular
                    ? 'border-blue-500 ring-2 ring-blue-500'
                    : plan.current
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 text-xs font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                {plan.current && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-3 py-1 text-xs font-medium rounded-full">
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-base font-medium text-gray-500">/month</span>
                  </div>
                  <p className="mt-4 text-sm text-gray-500">{plan.description}</p>
                </div>

                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="ml-3 text-sm text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={plan.buttonDisabled || isLoading === plan.id}
                    className={`w-full flex justify-center items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      plan.current
                        ? 'border-green-300 text-green-700 bg-green-100 cursor-not-allowed'
                        : plan.popular
                        ? 'border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500'
                    } ${isLoading === plan.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoading === plan.id ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      plan.buttonText
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Billing History</h2>
          <div className="text-sm text-gray-500">
            No billing history available. Upgrade to a paid plan to see your invoices here.
          </div>
        </div>
      </div>
    </div>
  );
}