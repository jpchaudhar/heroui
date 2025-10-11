'use client';

import React, { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useStore } from '@/lib/store';

interface DashboardLayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, isAdmin = false }) => {
  const { theme } = useStore();

  useEffect(() => {
    // Apply theme class to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isAdmin={isAdmin} />
      <Header />
      <main className="ml-64 pt-16">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};
