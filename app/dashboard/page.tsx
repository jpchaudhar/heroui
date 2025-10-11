import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { 
  FileText, 
  Plus, 
  TrendingUp, 
  Clock, 
  Users,
  Download
} from 'lucide-react';

// Mock data - in real app, this would come from your database
const recentDocuments = [
  {
    id: '1',
    title: 'NDA - TechCorp Partnership',
    type: 'Non-Disclosure Agreement',
    status: 'completed',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Employment Offer - John Smith',
    type: 'Employment Offer Letter',
    status: 'draft',
    createdAt: '2024-01-14',
    updatedAt: '2024-01-14'
  },
  {
    id: '3',
    title: 'Lease Agreement - 123 Main St',
    type: 'Residential Lease Agreement',
    status: 'completed',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12'
  }
];

const stats = [
  {
    name: 'Documents Created',
    value: '12',
    change: '+4.75%',
    changeType: 'positive',
    icon: FileText,
  },
  {
    name: 'This Month Usage',
    value: '8 / 10',
    change: 'Pro Plan',
    changeType: 'neutral',
    icon: TrendingUp,
  },
  {
    name: 'Time Saved',
    value: '24 hrs',
    change: 'vs manual drafting',
    changeType: 'positive',
    icon: Clock,
  },
  {
    name: 'Team Members',
    value: '3',
    change: 'Active users',
    changeType: 'neutral',
    icon: Users,
  },
];

const quickActions = [
  {
    name: 'Create NDA',
    description: 'Non-disclosure agreement',
    href: '/dashboard/generate?template=nda',
    icon: FileText,
    color: 'bg-blue-500',
  },
  {
    name: 'Employment Letter',
    description: 'Job offer letter',
    href: '/dashboard/generate?template=employment',
    icon: Users,
    color: 'bg-green-500',
  },
  {
    name: 'Lease Agreement',
    description: 'Residential lease',
    href: '/dashboard/generate?template=lease',
    icon: FileText,
    color: 'bg-purple-500',
  },
  {
    name: 'Browse All Templates',
    description: 'View template library',
    href: '/dashboard/templates',
    icon: Plus,
    color: 'bg-gray-500',
  },
];

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.firstName || 'User'}!
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Generate professional legal documents with AI in minutes
              </p>
            </div>
            <Link
              href="/dashboard/generate"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Document
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{item.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-sm text-gray-500">{item.change}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.name}
                  href={action.href}
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div>
                    <span className={`rounded-lg inline-flex p-3 ${action.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {action.name}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {action.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Recent Documents</h2>
            <Link
              href="/dashboard/documents"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              View all
            </Link>
          </div>
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {recentDocuments.map((document) => (
                <li key={document.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {document.title}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {document.type}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        document.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {document.status}
                      </span>
                      <button className="text-gray-400 hover:text-gray-500">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}