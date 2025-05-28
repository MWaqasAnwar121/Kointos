// components/CryptoQuoteSlider.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Import motion

const quotes = [
  {
    text: "Bitcoin is a technological tour de force.",
    author: "Bill Gates"
  },
  {
    text: "Cryptocurrency is such a powerful concept that it can actually revolutionize the way that all global interactions take place.",
    author: "Brock Pierce"
  },
  {
    text: "Blockchain is the most important invention since the internet.",
    author: "Tim Draper"
  },
  {
    text: "Cryptocurrency is bringing in a new era of digital money.",
    author: "Charles Lee"
  }
];

const CryptoQuoteSlider: React.FC = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 7000); // Change quote every 7 seconds

    return () => clearInterval(interval);
  }, []);

  const currentQuote = quotes[currentQuoteIndex];

  return (
    <div className="text-center my-12 p-8 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuoteIndex} // Use index as key for AnimatePresence
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="p-4"
        >
          <p className="text-xl italic text-gray-800 dark:text-gray-200 mb-2">
            "{currentQuote.text}"
          </p>
          <p className="text-base font-semibold text-gray-600 dark:text-gray-400">
            - {currentQuote.author}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CryptoQuoteSlider; 