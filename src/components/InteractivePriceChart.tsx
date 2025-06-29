
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown } from 'lucide-react';

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
    date: point.date,
    price: parseFloat(point.price.replace('$', '')),
    store: point.store,
    formattedPrice: point.price
  }));

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg dark:text-gray-100">
          <TrendingDown className="w-5 h-5 text-green-500" />
          <span>Price History</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="dark:opacity-30" />
              <XAxis 
                dataKey="date" 
                className="dark:text-gray-300" 
                fontSize={12}
              />
              <YAxis 
                className="dark:text-gray-300" 
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value: number, name: string, props: any) => [
                  `$${value}`, 
                  `${props.payload.store}`
                ]}
                labelStyle={{ color: 'var(--foreground)' }}
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#f97316" 
                strokeWidth={2}
                dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 2, fill: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <p className="text-sm text-orange-700 dark:text-orange-300">
            <strong>💡 Price Alert:</strong> Track price trends for {title}. Current price shows good value compared to historical data.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
