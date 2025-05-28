'use client';

import React, { useState } from 'react';
// Removed MobileMenu import as it's now handled in layout.tsx
// import MobileMenu from '../components/MobileMenu';
import DarkModeToggle from '../components/DarkModeToggle';
import Link from 'next/link';
import Image from 'next/image';
// Removed useRouter as it's now handled in Navbar component if needed
// import { useRouter } from 'next/navigation';

// Import the new AboutUsContent component
import AboutUsContent from '../components/AboutUsContent';
// Removed Navbar import as it's now handled in layout.tsx
// import Navbar from '../components/Navbar';
// Removed CryptoQuoteSlider import as it will be added inside AboutUsContent
// import CryptoQuoteSlider from '../components/CryptoQuoteSlider';

export default function About() {
  // Removed state and functions for mobile menu as they are now handled in Navbar
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const router = useRouter();

  // const toggleMobileMenu = () => {
  //   setIsMobileMenuOpen(!isMobileMenuOpen);
  // };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Navbar is now handled in layout.tsx */}
      {/* <Navbar /> */}

      {/* Removed Mobile Menu as it's now part of Navbar */}
      {/* <MobileMenu isOpen={isMobileMenuOpen} onClose={toggleMobileMenu} /> */}

      {/* Main Content */}
      <main className="flex-grow">
        {/* Render the AboutUsContent component which will now include the slider */}
        <AboutUsContent />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow-sm mt-8">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                © {new Date().getFullYear()} CryptoDash. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 