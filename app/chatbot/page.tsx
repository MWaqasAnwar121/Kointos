'use client';

import { useEffect, useState } from 'react';

export default function ChatbotPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading to false after iframe loads
    const handleLoad = () => setIsLoading(false);
    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  return (
    <div className="w-full h-screen relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
      <iframe
        src="https://subzero12.streamlit.app/"
        className="w-full h-full border-0"
        title="AI Chatbot"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
} 