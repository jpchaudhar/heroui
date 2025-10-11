import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { 
  Shield,
  Users,
  FileText,
  BarChart3,
  Settings
} from 'lucide-react';
import { ReactNode } from 'react';

const navigation = [
  { name: 'Overview', href: '/admin', icon: BarChart3 },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Templates', href: '/admin/templates', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

function Sidebar() {
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-gray-900">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Shield className="h-8 w-8 text-blue-400" />
            <span className="ml-2 text-xl font-bold text-white">Admin Panel</span>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
          <div className="flex items-center">
            <UserButton afterSignOutUrl="/" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-300">Admin</p>
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
      <div className="bg-gray-900 border-b border-gray-700 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-400" />
            <span className="ml-2 text-xl font-bold text-white">Admin Panel</span>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
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