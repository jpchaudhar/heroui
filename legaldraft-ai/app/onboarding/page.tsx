'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { FiCheck, FiArrowRight } from 'react-icons/fi';

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [selectedUseCase, setSelectedUseCase] = useState('');

  const useCases = [
    { id: 'business', label: 'Business Contracts', description: 'NDAs, service agreements, etc.' },
    { id: 'employment', label: 'Employment Documents', description: 'Offer letters, agreements' },
    { id: 'property', label: 'Property Leases', description: 'Residential and commercial' },
    { id: 'litigation', label: 'Legal Proceedings', description: 'Court documents and filings' },
  ];

  const handleComplete = () => {
    // Save onboarding completion
    localStorage.setItem('onboarding_completed', 'true');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= num
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  {step > num ? <FiCheck /> : num}
                </div>
                {num < 3 && (
                  <div
                    className={`w-20 h-1 ${
                      step > num ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardBody className="p-8">
            {step === 1 && (
              <div className="text-center space-y-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome to LegalDraft AI! 👋
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Hi {user?.firstName}! Let&apos;s get you set up in just a few steps.
                </p>
                <Button size="lg" onClick={() => setStep(2)}>
                  Get Started
                  <FiArrowRight className="ml-2" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    What will you use LegalDraft AI for?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    This helps us customize your experience
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {useCases.map((useCase) => (
                    <button
                      key={useCase.id}
                      onClick={() => setSelectedUseCase(useCase.id)}
                      className={`p-6 rounded-lg border-2 text-left transition-all ${
                        selectedUseCase === useCase.id
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                      }`}
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {useCase.label}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {useCase.description}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)} disabled={!selectedUseCase}>
                    Continue
                    <FiArrowRight className="ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    You&apos;re all set! 🎉
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Here are some quick tips to get started:
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Browse Templates
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Start by exploring our template library for your use case
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Fill in Details
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Complete the form with your specific information
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-600 text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Generate & Download
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        AI will create your document, ready to download as PDF or DOCX
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-blue-900 dark:text-blue-300">
                    <strong>Free Plan:</strong> You have 3 documents per month. Upgrade anytime for
                    unlimited access!
                  </p>
                </div>

                <Button size="lg" className="w-full" onClick={handleComplete}>
                  Go to Dashboard
                  <FiArrowRight className="ml-2" />
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
