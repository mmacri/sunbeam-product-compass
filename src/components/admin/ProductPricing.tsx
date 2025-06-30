
import React from 'react';
import { DollarSign, Package } from 'lucide-react';
import { RapidApiProduct } from '@/types/rapidApi';

interface ProductPricingProps {
  product: RapidApiProduct;
}

export const ProductPricing: React.FC<ProductPricingProps> = ({ product }) => {
  const formatPrice = (price: string) => {
    if (!price) return 'Price not available';
    return price.startsWith('$') ? price : `$${price}`;
  };

  return (
    <>
      {/* Price Information */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg font-bold text-green-600">
          {formatPrice(product.product_price)}
        </span>
        {product.product_original_price && product.product_original_price !== product.product_price && (
          <span className="text-sm text-gray-500 line-through">
            {formatPrice(product.product_original_price)}
          </span>
        )}
        {product.product_price_max && (
          <span className="text-xs text-blue-600">
            (Max: {formatPrice(product.product_price_max)})
          </span>
        )}
      </div>

      {/* Unit Price and Count */}
      {(product.unit_price || product.unit_count) && (
        <div className="flex items-center gap-2 mb-2 text-xs text-gray-600">
          {product.unit_price && (
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {product.unit_price}
            </span>
          )}
          {product.unit_count && (
            <span className="flex items-center gap-1">
              <Package className="w-3 h-3" />
              {product.unit_count} units
            </span>
          )}
        </div>
      )}

      {/* Sales Volume */}
      {product.sales_volume && (
        <div className="text-xs text-blue-600 mb-2 font-medium">
          📈 {product.sales_volume}
        </div>
      )}

      {/* Offers and Availability */}
      <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
        {product.product_num_offers && product.product_num_offers > 1 && (
          <div className="text-gray-600">
            <strong>{product.product_num_offers}</strong> offers
          </div>
        )}
        {product.product_minimum_offer_price && (
          <div className="text-gray-600">
            From {formatPrice(product.product_minimum_offer_price)}
          </div>
        )}
      </div>

      {/* Availability */}
      {product.product_availability && (
        <div className="text-xs text-gray-600 mb-2">
          <strong>Availability:</strong> {product.product_availability}
        </div>
      )}
    </>
  );
};
