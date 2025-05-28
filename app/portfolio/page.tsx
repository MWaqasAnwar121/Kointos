'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DarkModeToggle from '../components/DarkModeToggle';
import RequireAuth from '../components/RequireAuth';

interface PortfolioItem {
  id: string;
  name: string;
  symbol: string;
  image: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  timestamp: number;
}

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
}

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<CoinData[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CoinData | null>(null);
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load portfolio from localStorage on mount
  useEffect(() => {
    const savedPortfolio = localStorage.getItem('portfolio');
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio));
    }
  }, []);

  // Save portfolio to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  // Update current prices periodically
  useEffect(() => {
    const updatePrices = async () => {
      if (portfolio.length === 0) return;

      try {
        const ids = portfolio.map(item => item.id).join(',');
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
          {
            headers: {
              'Accept': 'application/json',
            },
            cache: 'force-cache'
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch current prices');
        }

        const data = await response.json();
        
        setPortfolio(prev => prev.map(item => ({
          ...item,
          currentPrice: data[item.id]?.usd || item.currentPrice
        })));
      } catch (err) {
        console.error('Error updating prices:', err);
      }
    };

    updatePrices();
    const interval = setInterval(updatePrices, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [portfolio]);

  const searchCoins = async (term: string) => {
    if (!term) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://api.coingecko.com/api/v3/search?query=${term}`,
        {
          headers: {
            'Accept': 'application/json',
          },
          cache: 'force-cache'
        }
      );

      if (!response.ok) {
        throw new Error('Failed to search coins');
      }

      const data = await response.json();
      const coinIds = data.coins.slice(0, 10).map((coin: any) => coin.id).join(',');
      
      if (coinIds) {
        const priceResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&sparkline=false`,
          {
            headers: {
              'Accept': 'application/json',
            },
            cache: 'force-cache'
          }
        );

        if (!priceResponse.ok) {
          throw new Error('Failed to fetch coin prices');
        }

        const priceData = await priceResponse.json();
        setSearchResults(priceData);
      }
    } catch (err) {
      console.error('Error searching coins:', err);
      setError(err instanceof Error ? err.message : 'Failed to search coins');
    } finally {
      setLoading(false);
    }
  };

  const addToPortfolio = () => {
    if (!selectedCoin || !quantity || !purchasePrice) return;

    const newItem: PortfolioItem = {
      id: selectedCoin.id,
      name: selectedCoin.name,
      symbol: selectedCoin.symbol,
      image: selectedCoin.image,
      quantity: parseFloat(quantity),
      purchasePrice: parseFloat(purchasePrice),
      currentPrice: selectedCoin.current_price,
      timestamp: Date.now()
    };

    setPortfolio(prev => [...prev, newItem]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const removeFromPortfolio = (id: string, timestamp: number) => {
    setPortfolio(prev => prev.filter(item => !(item.id === id && item.timestamp === timestamp)));
  };

  const resetForm = () => {
    setSelectedCoin(null);
    setQuantity('');
    setPurchasePrice('');
    setSearchTerm('');
    setSearchResults([]);
  };

  const calculateTotalValue = () => {
    return portfolio.reduce((total, item) => {
      return total + (item.quantity * item.currentPrice);
    }, 0);
  };

  const calculateTotalCost = () => {
    return portfolio.reduce((total, item) => {
      return total + (item.quantity * item.purchasePrice);
    }, 0);
  };

  const calculateTotalProfit = () => {
    const totalValue = calculateTotalValue();
    const totalCost = calculateTotalCost();
    return totalValue - totalCost;
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Navbar is now handled in layout.tsx */}
        {/* <Navbar /> */}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Portfolio Summary */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Value</h3>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    ${calculateTotalValue().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Cost</h3>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    ${calculateTotalCost().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Profit/Loss</h3>
                  <p className={`mt-2 text-3xl font-bold ${
                    calculateTotalProfit() >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${Math.abs(calculateTotalProfit()).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    {calculateTotalProfit() >= 0 ? ' ↑' : ' ↓'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio Actions */}
          <div className="mb-8">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add New Coin
            </button>
          </div>

          {/* Portfolio List */}
          <div className="grid grid-cols-1 gap-6">
            {portfolio.map((item) => {
              const profitLoss = (item.currentPrice - item.purchasePrice) * item.quantity;
              const profitLossPercentage = ((item.currentPrice - item.purchasePrice) / item.purchasePrice) * 100;

              return (
                <div key={`${item.id}-${item.timestamp}`} className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-12 h-12">
                          <Image
                            src={item.image}
                            alt={`${item.name} logo`}
                            fill
                            className="rounded-full"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {item.name} ({item.symbol.toUpperCase()})
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromPortfolio(item.id, item.timestamp)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Purchase Price</p>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                          ${item.purchasePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Current Price</p>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                          ${item.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Profit/Loss</p>
                        <p className={`text-lg font-medium ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${Math.abs(profitLoss).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          {' '}
                          ({Math.abs(profitLossPercentage).toFixed(2)}%{profitLoss >= 0 ? ' ↑' : ' ↓'})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {portfolio.length === 0 && (
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No coins in portfolio</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Get started by adding a new coin to your portfolio.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add New Coin
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Add Coin Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    onClick={() => {
                      setIsAddModalOpen(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Add New Coin
                    </h3>
                    <div className="mt-4">
                      <div className="mb-4">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Search Coin
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="search"
                            className="input"
                            value={searchTerm}
                            onChange={(e) => {
                              setSearchTerm(e.target.value);
                              searchCoins(e.target.value);
                            }}
                            placeholder="Search by name or symbol"
                          />
                        </div>
                        {loading && (
                          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Searching...
                          </div>
                        )}
                        {error && (
                          <div className="mt-2 text-sm text-red-600">
                            {error}
                          </div>
                        )}
                        {searchResults.length > 0 && !selectedCoin && (
                          <ul className="mt-2 border border-gray-200 dark:border-gray-700 rounded-md divide-y divide-gray-200 dark:divide-gray-700">
                            {searchResults.map((coin) => (
                              <li
                                key={coin.id}
                                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                onClick={() => {
                                  setSelectedCoin(coin);
                                  setSearchTerm('');
                                  setSearchResults([]);
                                }}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="relative w-8 h-8">
                                    <Image
                                      src={coin.image}
                                      alt={`${coin.name} logo`}
                                      fill
                                      className="rounded-full"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                      {coin.name}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      {coin.symbol.toUpperCase()}
                                    </p>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      {selectedCoin && (
                        <>
                          <div className="mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="relative w-8 h-8">
                                <Image
                                  src={selectedCoin.image}
                                  alt={`${selectedCoin.name} logo`}
                                  fill
                                  className="rounded-full"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {selectedCoin.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {selectedCoin.symbol.toUpperCase()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="mb-4">
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Quantity
                            </label>
                            <div className="mt-1">
                              <input
                                type="number"
                                id="quantity"
                                className="input"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                min="0"
                                step="any"
                                placeholder="Enter quantity"
                              />
                            </div>
                          </div>
                          <div className="mb-4">
                            <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Purchase Price (USD)
                            </label>
                            <div className="mt-1">
                              <input
                                type="number"
                                id="purchasePrice"
                                className="input"
                                value={purchasePrice}
                                onChange={(e) => setPurchasePrice(e.target.value)}
                                min="0"
                                step="any"
                                placeholder="Enter purchase price"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={addToPortfolio}
                    disabled={!selectedCoin || !quantity || !purchasePrice}
                  >
                    Add to Portfolio
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </RequireAuth>
  );
} 