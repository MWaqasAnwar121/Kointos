'use client';

import React, { useState } from 'react';
// Removed MobileMenu import as it's now handled in layout.tsx
// import MobileMenu from '../components/MobileMenu';
import DarkModeToggle from '../components/DarkModeToggle';
import Link from 'next/link';
// Removed Navbar import as it's now handled in layout.tsx
// import Navbar from '../components/Navbar';

export default function TermsOfServicePage() {
  // Removed state and functions for mobile menu as they are now handled in Navbar
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Terms of Service</h1>
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                By accessing and using CryptoDash, you agree to be bound by these Terms of Service
                and all applicable laws and regulations. If you do not agree with any of these terms,
                you are prohibited from using or accessing this site.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">2. Use License</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Permission is granted to temporarily access CryptoDash for personal, non-commercial
                transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">3. Disclaimer</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                The materials on CryptoDash are provided on an 'as is' basis. CryptoDash makes no
                warranties, expressed or implied, and hereby disclaims and negates all other
                warranties including, without limitation, implied warranties or conditions of
                merchantability, fitness for a particular purpose, or non-infringement of
                intellectual property or other violation of rights.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">4. Limitations</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                In no event shall CryptoDash or its suppliers be liable for any damages (including,
                without limitation, damages for loss of data or profit, or due to business
                interruption) arising out of the use or inability to use the materials on
                CryptoDash.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">5. Accuracy of Materials</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                The materials appearing on CryptoDash could include technical, typographical, or
                photographic errors. CryptoDash does not warrant that any of the materials on its
                website are accurate, complete, or current. CryptoDash may make changes to the
                materials contained on its website at any time without notice.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">6. Links</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                CryptoDash has not reviewed all of the sites linked to its website and is not
                responsible for the contents of any such linked site. The inclusion of any link
                does not imply endorsement by CryptoDash of the site. Use of any such linked
                website is at the user's own risk.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">7. Modifications</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                CryptoDash may revise these terms of service for its website at any time without
                notice. By using this website you are agreeing to be bound by the then current
                version of these terms of service.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">8. Governing Law</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                These terms and conditions are governed by and construed in accordance with the
                laws of your jurisdiction and you irrevocably submit to the exclusive jurisdiction
                of the courts in that location.
              </p>
            </div>
          </div>
        </div>
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
              <Link href="/about" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm">
                About
              </Link>
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