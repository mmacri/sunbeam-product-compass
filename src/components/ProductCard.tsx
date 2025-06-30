
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Star } from 'lucide-react';
import { ProductSpecs } from '@/components/ProductSpecs';
import { InteractivePriceChart } from '@/components/InteractivePriceChart';

interface ProductCardProps {
  product: {
    id: string | number;
    title: string;
    currentPrice: string;
    originalPrice: string;
    rating: number;
    reviews: number;
    description: string;
    keyFeatures: string[];
    specs: Record<string, string>;
    stores: Array<{ name: string; url: string }>;
    priceHistory: Array<{ date: string; price: string; store: string }>;
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const getAffiliateUrl = (originalUrl: string) => {
    // Try to extract ASIN from the original URL
    const asinMatch = originalUrl.match(/\/dp\/([A-Z0-9]{10})/i) || originalUrl.match(/\/gp\/product\/([A-Z0-9]{10})/i);
    if (asinMatch) {
      return `http://www.amazon.com/dp/${asinMatch[1]}/ref=nosim?tag=homefitrecove-20`;
    }
    // If we have an ASIN in the product specs, use that
    if (product.specs.ASIN) {
      return `http://www.amazon.com/dp/${product.specs.ASIN}/ref=nosim?tag=homefitrecove-20`;
    }
    // If we have the ID as ASIN format, use that
    if (typeof product.id === 'string' && product.id.length === 10 && /^[A-Z0-9]+$/.test(product.id)) {
      return `http://www.amazon.com/dp/${product.id}/ref=nosim?tag=homefitrecove-20`;
    }
    // Fallback to original URL
    return originalUrl;
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">{product.title}</CardTitle>
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-300 text-yellow-300' : 'text-yellow-300/50'}`} 
                  />
                ))}
              </div>
              <span className="text-yellow-100">{product.rating}/5</span>
              <span className="text-yellow-100">({product.reviews} reviews)</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{product.currentPrice}</div>
            {product.originalPrice !== product.currentPrice && (
              <div className="flex items-center text-yellow-200">
                <span className="line-through text-sm mr-2">{product.originalPrice}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Description */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Product Overview</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{product.description}</p>
            
            {/* Key Features */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Key Features</h4>
              <ul className="space-y-2">
                {product.keyFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Purchase Links with Affiliate URLs */}
            <div className="flex flex-wrap gap-3">
              {product.stores.map((store) => (
                <Button 
                  key={store.name}
                  variant="outline" 
                  className="flex items-center space-x-2 hover:bg-orange-50 hover:border-orange-300 dark:hover:bg-orange-900/20 dark:border-gray-600 dark:text-gray-300"
                  onClick={() => window.open(getAffiliateUrl(store.url), '_blank')}
                >
                  <span>Buy on {store.name}</span>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              ))}
            </div>
          </div>

          {/* Specs and Price History */}
          <div className="space-y-6">
            <ProductSpecs specs={product.specs} />
            <InteractivePriceChart 
              priceHistory={product.priceHistory} 
              title={product.title}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
