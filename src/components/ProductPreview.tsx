
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ExternalLink, Eye } from 'lucide-react';
import { ProductSpecs } from '@/components/ProductSpecs';
import { InteractivePriceChart } from '@/components/InteractivePriceChart';

interface ProductPreviewProps {
  productData: any;
  extractedData?: any;
}

export const ProductPreview = ({ productData, extractedData }: ProductPreviewProps) => {
  const data = extractedData || productData;
  
  if (!data) {
    return (
      <Card className="shadow-lg h-96 flex items-center justify-center dark:bg-gray-800 dark:border-gray-700">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No product data available</p>
          <p className="text-sm">Process a product URL to see the preview</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{data.title}</CardTitle>
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(data.rating || 0) ? 'fill-yellow-300 text-yellow-300' : 'text-yellow-300/50'}`} 
                  />
                ))}
              </div>
              <span className="text-yellow-100">{data.rating}/5</span>
              <span className="text-yellow-100">({data.reviews} reviews)</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{data.currentPrice || data.price}</div>
            {data.originalPrice && data.originalPrice !== data.currentPrice && (
              <div className="flex items-center text-yellow-200">
                <span className="line-through text-sm mr-2">{data.originalPrice}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Product Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Product Overview</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{data.description}</p>
          </div>

          {/* Key Features */}
          {data.keyFeatures && (
            <div>
              <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Key Features</h4>
              <ul className="space-y-2">
                {data.keyFeatures.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specs and Price History */}
          <div className="grid lg:grid-cols-2 gap-6">
            {data.specs && <ProductSpecs specs={data.specs} />}
            {data.priceHistory && (
              <InteractivePriceChart 
                priceHistory={data.priceHistory} 
                title={data.title}
              />
            )}
          </div>

          {/* Purchase Links */}
          {data.stores && (
            <div className="flex flex-wrap gap-3 pt-4">
              {data.stores.map((store: any) => (
                <Button 
                  key={store.name}
                  variant="outline" 
                  className="flex items-center space-x-2 hover:bg-orange-50 hover:border-orange-300 dark:hover:bg-orange-900/20 dark:border-gray-600 dark:text-gray-300"
                  onClick={() => window.open(store.url, '_blank')}
                >
                  <span>Buy on {store.name}</span>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
