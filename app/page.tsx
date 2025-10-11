import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';
import { FileText, Users, Shield, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">LegalDraft AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
                  Dashboard
                </Link>
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Generate Professional Legal Documents with{' '}
            <span className="text-blue-600">AI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create NDAs, contracts, lease agreements, and more in minutes. 
            Trusted by law firms, startups, and individuals worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg">
                  Start Free Trial
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg">
                Go to Dashboard
              </Link>
            </SignedIn>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-50">
              View Templates
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Generation</h3>
            <p className="text-gray-600">
              Advanced AI creates professional legal documents tailored to your specific needs in minutes.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Legally Compliant</h3>
            <p className="text-gray-600">
              All templates are reviewed by legal professionals and updated to reflect current laws.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
            <p className="text-gray-600">
              Share documents with team members and collaborate on complex legal projects.
            </p>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Choose Your Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-gray-200">
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <div className="text-3xl font-bold mb-4">$0<span className="text-lg text-gray-600">/month</span></div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  3 documents per month
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Basic templates
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  PDF export
                </li>
              </ul>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50">
                    Get Started
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="block w-full text-center border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50">
                  Current Plan
                </Link>
              </SignedIn>
            </div>

            {/* Pro Plan */}
            <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-blue-500">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold">Pro</h3>
                <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">Popular</span>
              </div>
              <div className="text-3xl font-bold mb-4">$29<span className="text-lg text-gray-600">/month</span></div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Unlimited documents
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  All templates
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  PDF & DOCX export
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  No watermarks
                </li>
              </ul>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium">
                Upgrade to Pro
              </button>
            </div>

            {/* Firm Plan */}
            <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-gray-200">
              <h3 className="text-xl font-semibold mb-2">Firm</h3>
              <div className="text-3xl font-bold mb-4">$99<span className="text-lg text-gray-600">/month</span></div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Everything in Pro
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  5 team members
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Custom templates
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Priority support
                </li>
              </ul>
              <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}