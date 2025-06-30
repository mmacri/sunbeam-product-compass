
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RapidApiProduct } from '@/types/rapidApi';
import { ProductDescription } from './ProductDescription';
import { ProductBadges } from './ProductBadges';
import { ProductDetails } from './ProductDetails';
import { ProductPricing } from './ProductPricing';
import { ProductRating } from './ProductRating';

interface ProductCardProps {
  product: RapidApiProduct;
  isSelected: boolean;
  onToggleSelection: (asin: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelected,
  onToggleSelection
}) => {
  return (
    <Card 
      className={`shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
      }`}
      onClick={() => onToggleSelection(product.asin)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <input
              type="checkbox"
              className="h-5 w-5 rounded text-blue-500 focus:ring-blue-500"
              checked={isSelected}
              onChange={() => onToggleSelection(product.asin)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Product Image */}
            {product.product_photo && (
              <img 
                src={product.product_photo} 
                alt={product.product_title || 'Product image'}
                className="w-24 h-24 object-cover rounded mb-3 float-right ml-3"
              />
            )}
            
            {/* Product Title */}
            <h3 className="text-sm font-semibold line-clamp-2 mb-2">
              {product.product_title || 'Untitled Product'}
            </h3>
            
            <ProductDescription product={product} />
            <ProductPricing product={product} />
            <ProductRating product={product} />
            <ProductBadges product={product} />
            <ProductDetails product={product} />

            {/* ASIN */}
            <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
              <strong>ASIN:</strong> {product.asin || 'N/A'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
