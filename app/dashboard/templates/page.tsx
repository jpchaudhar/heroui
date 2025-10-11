import Link from 'next/link';
import { 
  FileText, 
  Users, 
  Building, 
  Home, 
  Scale,
  Plus,
  Star
} from 'lucide-react';

const categories = [
  {
    id: 'business',
    name: 'Business',
    description: 'Contracts, NDAs, partnerships',
    icon: Building,
    color: 'bg-blue-500',
    count: 12
  },
  {
    id: 'employment',
    name: 'Employment',
    description: 'Offer letters, contracts, agreements',
    icon: Users,
    color: 'bg-green-500',
    count: 8
  },
  {
    id: 'property',
    name: 'Property',
    description: 'Leases, purchase agreements',
    icon: Home,
    color: 'bg-purple-500',
    count: 6
  },
  {
    id: 'litigation',
    name: 'Litigation',
    description: 'Legal notices, demand letters',
    icon: Scale,
    color: 'bg-red-500',
    count: 4
  }
];

const featuredTemplates = [
  {
    id: 'nda',
    name: 'Non-Disclosure Agreement (NDA)',
    category: 'Business',
    description: 'Protect confidential information in business discussions',
    popular: true,
    fields: 9
  },
  {
    id: 'employment',
    name: 'Employment Offer Letter',
    category: 'Employment',
    description: 'Professional job offer letter template',
    popular: true,
    fields: 17
  },
  {
    id: 'lease',
    name: 'Residential Lease Agreement',
    category: 'Property',
    description: 'Comprehensive residential rental agreement',
    popular: false,
    fields: 15
  },
  {
    id: 'service-agreement',
    name: 'Service Agreement',
    category: 'Business',
    description: 'Professional services contract template',
    popular: false,
    fields: 12
  },
  {
    id: 'consulting-agreement',
    name: 'Consulting Agreement',
    category: 'Business',
    description: 'Independent contractor agreement',
    popular: true,
    fields: 14
  },
  {
    id: 'termination-letter',
    name: 'Employment Termination Letter',
    category: 'Employment',
    description: 'Professional employee termination notice',
    popular: false,
    fields: 8
  }
];

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Templates</h1>
          <p className="mt-1 text-sm text-gray-500">
            Choose from our library of professional legal document templates
          </p>
        </div>
        <Link
          href="/dashboard/generate"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Custom
        </Link>
      </div>

      {/* Categories */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Browse by Category</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.id}
                  href={`/dashboard/templates?category=${category.id}`}
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div>
                    <span className={`rounded-lg inline-flex p-3 ${category.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {category.name}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {category.description}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      {category.count} templates
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Featured Templates */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Popular Templates</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-gray-400" />
                    {template.popular && (
                      <div className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Star className="mr-1 h-3 w-3" />
                        Popular
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {template.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {template.category}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    {template.description}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    {template.fields} fields to complete
                  </p>
                </div>

                <div className="mt-6">
                  <Link
                    href={`/dashboard/generate?template=${template.id}`}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Use Template
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Templates */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">All Templates</h2>
            <div className="flex items-center space-x-2">
              <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                <option>All Categories</option>
                <option>Business</option>
                <option>Employment</option>
                <option>Property</option>
                <option>Litigation</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Template
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fields
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {featuredTemplates.map((template) => (
                  <tr key={template.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {template.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {template.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {template.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {template.fields}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/dashboard/generate?template=${template.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Use Template
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}