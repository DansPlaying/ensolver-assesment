'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { ThemeToggle } from './ThemeToggle';
import { ConfirmDialog } from './ConfirmDialog';

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const authPages = ['/login', '/register', '/forgot-password', '/reset-password'];
  if (authPages.includes(pathname)) {
    return null;
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="text-lg font-bold text-gray-900 dark:text-white">
            Notes
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <nav aria-label="Main navigation" className="flex">
              <Link
                href="/"
                aria-current={pathname === '/' ? 'page' : undefined}
                className={`px-2 sm:px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  pathname === '/'
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Active
              </Link>
              <Link
                href="/archived"
                aria-current={pathname === '/archived' ? 'page' : undefined}
                className={`px-2 sm:px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  pathname === '/archived'
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Archived
              </Link>
            </nav>
            <ThemeToggle />
            {session && (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="px-2 sm:px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Sign out of your account"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Sign out"
        message="Are you sure you want to sign out?"
        confirmLabel="Sign out"
        cancelLabel="Cancel"
        variant="warning"
        onConfirm={() => signOut({ callbackUrl: '/login' })}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </header>
  );
}
