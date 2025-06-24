'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

const AuthButtons = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname(); // Get current path

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: '/' });
    setIsLoading(false);
  };

  if (status === 'loading') {
    return (
      <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
    );
  }

  if (session && session.user) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-700 dark:text-gray-300 hidden md:inline">
          {session.user.name || session.user.email}
        </span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSignOut}
          disabled={isLoading}
          className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
        >
          {isLoading ? 'Signing out...' : 'Sign Out'}
        </motion.button>
      </div>
    );
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => signIn(undefined, { callbackUrl: pathname })}
        className="text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 px-3 py-1 rounded-md transition"
      >
        Sign In
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => signIn(undefined, { callbackUrl: pathname })}
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition"
      >
        Sign Up
      </motion.button>
    </>
  );
};

export default AuthButtons;