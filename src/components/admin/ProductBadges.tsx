
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Award, Zap, Leaf, Tag } from 'lucide-react';
import { RapidApiProduct } from '@/types/rapidApi';

interface ProductBadgesProps {
  product: RapidApiProduct;
}

export const ProductBadges: React.FC<ProductBadgesProps> = ({ product }) => {
  return (
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
          <Zap className="w-3 h-3 mr-1" />
          Prime
        </Badge>
      )}
      {product.climate_pledge_friendly && (
        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
          <Leaf className="w-3 h-3 mr-1" />
          Eco-Friendly
        </Badge>
      )}
      {product.product_badge && (
        <Badge variant="outline" className="text-xs">
          <Tag className="w-3 h-3 mr-1" />
          {product.product_badge}
        </Badge>
      )}
      {product.coupon_text && (
        <div className="text-xs text-green-600 font-medium mb-2 p-1 bg-green-50 rounded">
          🎟️ {product.coupon_text}
        </div>
      )}
    </div>
  );
};
