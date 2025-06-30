
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Zap, Award, Leaf, Package, Truck, DollarSign, Info, Eye, Tag } from 'lucide-react';
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

  if (!products || products.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-500 dark:text-gray-400">
          <p className="text-lg font-medium mb-2">No products loaded</p>
          <p className="text-sm">Use "Load Best Sellers" or search for products to get started.</p>
        </div>
      </Card>
    );
  }

  const formatPrice = (price: string) => {
    if (!price) return 'Price not available';
    return price.startsWith('$') ? price : `$${price}`;
  };

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

                {/* Rating and Reviews */}
                {product.product_star_rating && (
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.product_star_rating}</span>
                    <span className="text-xs text-gray-500">
                      ({(product.product_num_ratings || 0).toLocaleString()} reviews)
                    </span>
                  </div>
                )}

                {/* Sales Volume */}
                {product.sales_volume && (
                  <div className="text-xs text-blue-600 mb-2 font-medium">
                    📈 {product.sales_volume}
                  </div>
                )}

                {/* Badges */}
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
                </div>

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

                {/* Coupon */}
                {product.coupon_text && (
                  <div className="text-xs text-green-600 font-medium mb-2 p-1 bg-green-50 rounded">
                    🎟️ {product.coupon_text}
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

                {/* ASIN */}
                <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
                  <strong>ASIN:</strong> {product.asin || 'N/A'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
