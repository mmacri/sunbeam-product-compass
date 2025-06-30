
import React from 'react';
import { Star } from 'lucide-react';
import { RapidApiProduct } from '@/types/rapidApi';

interface ProductRatingProps {
  product: RapidApiProduct;
}

export const ProductRating: React.FC<ProductRatingProps> = ({ product }) => {
  if (!product.product_star_rating) return null;

  return (
    <div className="flex items-center gap-1 mb-2">
      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      <span className="text-sm font-medium">{product.product_star_rating}</span>
      <span className="text-xs text-gray-500">
        ({(product.product_num_ratings || 0).toLocaleString()} reviews)
      </span>
    </div>
  );
};
