
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ExternalLink, TrendingUp, AlertCircle } from 'lucide-react';

interface ProductPreviewProps {
  productData: any;
  extractedData: any;
}

export const ProductPreview: React.FC<ProductPreviewProps> = ({ 
  productData, 
  extractedData 
}) => {
  const data = productData || extractedData;
  
  if (!data) {
    return (
      <Card className="shadow-lg h-96 flex items-center justify-center dark:bg-gray-800 dark:border-gray-700">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No product data available</p>
          <p className="text-sm">Process a product URL to see the preview</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">{data.title}</span>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {data.category}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Price Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-bold text-green-600 dark:text-green-400">
              {data.currentPrice}
            </span>
            {data.originalPrice && (
              <span className="text-lg text-gray-500 line-through">
                {data.originalPrice}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{data.rating}</span>
            <span className="text-gray-500">({data.reviews} reviews)</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Description</h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* Key Features */}
        {data.keyFeatures && data.keyFeatures.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Key Features</h3>
            <ul className="space-y-1">
              {data.keyFeatures.map((feature: string, index: number) => (
                <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Specifications */}
        {data.specs && Object.keys(data.specs).length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {Object.entries(data.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">{key}:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{value as string}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price History */}
        {data.priceHistory && data.priceHistory.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Recent Price History
            </h3>
            <div className="space-y-2">
              {data.priceHistory.slice(0, 3).map((entry: any, index: number) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{entry.date}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{entry.price}</span>
                    <Badge variant="outline" className="text-xs">
                      {entry.store}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button 
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            onClick={() => window.open('#', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Product
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => console.log('Generate review clicked')}
          >
            Generate Review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
