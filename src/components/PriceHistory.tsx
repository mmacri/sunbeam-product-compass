
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface PricePoint {
  date: string;
  price: string;
  store: string;
}

interface PriceHistoryProps {
  priceHistory: PricePoint[];
}

export const PriceHistory = ({ priceHistory }: PriceHistoryProps) => {
  const getTrendIcon = (index: number) => {
    if (index === 0) return <Minus className="w-4 h-4 text-gray-500" />;
    
    const current = parseFloat(priceHistory[index].price.replace('$', ''));
    const previous = parseFloat(priceHistory[index - 1].price.replace('$', ''));
    
    if (current < previous) {
      return <TrendingDown className="w-4 h-4 text-green-500" />;
    } else if (current > previous) {
      return <TrendingUp className="w-4 h-4 text-red-500" />;
    }
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getTrendColor = (index: number) => {
    if (index === 0) return 'bg-gray-50 text-gray-700 border-gray-200';
    
    const current = parseFloat(priceHistory[index].price.replace('$', ''));
    const previous = parseFloat(priceHistory[index - 1].price.replace('$', ''));
    
    if (current < previous) {
      return 'bg-green-50 text-green-700 border-green-200';
    } else if (current > previous) {
      return 'bg-red-50 text-red-700 border-red-200';
    }
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg">
          <TrendingDown className="w-5 h-5 text-green-500" />
          <span>Price History</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {priceHistory.map((point, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                {getTrendIcon(index)}
                <div>
                  <p className="font-medium text-gray-900">{point.date}</p>
                  <p className="text-sm text-gray-500">{point.store}</p>
                </div>
              </div>
              <Badge variant="secondary" className={getTrendColor(index)}>
                {point.price}
              </Badge>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-700">
            <strong>💡 Price Alert:</strong> Current price is at a 30-day low! 
            Consider purchasing soon as prices may increase.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
