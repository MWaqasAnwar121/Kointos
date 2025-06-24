'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DarkModeToggle from '../components/DarkModeToggle';

interface NewsItem {
  id: string;
  guid: string;
  imageurl: string;
  title: string;
  url: string;
  source: string;
  body: string;
  tags: string;
  categories: string;
  upvotes: string;
  downvotes: string;
  published_on: number;
  source_info: {
    name: string;
    img: string;
  };
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState('all');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [isLongLoading, setIsLongLoading] = useState(false);
  const FETCH_COOLDOWN = 60000; // 1 minute cooldown

  useEffect(() => {
    const fetchNews = async () => {
      // Check if we should fetch based on cooldown
      const now = Date.now();
      if (!isInitialLoad && now - lastFetchTime < FETCH_COOLDOWN) {
        return;
      }

      // Set up loading timeout
      const loadingTimeout = setTimeout(() => {
        setIsLongLoading(true);
      }, 5000); // Show message after 5 seconds

      try {
        setLoading(true);
        const API_KEY = process.env.NEXT_PUBLIC_CRYPTOCOMPARE_API_KEY || '';
        const response = await fetch(
          'https://min-api.cryptocompare.com/data/v2/news/?lang=EN',
          {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Apikey ${API_KEY}`,
            },
            next: { revalidate: 300 }, // Cache for 5 minutes
          }
        );

        if (response.status === 429) {
          throw new Error('API rate limit exceeded. Please try again in a few minutes.');
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.Message || 'Failed to fetch news');
        }

        const data = await response.json();
        if (!data.Data || !Array.isArray(data.Data)) {
          throw new Error('Invalid response format from API');
        }

        setNews(data.Data);
        setFilteredNews(data.Data);
        setLastFetchTime(now);
        setError(null);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch news. Please try again later.');
        setNews([]);
        setFilteredNews([]);
      } finally {
        clearTimeout(loadingTimeout);
        setLoading(false);
        setIsInitialLoad(false);
        setIsLongLoading(false);
      }
    };

    fetchNews();

    // Set up periodic refresh
    const intervalId = setInterval(() => {
      fetchNews();
    }, FETCH_COOLDOWN);

    return () => {
      clearInterval(intervalId);
    };
  }, [isInitialLoad, lastFetchTime]);

  // Filter news based on search term and selected source
  useEffect(() => {
    let filtered = news;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        item =>
          item.title.toLowerCase().includes(searchLower) ||
          item.body.toLowerCase().includes(searchLower) ||
          item.categories.toLowerCase().includes(searchLower)
      );
    }

    if (selectedSource !== 'all') {
      filtered = filtered.filter(item => item.source === selectedSource);
    }

    setFilteredNews(filtered);
  }, [searchTerm, selectedSource, news]);

  // Get unique sources for filter dropdown
  const sources = ['all', ...Array.from(new Set(news.map(item => item.source)))].sort();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && isInitialLoad) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading cryptocurrency news...</p>
          {isLongLoading && (
            <div className="mt-4 max-w-md mx-auto">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This is taking longer than usual. The API might be experiencing high traffic.
                Please wait a moment...
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Error Loading News</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar is now handled in layout.tsx */}
      {/* <Navbar /> */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Search News
              </label>
              <input
                type="text"
                id="search"
                className="input"
                placeholder="Search by title, content, or category"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="source" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter by Source
              </label>
              <select
                id="source"
                className="select"
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
              >
                {sources.map((source) => (
                  <option key={source} value={source}>
                    {source === 'all' ? 'All Sources' : source}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* News List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredNews.map((item) => (
            <article key={item.id} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="card-body">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                  <div className="flex-shrink-0 mb-4 md:mb-0">
                    <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden">
                      <Image
                        src={item.imageurl || '/placeholder-news.jpg'}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 12rem"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="relative w-6 h-6">
                          <Image
                            src={item.source_info.img || '/placeholder-source.jpg'}
                            alt={item.source_info.name}
                            fill
                            sizes="1.5rem"
                            className="rounded-full"
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {item.source_info.name}
                        </span>
                      </div>
                      <time className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(item.published_on)}
                      </time>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {item.title}
                      </a>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {item.body}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.categories.split('|').map((category, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
          {filteredNews.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No news found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 