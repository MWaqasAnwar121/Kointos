'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import UserMenu from './UserMenu';

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>; // Loading state
  }

  if (status === 'authenticated') {
    return <UserMenu />;
  }

  // status === 'unauthenticated'
  return (
    <div className="flex items-center space-x-4">
      <Link href="/login" className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-700 transition">
        Sign In
      </Link>
      <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Sign Up
      </Link>
    </div>
  );
} 