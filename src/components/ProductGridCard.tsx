
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';
import { RapidApiProduct } from '@/types/rapidApi';

interface ProductGridCardProps {
  product: RapidApiProduct;
  onProductClick: (asin: string) => void;
}

export const ProductGridCard: React.FC<ProductGridCardProps> = ({ product, onProductClick }) => {
  const formatPrice = (price: string) => price || 'N/A';

  const formatRating = (rating: string, numRatings: number) => (
    <div className="flex items-center gap-1">
      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      <span className="font-medium">{rating || 'N/A'}</span>
      <span className="text-gray-500 text-sm">({numRatings?.toLocaleString() || 0})</span>
    </div>
  );

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => onProductClick(product.asin)}
    >
      <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
        <img
          src={product.product_photo}
          alt={product.product_title}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2">
            {product.product_title}
          </h3>
          {product.product_byline && (
            <p className="text-xs text-gray-600 line-clamp-1">{product.product_byline}</p>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between">
          {formatRating(product.product_star_rating, product.product_num_ratings)}
          {product.sales_volume && (
            <span className="text-xs text-blue-600">{product.sales_volume}</span>
          )}
        </div>

        {/* Price */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-green-600">
              {formatPrice(product.product_price)}
            </span>
            {product.product_original_price && 
              product.product_original_price !== product.product_price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.product_original_price)}
              </span>
            )}
          </div>
          {product.unit_count > 1 && (
            <p className="text-xs text-gray-600">
              {formatPrice(product.unit_price)} per unit
            </p>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1">
          {product.is_best_seller && (
            <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
              Best Seller
            </Badge>
          )}
          {product.is_amazon_choice && (
            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
              Amazon's Choice
            </Badge>
          )}
          {product.is_prime && (
            <Badge variant="outline" className="text-xs">Prime</Badge>
          )}
          {product.climate_pledge_friendly && (
            <Badge variant="outline" className="text-xs">Eco-Friendly</Badge>
          )}
        </div>

        {/* Coupon */}
        {product.coupon_text && (
          <div className="text-xs text-green-600 font-medium bg-green-50 p-2 rounded">
            {product.coupon_text}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
            onClick={(e) => {
              e.stopPropagation();
              window.open(product.product_url, '_blank');
            }}
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            Buy Now
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onProductClick(product.asin);
            }}
          >
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
