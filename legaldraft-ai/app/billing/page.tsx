'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FiCheck, FiCreditCard } from 'react-icons/fi';
import { SUBSCRIPTION_PLANS } from '@/lib/stripe/client';

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: string) => {
    setLoading(plan);
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        alert('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create checkout session');
    } finally {
      setLoading(null);
    }
  };

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to open billing portal');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Billing & Subscription</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your subscription and billing information
          </p>
        </div>

        {/* Current Plan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Current Plan</h2>
              <Button variant="outline" onClick={handleManageBilling}>
                <FiCreditCard className="w-5 h-5 mr-2" />
                Manage Billing
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">Free Plan</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  3 documents per month
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Pricing Plans */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Upgrade Your Plan
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <Card>
              <CardBody className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {SUBSCRIPTION_PLANS.free.name}
                </h3>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  ${SUBSCRIPTION_PLANS.free.price}
                  <span className="text-lg text-gray-600 dark:text-gray-400">/month</span>
                </p>
                <ul className="space-y-3 mb-8">
                  {SUBSCRIPTION_PLANS.free.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600 dark:text-gray-400">
                      <FiCheck className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full" disabled>
                  Current Plan
                </Button>
              </CardBody>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-blue-600">
              <CardBody className="p-6">
                <div className="bg-blue-600 text-white px-3 py-1 text-sm font-medium rounded-lg inline-block mb-4">
                  Most Popular
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {SUBSCRIPTION_PLANS.pro.name}
                </h3>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  ${SUBSCRIPTION_PLANS.pro.price}
                  <span className="text-lg text-gray-600 dark:text-gray-400">/month</span>
                </p>
                <ul className="space-y-3 mb-8">
                  {SUBSCRIPTION_PLANS.pro.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600 dark:text-gray-400">
                      <FiCheck className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  onClick={() => handleSubscribe('pro')}
                  disabled={loading === 'pro'}
                >
                  {loading === 'pro' ? 'Processing...' : 'Upgrade to Pro'}
                </Button>
              </CardBody>
            </Card>

            {/* Firm Plan */}
            <Card>
              <CardBody className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {SUBSCRIPTION_PLANS.firm.name}
                </h3>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  ${SUBSCRIPTION_PLANS.firm.price}
                  <span className="text-lg text-gray-600 dark:text-gray-400">/month</span>
                </p>
                <ul className="space-y-3 mb-8">
                  {SUBSCRIPTION_PLANS.firm.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600 dark:text-gray-400">
                      <FiCheck className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSubscribe('firm')}
                  disabled={loading === 'firm'}
                >
                  {loading === 'firm' ? 'Processing...' : 'Upgrade to Firm'}
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
