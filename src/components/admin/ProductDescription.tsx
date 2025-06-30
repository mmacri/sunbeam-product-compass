
import React from 'react';
import { Eye, Info } from 'lucide-react';
import { RapidApiProduct } from '@/types/rapidApi';

interface ProductDescriptionProps {
  product: RapidApiProduct;
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({ product }) => {
  const generateProductDescription = (product: RapidApiProduct): string => {
    const descriptions = [];
    
    // Add main product description if available
    if (product.product_description) {
      descriptions.push(product.product_description.substring(0, 200) + '...');
    }
    
    // Add key features from about_product
    if (product.about_product && product.about_product.length > 0) {
      descriptions.push(`Key features: ${product.about_product.slice(0, 2).join('. ')}.`);
    }
    
    // Add customer feedback if available
    if (product.customers_say) {
      descriptions.push(`Customer feedback: ${product.customers_say.substring(0, 150)}...`);
    }
    
    // Fallback description
    if (descriptions.length === 0) {
      const features = [];
      if (product.is_best_seller) features.push('Best Seller');
      if (product.is_amazon_choice) features.push('Amazon\'s Choice');
      if (product.is_prime) features.push('Prime eligible');
      if (product.climate_pledge_friendly) features.push('Eco-friendly');
      
      descriptions.push(`${product.product_title} - ${features.length > 0 ? features.join(', ') + '. ' : ''}High-quality product with excellent customer reviews.`);
    }
    
    return descriptions.join(' ');
  };

  const getProductOverview = (product: RapidApiProduct): string => {
    const overview = [];
    
    if (product.product_star_rating && parseFloat(product.product_star_rating) > 4) {
      overview.push('Highly rated');
    }
    
    if (product.product_num_ratings && product.product_num_ratings > 1000) {
      overview.push('Popular choice');
    }
    
    if (product.is_best_seller) overview.push('Best Seller');
    if (product.is_amazon_choice) overview.push('Amazon\'s Choice');
    if (product.sales_volume) overview.push(product.sales_volume);
    
    return overview.length > 0 ? overview.join(' • ') : 'Quality product';
  };

  return (
    <>
      {/* Product Overview */}
      <div className="flex items-center gap-1 mb-2 text-xs text-blue-600">
        <Eye className="w-3 h-3" />
        <span>{getProductOverview(product)}</span>
      </div>
      
      {/* Product Description */}
      <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
        <div className="flex items-center gap-1 mb-1">
          <Info className="w-3 h-3 text-gray-500" />
          <span className="font-medium text-gray-700 dark:text-gray-300">Description:</span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {generateProductDescription(product)}
        </p>
      </div>
    </>
  );
};
