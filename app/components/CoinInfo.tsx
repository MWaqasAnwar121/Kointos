import React from 'react';
import { formatCurrency } from '../utils/format';

interface CoinInfoProps {
  name: string;
  symbol: string;
  price: number;
  volume24h: number;
  marketCap: number;
  priceChange24h: number;
}

const CoinInfo: React.FC<CoinInfoProps> = ({
  name,
  symbol,
  price,
  volume24h,
  marketCap,
  priceChange24h,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{name} ({symbol.toUpperCase()})</h2>
        <span className={`text-lg font-semibold ${priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {priceChange24h.toFixed(2)}%
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-gray-600 text-sm">Price</h3>
          <p className="text-xl font-bold">{formatCurrency(price)}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-gray-600 text-sm">24h Volume</h3>
          <p className="text-xl font-bold">{formatCurrency(volume24h)}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-gray-600 text-sm">Market Cap</h3>
          <p className="text-xl font-bold">{formatCurrency(marketCap)}</p>
        </div>
      </div>
    </div>
  );
};

export default CoinInfo; 