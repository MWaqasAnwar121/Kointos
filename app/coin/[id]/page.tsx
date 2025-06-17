'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DarkModeToggle from '../../components/DarkModeToggle';
import MobileMenu from '../../components/MobileMenu';
import { useParams } from 'next/navigation';

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  description?: string;
}

interface PriceData {
  timestamp: number;
  price: number;
}

export default function CoinPage() {
  const params = useParams();
  const coinId = params?.id as string | undefined;
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [isLongLoading, setIsLongLoading] = useState(false);
  const FETCH_COOLDOWN = 60000; // 1 minute cooldown

  useEffect(() => {
    const fetchData = async () => {
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
        
        // Fetch coin data and price history in parallel
        const [coinResponse, priceResponse] = await Promise.all([
          fetch(
            `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
            {
              headers: {
                'Accept': 'application/json',
              },
              cache: 'force-cache'
            }
          ),
          fetch(
            `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7&interval=daily`,
            {
              headers: {
                'Accept': 'application/json',
              },
              cache: 'force-cache'
            }
          )
        ]);

        if (coinResponse.status === 429 || priceResponse.status === 429) {
          throw new Error('API rate limit exceeded. Please try again in a minute.');
        }

        if (!coinResponse.ok || !priceResponse.ok) {
          throw new Error('Failed to fetch coin data. Please try again later.');
        }

        const [coinData, priceData] = await Promise.all([
          coinResponse.json(),
          priceResponse.json()
        ]);

        setCoinData({
          id: coinData.id,
          name: coinData.name,
          symbol: coinData.symbol,
          image: coinData.image.large,
          current_price: coinData.market_data.current_price.usd,
          market_cap: coinData.market_data.market_cap.usd,
          market_cap_rank: coinData.market_cap_rank,
          fully_diluted_valuation: coinData.market_data.fully_diluted_valuation?.usd,
          total_volume: coinData.market_data.total_volume.usd,
          high_24h: coinData.market_data.high_24h.usd,
          low_24h: coinData.market_data.low_24h.usd,
          price_change_24h: coinData.market_data.price_change_24h,
          price_change_percentage_24h: coinData.market_data.price_change_percentage_24h,
          market_cap_change_24h: coinData.market_data.market_cap_change_24h,
          market_cap_change_percentage_24h: coinData.market_data.market_cap_change_percentage_24h,
          circulating_supply: coinData.market_data.circulating_supply,
          total_supply: coinData.market_data.total_supply,
          max_supply: coinData.market_data.max_supply,
          ath: coinData.market_data.ath.usd,
          ath_change_percentage: coinData.market_data.ath_change_percentage.usd,
          ath_date: coinData.market_data.ath_date.usd,
          atl: coinData.market_data.atl.usd,
          atl_change_percentage: coinData.market_data.atl_change_percentage.usd,
          atl_date: coinData.market_data.atl_date.usd,
          description: coinData.description.en,
        });

        setPriceHistory(
          priceData.prices.map(([timestamp, price]: [number, number]) => ({
            timestamp,
            price,
          }))
        );

        setLastFetchTime(now);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        clearTimeout(loadingTimeout);
        setLoading(false);
        setIsInitialLoad(false);
        setIsLongLoading(false);
      }
    };

    fetchData();

    // Set up periodic refresh
    const intervalId = setInterval(() => {
      fetchData();
    }, FETCH_COOLDOWN);

    return () => clearInterval(intervalId);
  }, [coinId]);

  if (loading && isInitialLoad) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading {coinId} data...</p>
          {isLongLoading && (
            <div className="mt-4 max-w-md mx-auto">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This is taking longer than usual. The CoinGecko API might be experiencing high traffic.
                You can:
              </p>
              <ul className="mt-2 text-sm text-gray-500 dark:text-gray-400 list-disc list-inside">
                <li>Wait a few more moments</li>
                <li>Return to the <Link href="/" className="text-blue-500 hover:text-blue-600">dashboard</Link></li>
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
              <div className="mt-4 space-x-4">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Try Again
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!coinData) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coin Overview */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-body">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative w-16 h-16">
                    <Image
                      src={coinData.image}
                      alt={`${coinData.name} logo`}
                      fill
                      sizes="4rem"
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {coinData.name} ({coinData.symbol.toUpperCase()})
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Rank #{coinData.market_cap_rank}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${coinData.current_price.toLocaleString()}
                    </span>
                    <span className={`ml-2 text-sm font-semibold ${
                      coinData.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {coinData.price_change_percentage_24h >= 0 ? '↑' : '↓'}
                      {Math.abs(coinData.price_change_percentage_24h).toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Price Chart */}
                <div className="h-64 mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={priceHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
                      />
                      <YAxis
                        domain={['auto', 'auto']}
                        tickFormatter={(value) => `$${value.toLocaleString()}`}
                      />
                      <Tooltip
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#0ea5e9"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Market Stats */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Market Stats
                </h2>
              </div>
              <div className="card-body">
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-gray-500 dark:text-gray-400">Market Cap</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">
                      ${coinData.market_cap.toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500 dark:text-gray-400">24h Trading Volume</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">
                      ${coinData.total_volume.toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500 dark:text-gray-400">24h High / Low</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">
                      ${coinData.high_24h.toLocaleString()} / ${coinData.low_24h.toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500 dark:text-gray-400">Circulating Supply</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">
                      {coinData.circulating_supply.toLocaleString()} {coinData.symbol.toUpperCase()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500 dark:text-gray-400">Max Supply</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">
                      {coinData.max_supply
                        ? `${coinData.max_supply.toLocaleString()} ${coinData.symbol.toUpperCase()}`
                        : 'Unlimited'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500 dark:text-gray-400">All Time High</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">
                      ${coinData.ath.toLocaleString()}
                      <span className={`ml-1 ${
                        coinData.ath_change_percentage >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ({coinData.ath_change_percentage.toFixed(2)}%)
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Description */}
          {coinData.description && (
            <div className="lg:col-span-3">
              <div className="card">
                <div className="card-header">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    About {coinData.name}
                  </h2>
                </div>
                <div className="card-body prose dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: coinData.description }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 