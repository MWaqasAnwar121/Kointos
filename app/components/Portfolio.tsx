'use client';

import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/format';

interface PortfolioItem {
  id: string;
  amount: number;
  price: number;
}

interface PortfolioProps {
  coins: { id: string; name: string; current_price: number }[];
}

const Portfolio: React.FC<PortfolioProps> = ({ coins }) => {
  const [holdings, setHoldings] = useState<PortfolioItem[]>([]);
  const [selectedCoin, setSelectedCoin] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    // Load saved portfolio from localStorage
    const savedPortfolio = localStorage.getItem('cryptoPortfolio');
    if (savedPortfolio) {
      setHoldings(JSON.parse(savedPortfolio));
    }
  }, []);

  useEffect(() => {
    // Save portfolio to localStorage when it changes
    localStorage.setItem('cryptoPortfolio', JSON.stringify(holdings));
  }, [holdings]);

  const handleAddHolding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoin || !amount) return;

    const coin = coins.find(c => c.id === selectedCoin);
    if (!coin) return;

    const newHolding: PortfolioItem = {
      id: selectedCoin,
      amount: parseFloat(amount),
      price: coin.current_price,
    };

    setHoldings(prev => [...prev, newHolding]);
    setSelectedCoin('');
    setAmount('');
  };

  const handleRemoveHolding = (id: string) => {
    setHoldings(prev => prev.filter(h => h.id !== id));
  };

  const calculateTotalValue = () => {
    return holdings.reduce((total, holding) => {
      const coin = coins.find(c => c.id === holding.id);
      return total + (coin?.current_price || 0) * holding.amount;
    }, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Your Portfolio</h2>
      
      <form onSubmit={handleAddHolding} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Coin
            </label>
            <select
              value={selectedCoin}
              onChange={(e) => setSelectedCoin(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Choose a coin</option>
              {coins.map(coin => (
                <option key={coin.id} value={coin.id}>
                  {coin.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full p-2 border rounded"
              step="0.00000001"
              min="0"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add to Portfolio
        </button>
      </form>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Total Value: {formatCurrency(calculateTotalValue())}</h3>
        
        <div className="space-y-4">
          {holdings.map(holding => {
            const coin = coins.find(c => c.id === holding.id);
            if (!coin) return null;

            const currentValue = coin.current_price * holding.amount;
            const initialValue = holding.price * holding.amount;
            const profitLoss = currentValue - initialValue;
            const profitLossPercentage = (profitLoss / initialValue) * 100;

            return (
              <div key={holding.id} className="border-b pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{coin.name}</h4>
                    <p className="text-sm text-gray-500">
                      {holding.amount} {coin.name} • {formatCurrency(currentValue)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {profitLoss >= 0 ? '+' : ''}{formatCurrency(profitLoss)}
                    </p>
                    <p className={`text-sm ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {profitLossPercentage.toFixed(2)}%
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveHolding(holding.id)}
                  className="mt-2 text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Portfolio; 