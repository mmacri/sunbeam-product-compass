
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Prime, Award, Leaf } from 'lucide-react';
import { RapidApiProduct } from '@/types/rapidApi';

interface ProductBrowserGridProps {
  products: RapidApiProduct[];
  selectedAsins: string[];
  onToggleSelection: (asin: string) => void;
}

export const ProductBrowserGrid: React.FC<ProductBrowserGridProps> = ({
  products,
  selectedAsins,
  onToggleSelection
}) => {
  const isSelected = (asin: string): boolean => {
    return selectedAsins.includes(asin);
  };

  if (products.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-500 dark:text-gray-400">
          <p className="text-lg font-medium mb-2">No products loaded</p>
          <p className="text-sm">Use "Load Best Sellers" or search for products to get started.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card 
          key={product.asin} 
          className={`shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer ${
            isSelected(product.asin) ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
          }`}
          onClick={() => onToggleSelection(product.asin)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded text-blue-500 focus:ring-blue-500"
                  checked={isSelected(product.asin)}
                  onChange={() => onToggleSelection(product.asin)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                {product.product_photo && (
                  <img 
                    src={product.product_photo} 
                    alt={product.product_title}
                    className="w-16 h-16 object-cover rounded mb-3 float-right ml-3"
                  />
                )}
                
                <h3 className="text-sm font-semibold line-clamp-2 mb-2">
                  {product.product_title}
                </h3>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-green-600">
                    {product.product_price}
                  </span>
                  {product.product_original_price && product.product_original_price !== product.product_price && (
                    <span className="text-sm text-gray-500 line-through">
                      {product.product_original_price}
                    </span>
                  )}
                </div>

                {product.product_star_rating && (
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.product_star_rating}</span>
                    <span className="text-xs text-gray-500">
                      ({product.product_num_ratings || 0} reviews)
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap gap-1 mb-2">
                  {product.is_best_seller && (
                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                      <Award className="w-3 h-3 mr-1" />
                      Best Seller
                    </Badge>
                  )}
                  {product.is_amazon_choice && (
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                      Amazon's Choice
                    </Badge>
                  )}
                  {product.is_prime && (
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                      <Prime className="w-3 h-3 mr-1" />
                      Prime
                    </Badge>
                  )}
                  {product.climate_pledge_friendly && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      <Leaf className="w-3 h-3 mr-1" />
                      Eco-Friendly
                    </Badge>
                  )}
                </div>

                {product.coupon_text && (
                  <div className="text-xs text-green-600 font-medium">
                    {product.coupon_text}
                  </div>
                )}

                <div className="text-xs text-gray-500 mt-2">
                  ASIN: {product.asin}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
