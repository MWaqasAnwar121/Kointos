'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CoinCardProps {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  image: string;
}

export default function CoinCard({
  id,
  name,
  symbol,
  price,
  priceChange24h,
  marketCap,
  volume24h,
  image,
}: CoinCardProps) {
  return (
    <Link href={`/coin/${id}`}>
      <div className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <div className="card-body">
          <div className="flex items-center space-x-4">
            <div className="relative w-12 h-12">
              <Image
                src={image}
                alt={`${name} logo`}
                fill
                sizes="3rem"
                className="rounded-full"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {name} ({symbol.toUpperCase()})
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className={`text-sm font-semibold ${priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {priceChange24h >= 0 ? '↑' : '↓'} {Math.abs(priceChange24h).toFixed(2)}%
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Market Cap</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    ${marketCap.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">24h Volume</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    ${volume24h.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 