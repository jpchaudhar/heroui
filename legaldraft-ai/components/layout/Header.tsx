'use client';

import React from 'react';
import { UserButton } from '@clerk/nextjs';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useStore } from '@/lib/store';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useStore();

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 right-0 left-64 z-10">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex-1">
          {/* Search or breadcrumbs could go here */}
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <FiMoon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <FiSun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>

          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
};
