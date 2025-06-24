'use client';

import { Inter } from 'next/font/google';
import { useState, useEffect } from 'react';
import UserMenu from './UserMenu';
import { SessionProvider } from 'next-auth/react';
import AuthButtons from './AuthButtons';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import MobileMenu from './MobileMenu';
import DarkModeToggle from './DarkModeToggle';

const Provider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState('light');
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
    const toggleMobileMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    };
  
    useEffect(() => {
      // Check for saved theme preference or system preference
      const savedTheme = localStorage.getItem('theme');
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const initialTheme = savedTheme || systemTheme;
      
      setTheme(initialTheme);
      document.documentElement.classList.toggle('dark', initialTheme === 'dark');
      setIsLoading(false);
    }, []);
  
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
          />
        </div>
      );
    }

    return (
      <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
        <div className="flex flex-col min-h-screen">
            <motion.nav 
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              className="bg-white dark:bg-gray-800 shadow-lg w-full backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <motion.div 
                    className="flex items-center space-x-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      CryptoDash
                    </Link>
                  </motion.div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8 items-center">
                    <Link href="/" className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      Dashboard
                    </Link>
                    <Link href="/portfolio" className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      Portfolio
                    </Link>
                    <Link href="/news" className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      News
                    </Link>
                    <Link href="/spin" className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      Spin & Win
                    </Link>
                    <Link href="/articles" className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      Articles
                    </Link>
                    <Link href="/subzero" className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      AI Tool
                    </Link>
                    <Link href="/about" className="border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                      About Us
                    </Link>
                  </div>
                  <div className="flex items-center space-x-4">
                    <AuthButtons />
                    <DarkModeToggle />
                    <button
                      onClick={toggleMobileMenu}
                      className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                      aria-label="Toggle mobile menu"
                    >
                      <span className="sr-only">Open main menu</span>
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </motion.nav>
            <MobileMenu isOpen={isMobileMenuOpen} onClose={toggleMobileMenu} />
            <AnimatePresence mode="wait">
              <motion.main
                key={pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-grow"
              >
                {children}
              </motion.main>
            </AnimatePresence>
          </div>
      </SessionProvider>
    );
}
    
export default Provider;