import React, { useState } from 'react';
import Select from 'react-select';

interface CoinOption {
  value: string;
  label: string;
}

interface SearchAndFilterProps {
  coins: CoinOption[];
  onSearch: (query: string) => void;
  onFilter: (filters: {
    minPrice?: number;
    maxPrice?: number;
    marketCap?: string;
  }) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  coins,
  onSearch,
  onFilter,
}) => {
  const [selectedCoin, setSelectedCoin] = useState<CoinOption | null>(null);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    marketCap: '',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterSubmit = () => {
    onFilter({
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      marketCap: filters.marketCap,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Coins
          </label>
          <Select
            options={coins}
            value={selectedCoin}
            onChange={(newValue: CoinOption | null) => {
              setSelectedCoin(newValue);
              onSearch(newValue?.label || '');
            }}
            placeholder="Search coins..."
            className="basic-single"
            classNamePrefix="select"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min"
                className="w-1/2 p-2 border rounded"
              />
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max"
                className="w-1/2 p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Market Cap
            </label>
            <select
              name="marketCap"
              value={filters.marketCap}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All</option>
              <option value="large">Large Cap</option>
              <option value="mid">Mid Cap</option>
              <option value="small">Small Cap</option>
            </select>
          </div>

          <button
            onClick={handleFilterSubmit}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter; 