
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface PricePoint {
  date: string;
  price: string;
  store: string;
}

interface InteractivePriceChartProps {
  priceHistory: PricePoint[];
  title: string;
}

export const InteractivePriceChart = ({ priceHistory, title }: InteractivePriceChartProps) => {
  const chartData = priceHistory.map(point => ({
    date: new Date(point.date).toLocaleDateString(),
    price: parseFloat(point.price.replace('$', '')),
    store: point.store,
    displayPrice: point.price
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-green-600 dark:text-green-400">
            Price: {data.displayPrice}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Store: {data.store}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg dark:text-gray-100">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <span>Price History - {title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-600" />
              <XAxis 
                dataKey="date" 
                className="dark:text-gray-300"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="dark:text-gray-300"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>💡 Price Insight:</strong> Track price trends across multiple stores. 
            Set up alerts for your target price points.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
