'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface NewsItem {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

const CryptoNews: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/news');
        setNews(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <div className="text-center">Loading news...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Latest Crypto News</h2>
      <div className="space-y-4">
        {news.slice(0, 5).map((item, index) => (
          <div key={index} className="border-b pb-4">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              <h3 className="text-lg font-semibold">{item.title}</h3>
            </a>
            <div className="text-sm text-gray-500 mt-1">
              {item.source} • {new Date(item.publishedAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoNews; 