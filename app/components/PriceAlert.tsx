'use client';

import React, { useState } from 'react';

interface PriceAlertProps {
  currentPrice: number;
  onSetAlert: (price: number, type: 'above' | 'below') => void;
}

const PriceAlert: React.FC<PriceAlertProps> = ({ currentPrice, onSetAlert }) => {
  const [alertPrice, setAlertPrice] = useState('');
  const [alertType, setAlertType] = useState<'above' | 'below'>('above');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(alertPrice);
    if (!isNaN(price) && price > 0) {
      onSetAlert(price, alertType);
      setAlertPrice('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Set Price Alert</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alert when price goes
          </label>
          <select
            value={alertType}
            onChange={(e) => setAlertType(e.target.value as 'above' | 'below')}
            className="w-full p-2 border rounded"
          >
            <option value="above">Above</option>
            <option value="below">Below</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price (USD)
          </label>
          <input
            type="number"
            value={alertPrice}
            onChange={(e) => setAlertPrice(e.target.value)}
            placeholder={`Current price: $${currentPrice.toLocaleString()}`}
            className="w-full p-2 border rounded"
            step="0.01"
            min="0"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Set Alert
        </button>
      </form>
    </div>
  );
};

export default PriceAlert; 