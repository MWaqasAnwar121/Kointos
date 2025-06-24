'use client';

import React, { useState, useEffect, useMemo } from 'react';
import CoinCard from './components/CoinCard';
import DarkModeToggle from './components/DarkModeToggle';
import MobileMenu from './components/MobileMenu';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

export default function Home() {
  const { data: session, status } = useSession();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [marketCapFilter, setMarketCapFilter] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [isLongLoading, setIsLongLoading] = useState(false);
  const FETCH_COOLDOWN = 60000; // 1 minute cooldown

  useEffect(() => {
    const fetchCoins = async () => {
      // Check if we should fetch based on cooldown
      const now = Date.now();
      if (!isInitialLoad && now - lastFetchTime < FETCH_COOLDOWN) {
        return;
      }

      // Try to get cached data first
      const cachedData = localStorage.getItem('coinData');
      const cachedTimestamp = localStorage.getItem('coinDataTimestamp');
      
      if (cachedData && cachedTimestamp) {
        const parsedData = JSON.parse(cachedData);
        const timestamp = parseInt(cachedTimestamp);
        
        // Use cached data if it's less than 1 minute old
        if (now - timestamp < FETCH_COOLDOWN) {
          setCoins(parsedData);
          setLoading(false);
          setIsInitialLoad(false);
          return;
        }
      }

      // Set up loading timeout
      const loadingTimeout = setTimeout(() => {
        setIsLongLoading(true);
      }, 5000);

      try {
        setLoading(true);
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1&sparkline=false',
          {
            headers: {
              'Accept': 'application/json',
            },
            next: { revalidate: 60 } // Cache for 1 minute
          }
        );

        if (response.status === 429) {
          // If rate limited, use cached data if available
          if (cachedData) {
            setCoins(JSON.parse(cachedData));
            setError('Using cached data - API rate limit exceeded. Will try again in a minute.');
            return;
          }
          throw new Error('API rate limit exceeded. Please try again in a minute.');
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch coins: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // Cache the new data
        localStorage.setItem('coinData', JSON.stringify(data));
        localStorage.setItem('coinDataTimestamp', now.toString());
        
        setCoins(data);
        setError(null);
        setLastFetchTime(now);
      } catch (err) {
        console.error('Error fetching coins:', err);
        // If error occurs and we have cached data, use it
        if (cachedData) {
          setCoins(JSON.parse(cachedData));
          setError('Using cached data - Unable to fetch latest prices. Will try again in a minute.');
        } else {
          setError(
            err instanceof Error 
              ? err.message 
              : 'Failed to fetch coin data. Please try again later.'
          );
        }
      } finally {
        clearTimeout(loadingTimeout);
        setLoading(false);
        setIsInitialLoad(false);
        setIsLongLoading(false);
      }
    };

    fetchCoins();

    // Set up periodic refresh every minute
    const intervalId = setInterval(() => {
      fetchCoins();
    }, FETCH_COOLDOWN);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array as we manage updates internally

  // Debounced search function
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredCoins = useMemo(() => {
    return coins.filter((coin) => {
      const matchesSearch = coin.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      const matchesPriceRange = (
        (priceRange.min === '' || coin.current_price >= Number(priceRange.min)) &&
        (priceRange.max === '' || coin.current_price <= Number(priceRange.max))
      );

      const matchesMarketCap = marketCapFilter === 'all' ||
        (marketCapFilter === 'high' && coin.market_cap >= 10000000000) ||
        (marketCapFilter === 'medium' && coin.market_cap >= 1000000000 && coin.market_cap < 10000000000) ||
        (marketCapFilter === 'low' && coin.market_cap < 1000000000);

      return matchesSearch && matchesPriceRange && matchesMarketCap;
    });
  }, [coins, debouncedSearchTerm, priceRange, marketCapFilter]);

  useEffect(() => {
    console.log('Session status:', status);
    console.log('Session data:', session);
  }, [session, status]);

  if (loading && isInitialLoad) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading cryptocurrency data...</p>
          {isLongLoading && (
            <div className="mt-4 max-w-md mx-auto">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This is taking longer than usual. The CoinGecko API might be experiencing high traffic.
                You can:
              </p>
              <ul className="mt-2 text-sm text-gray-500 dark:text-gray-400 list-disc list-inside">
                <li>Wait a few more moments</li>
                <li>Refresh the page</li>
                <li>Try again later</li>
              </ul>
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
              <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Error Loading Data</h2>
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
      

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card mb-8">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Search Coins
                </label>
                <input
                  type="text"
                  id="search"
                  className="input"
                  placeholder="Search by name or symbol"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="min-price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Min Price
                </label>
                <input
                  type="number"
                  id="min-price"
                  className="input"
                  placeholder="Min price"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="max-price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Max Price
                </label>
                <input
                  type="number"
                  id="max-price"
                  className="input"
                  placeholder="Max price"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="market-cap" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Market Cap
                </label>
                <select
                  id="market-cap"
                  className="select"
                  value={marketCapFilter}
                  onChange={(e) => setMarketCapFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="high">High Cap (&gt;$10B)</option>
                  <option value="medium">Mid Cap ($1B-$10B)</option>
                  <option value="low">Low Cap (&lt;$1B)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Coin List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredCoins.map((coin) => (
            <CoinCard
              key={coin.id}
              id={coin.id}
              name={coin.name}
              symbol={coin.symbol}
              price={coin.current_price}
              priceChange24h={coin.price_change_percentage_24h}
              marketCap={coin.market_cap}
              volume24h={coin.total_volume}
              image={coin.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
