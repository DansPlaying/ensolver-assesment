'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (pathname === '/login') {
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
            <nav className="flex">
              <Link
                href="/"
                className={`px-2 sm:px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  pathname === '/'
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Active
              </Link>
              <Link
                href="/archived"
                className={`px-2 sm:px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
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
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="px-2 sm:px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Sign out of your account"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
