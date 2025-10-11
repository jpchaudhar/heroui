'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiFileText, FiFolder, FiCreditCard, FiSettings, FiShield } from 'react-icons/fi';

interface SidebarProps {
  isAdmin?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isAdmin = false }) => {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: FiHome },
    { href: '/templates', label: 'Templates', icon: FiFolder },
    { href: '/dashboard/documents', label: 'My Documents', icon: FiFileText },
    { href: '/billing', label: 'Billing', icon: FiCreditCard },
    { href: '/settings', label: 'Settings', icon: FiSettings },
  ];

  if (isAdmin) {
    navItems.push({ href: '/admin', label: 'Admin', icon: FiShield });
  }

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">LD</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">LegalDraft AI</span>
        </Link>
      </div>

      <nav className="px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
