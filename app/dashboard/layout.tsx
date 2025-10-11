import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { 
  FileText, 
  Layout, 
  Library, 
  CreditCard, 
  Settings, 
  Users
} from 'lucide-react';
import { ReactNode } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Layout },
  { name: 'My Documents', href: '/dashboard/documents', icon: FileText },
  { name: 'Templates', href: '/dashboard/templates', icon: Library },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Team', href: '/dashboard/team', icon: Users },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

function Sidebar() {
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">LegalDraft AI</span>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <UserButton afterSignOutUrl="/" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Account</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileNav() {
  return (
    <div className="md:hidden">
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">LegalDraft AI</span>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-col w-0 flex-1 overflow-hidden md:ml-64">
        <MobileNav />
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}