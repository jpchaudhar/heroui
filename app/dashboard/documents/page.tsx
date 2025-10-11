import Link from 'next/link';
import { 
  FileText, 
  Plus, 
  Download, 
  Edit,
  Trash2,
  Filter,
  Search
} from 'lucide-react';

// Mock data - in real app, this would come from your database
const documents = [
  {
    id: '1',
    title: 'NDA - TechCorp Partnership',
    type: 'Non-Disclosure Agreement',
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    size: '2.4 KB'
  },
  {
    id: '2',
    title: 'Employment Offer - John Smith',
    type: 'Employment Offer Letter',
    status: 'draft',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
    size: '3.1 KB'
  },
  {
    id: '3',
    title: 'Lease Agreement - 123 Main St',
    type: 'Residential Lease Agreement',
    status: 'completed',
    createdAt: '2024-01-12T09:15:00Z',
    updatedAt: '2024-01-12T09:15:00Z',
    size: '4.2 KB'
  },
  {
    id: '4',
    title: 'Service Agreement - Web Design',
    type: 'Service Agreement',
    status: 'completed',
    createdAt: '2024-01-10T11:00:00Z',
    updatedAt: '2024-01-10T11:00:00Z',
    size: '3.8 KB'
  },
  {
    id: '5',
    title: 'Consulting Agreement - Marketing',
    type: 'Consulting Agreement',
    status: 'draft',
    createdAt: '2024-01-08T16:30:00Z',
    updatedAt: '2024-01-09T10:20:00Z',
    size: '2.9 KB'
  }
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and download your generated legal documents
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/dashboard/generate"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Document
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                <option>All Status</option>
                <option>Completed</option>
                <option>Draft</option>
              </select>
              <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                <option>All Types</option>
                <option>NDA</option>
                <option>Employment</option>
                <option>Lease</option>
                <option>Service Agreement</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {documents.map((document) => (
                <li key={document.id} className="py-5">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
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
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                        <span>Created: {formatDate(document.createdAt)}</span>
                        <span>•</span>
                        <span>Size: {document.size}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-500">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-500">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Empty State (if no documents) */}
      {documents.length === 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first legal document.
              </p>
              <div className="mt-6">
                <Link
                  href="/dashboard/generate"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Document
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}