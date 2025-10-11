import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { FiCheck, FiFileText, FiZap, FiShield } from 'react-icons/fi';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">LD</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">LegalDraft AI</span>
          </div>
          <div className="space-x-4">
            <Link href="/sign-in">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Generate Professional Legal Documents
          <span className="text-blue-600"> in Seconds</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
          LegalDraft AI uses advanced AI to create customized legal documents for your business,
          saving you time and money while ensuring professional quality.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/sign-up">
            <Button size="lg">Start Free Trial</Button>
          </Link>
          <Link href="/templates">
            <Button size="lg" variant="outline">Browse Templates</Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Why Choose LegalDraft AI?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
              <FiZap className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Generate complex legal documents in seconds, not hours
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
              <FiShield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Professional Quality</h3>
            <p className="text-gray-600 dark:text-gray-400">
              AI-powered generation ensures legally sound and well-formatted documents
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
              <FiFileText className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Extensive Library</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Access templates for NDAs, contracts, leases, and more
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Simple, Transparent Pricing
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border-2 border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Free</h3>
            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              $0<span className="text-lg text-gray-600 dark:text-gray-400">/month</span>
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <FiCheck className="w-5 h-5 text-green-600 mr-2" />
                3 documents per month
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <FiCheck className="w-5 h-5 text-green-600 mr-2" />
                Basic templates
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <FiCheck className="w-5 h-5 text-green-600 mr-2" />
                PDF export
              </li>
            </ul>
            <Link href="/sign-up">
              <Button variant="outline" className="w-full">Get Started</Button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border-2 border-blue-600 relative">
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
              Popular
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pro</h3>
            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              $29<span className="text-lg text-gray-600 dark:text-gray-400">/month</span>
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <FiCheck className="w-5 h-5 text-green-600 mr-2" />
                Unlimited documents
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <FiCheck className="w-5 h-5 text-green-600 mr-2" />
                All templates
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <FiCheck className="w-5 h-5 text-green-600 mr-2" />
                PDF & DOCX export
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <FiCheck className="w-5 h-5 text-green-600 mr-2" />
                No watermark
              </li>
            </ul>
            <Link href="/sign-up">
              <Button className="w-full">Start Free Trial</Button>
            </Link>
          </div>

          {/* Firm Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border-2 border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Firm</h3>
            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              $99<span className="text-lg text-gray-600 dark:text-gray-400">/month</span>
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <FiCheck className="w-5 h-5 text-green-600 mr-2" />
                Everything in Pro
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <FiCheck className="w-5 h-5 text-green-600 mr-2" />
                5 team members
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <FiCheck className="w-5 h-5 text-green-600 mr-2" />
                Custom templates
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <FiCheck className="w-5 h-5 text-green-600 mr-2" />
                Priority support
              </li>
            </ul>
            <Link href="/sign-up">
              <Button variant="outline" className="w-full">Contact Sales</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 LegalDraft AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
