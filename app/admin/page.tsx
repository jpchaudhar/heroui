import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Download
} from 'lucide-react';

// Mock data - in real app, this would come from your database
const stats = [
  {
    name: 'Total Users',
    value: '1,234',
    change: '+12%',
    changeType: 'positive',
    icon: Users,
  },
  {
    name: 'Documents Generated',
    value: '5,678',
    change: '+23%',
    changeType: 'positive',
    icon: FileText,
  },
  {
    name: 'Monthly Revenue',
    value: '$12,345',
    change: '+8%',
    changeType: 'positive',
    icon: DollarSign,
  },
  {
    name: 'Active Subscriptions',
    value: '456',
    change: '+15%',
    changeType: 'positive',
    icon: TrendingUp,
  },
];

const recentUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    plan: 'Pro',
    joinDate: '2024-01-15',
    documentsCount: 12
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    plan: 'Free',
    joinDate: '2024-01-14',
    documentsCount: 3
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    plan: 'Firm',
    joinDate: '2024-01-12',
    documentsCount: 45
  },
];

const popularTemplates = [
  {
    id: '1',
    name: 'Non-Disclosure Agreement',
    category: 'Business',
    usageCount: 234,
    trend: '+12%'
  },
  {
    id: '2',
    name: 'Employment Offer Letter',
    category: 'Employment',
    usageCount: 189,
    trend: '+8%'
  },
  {
    id: '3',
    name: 'Residential Lease Agreement',
    category: 'Property',
    usageCount: 156,
    trend: '+15%'
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your LegalDraft AI platform
        </p>
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
                  <div className={`text-sm ${
                    item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.change} from last month
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Recent Users</h2>
              <a href="/admin/users" className="text-sm text-blue-600 hover:text-blue-500">
                View all
              </a>
            </div>
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentUsers.map((user) => (
                  <li key={user.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.plan === 'Free' 
                            ? 'bg-gray-100 text-gray-800'
                            : user.plan === 'Pro'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {user.plan}
                        </span>
                        <span className="text-sm text-gray-500">
                          {user.documentsCount} docs
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Popular Templates */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Popular Templates</h2>
              <a href="/admin/templates" className="text-sm text-blue-600 hover:text-blue-500">
                View all
              </a>
            </div>
            <div className="space-y-4">
              {popularTemplates.map((template) => (
                <div key={template.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {template.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {template.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {template.usageCount} uses
                    </p>
                    <p className="text-sm text-green-600">
                      {template.trend}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              <Users className="mr-2 h-4 w-4" />
              Add New User
            </button>
            <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
              <FileText className="mr-2 h-4 w-4" />
              Create Template
            </button>
            <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}