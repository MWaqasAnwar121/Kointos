'use client';

import React, { useState } from 'react';
// Removed MobileMenu import as it's now handled in layout.tsx
// import MobileMenu from '../components/MobileMenu';
import DarkModeToggle from '../components/DarkModeToggle';
import Link from 'next/link';
// Removed Navbar import as it's now handled in layout.tsx
// import Navbar from '../components/Navbar';

export default function PrivacyPolicyPage() {
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy</h1>
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">1. Introduction</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                At CryptoDash, we take your privacy seriously. This Privacy Policy explains how we collect,
                use, disclose, and safeguard your information when you use our cryptocurrency dashboard.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">2. Information We Collect</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Account information (email, username)</li>
                <li>Portfolio data and preferences</li>
                <li>Communication preferences</li>
                <li>Usage data and analytics</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We use the collected information to:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Provide and maintain our services</li>
                <li>Improve user experience</li>
                <li>Send notifications and updates</li>
                <li>Analyze usage patterns</li>
                <li>Ensure security and prevent fraud</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">4. Data Security</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We implement appropriate security measures to protect your personal information.
                However, no method of transmission over the Internet is 100% secure, and we cannot
                guarantee absolute security.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">5. Your Rights</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">6. Contact Us</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-300">
                  Email: <a href="mailto:privacy@cryptodash.com" className="text-blue-600 dark:text-blue-400 hover:underline">privacy@cryptodash.com</a>
                </p>
              </div>
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