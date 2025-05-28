import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

interface PriceData {
  timestamp: number;
  price: number;
}

interface PriceChartProps {
  data: PriceData[];
  timeRange: '1d' | '7d' | '30d' | '1y';
}

const PriceChart: React.FC<PriceChartProps> = ({ data, timeRange }) => {
  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp);
    switch (timeRange) {
      case '1d':
        return format(date, 'HH:mm');
      case '7d':
        return format(date, 'MMM dd');
      case '30d':
        return format(date, 'MMM dd');
      case '1y':
        return format(date, 'MMM yyyy');
      default:
        return format(date, 'MMM dd');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatXAxis}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={['auto', 'auto']}
            tickFormatter={(value: number) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            labelFormatter={(value: number) => format(new Date(value), 'PPpp')}
            formatter={(value: number) => [`$${Number(value).toLocaleString()}`, 'Price']}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart; 