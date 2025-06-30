
import React from 'react';
import { Truck } from 'lucide-react';
import { RapidApiProduct } from '@/types/rapidApi';

interface ProductDetailsProps {
  product: RapidApiProduct;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  return (
    <>
      {/* Delivery Information */}
      {product.delivery && (
        <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
          <Truck className="w-3 h-3" />
          <span className="line-clamp-1">{product.delivery}</span>
        </div>
      )}

      {/* Brand/Byline */}
      {product.product_byline && (
        <div className="text-xs text-gray-600 mb-2">
          <strong>Brand:</strong> {product.product_byline}
        </div>
      )}

      {/* Product Slug for SEO */}
      {product.product_slug && (
        <div className="text-xs text-gray-500 mb-2">
          <strong>SEO Slug:</strong> {product.product_slug}
        </div>
      )}

      {/* Currency */}
      {product.currency && product.currency !== 'USD' && (
        <div className="text-xs text-gray-500 mb-2">
          Currency: {product.currency}
        </div>
      )}

      {/* Country */}
      {product.country && product.country !== 'US' && (
        <div className="text-xs text-gray-500 mb-2">
          Country: {product.country}
        </div>
      )}

      {/* Variations */}
      {product.has_variations && (
        <div className="text-xs text-blue-600 mb-2">
          ✨ Has variations available
        </div>
      )}

      {/* Additional Product Information */}
      <div className="text-xs text-gray-600 mb-2 space-y-1">
        {product.standing_screen_display_size && (
          <div><strong>Screen:</strong> {product.standing_screen_display_size}</div>
        )}
        {product.memory_storage_capacity && (
          <div><strong>Storage:</strong> {product.memory_storage_capacity}</div>
        )}
        {product.ram_memory_installed_size && (
          <div><strong>RAM:</strong> {product.ram_memory_installed_size}</div>
        )}
      </div>
    </>
  );
};
