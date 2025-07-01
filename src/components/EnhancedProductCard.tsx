
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  ExternalLink, 
  ShoppingCart, 
  Truck, 
  Award, 
  Leaf, 
  Tag, 
  DollarSign,
  Users,
  Check,
  Zap
} from 'lucide-react';
import { RapidApiProduct } from '@/types/rapidApi';

interface EnhancedProductCardProps {
  product: RapidApiProduct;
  onProductClick: (asin: string) => void;
}

export const EnhancedProductCard: React.FC<EnhancedProductCardProps> = ({
  product,
  onProductClick
}) => {
  const getAffiliateUrl = (asin: string) => {
    return `http://www.amazon.com/dp/${asin}/ref=nosim?tag=homefitrecove-20`;
  };

  const formatPrice = (price: string) => price || 'N/A';

  const formatRating = (rating: string, numRatings: number) => (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${
              i < Math.floor(parseFloat(rating || '0')) 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            }`} 
          />
        ))}
      </div>
      <span className="font-medium">{rating || 'N/A'}</span>
      <span className="text-gray-500 text-sm">({numRatings?.toLocaleString() || 0})</span>
    </div>
  );

  const calculateSavings = () => {
    if (product.product_original_price && product.product_price) {
      const original = parseFloat(product.product_original_price.replace(/[^0-9.]/g, ''));
      const current = parseFloat(product.product_price.replace(/[^0-9.]/g, ''));
      if (original > current) {
        const savings = original - current;
        const percentage = ((savings / original) * 100).toFixed(0);
        return { amount: `$${savings.toFixed(2)}`, percentage: `${percentage}%` };
      }
    }
    return null;
  };

  const savings = calculateSavings();

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 hover:border-orange-200 dark:hover:border-orange-700">
      {/* Hero Section with Image and Badges */}
      <div className="relative">
        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center p-6">
          <img
            src={product.product_photo}
            alt={product.product_title}
            className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.is_best_seller && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
              <Award className="w-3 h-3 mr-1" />
              #1 Best Seller
            </Badge>
          )}
          {product.is_amazon_choice && (
            <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
              <Zap className="w-3 h-3 mr-1" />
              Amazon's Choice
            </Badge>
          )}
        </div>

        {/* Savings Badge */}
        {savings && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg px-3 py-1 shadow-lg">
              Save {savings.percentage}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Product Title and Brand */}
        <div className="space-y-2">
          <h3 className="font-bold text-xl leading-tight text-gray-900 dark:text-gray-100 line-clamp-2 hover:text-orange-600 transition-colors">
            {product.product_title}
          </h3>
          {product.product_byline && (
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              by {product.product_byline}
            </p>
          )}
        </div>

        {/* Rating and Social Proof */}
        <div className="space-y-3">
          {formatRating(product.product_star_rating, product.product_num_ratings)}
          
          {product.sales_volume && (
            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
              <Users className="w-4 h-4" />
              <span className="font-medium">{product.sales_volume}</span>
            </div>
          )}
        </div>

        {/* Pricing Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                {formatPrice(product.product_price)}
              </span>
              {product.product_original_price && 
                product.product_original_price !== product.product_price && (
                <div className="flex flex-col">
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.product_original_price)}
                  </span>
                  {savings && (
                    <span className="text-sm text-green-600 font-medium">
                      Save {savings.amount}
                    </span>
                  )}
                </div>
              )}
            </div>
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          
          {product.unit_count > 1 && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatPrice(product.unit_price)} per unit • {product.unit_count} units total
            </p>
          )}
        </div>

        {/* Special Offers */}
        {product.coupon_text && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-700">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <Tag className="w-4 h-4" />
              <span className="font-medium text-sm">{product.coupon_text}</span>
            </div>
          </div>
        )}

        {/* Features and Benefits */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            Key Benefits
          </h4>
          
          <div className="flex flex-wrap gap-2">
            {product.is_prime && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                <Truck className="w-3 h-3 mr-1" />
                Prime Delivery
              </Badge>
            )}
            {product.climate_pledge_friendly && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                <Leaf className="w-3 h-3 mr-1" />
                Eco-Friendly
              </Badge>
            )}
            {product.product_badge && (
              <Badge variant="outline" className="border-orange-200 text-orange-700 dark:border-orange-700 dark:text-orange-300">
                {product.product_badge}
              </Badge>
            )}
          </div>
        </div>

        {/* Product Details */}
        {(product.product_availability || product.delivery) && (
          <div className="space-y-2 text-sm">
            {product.product_availability && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <Check className="w-4 h-4" />
                <span>{product.product_availability}</span>
              </div>
            )}
            {product.delivery && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Truck className="w-4 h-4" />
                <span>{product.delivery}</span>
              </div>
            )}
          </div>
        )}

        {/* Technical Specs (if available) */}
        {(product.standing_screen_display_size || product.memory_storage_capacity || product.ram_memory_installed_size) && (
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-2">Specifications</h4>
            <div className="grid grid-cols-1 gap-1 text-xs text-gray-600 dark:text-gray-400">
              {product.standing_screen_display_size && (
                <div><strong>Display:</strong> {product.standing_screen_display_size}</div>
              )}
              {product.memory_storage_capacity && (
                <div><strong>Storage:</strong> {product.memory_storage_capacity}</div>
              )}
              {product.ram_memory_installed_size && (
                <div><strong>RAM:</strong> {product.ram_memory_installed_size}</div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
            onClick={() => window.open(getAffiliateUrl(product.asin), '_blank')}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Buy Now - Best Price
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 dark:border-orange-700 dark:hover:bg-orange-900/20"
            onClick={() => onProductClick(product.asin)}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Full Details
          </Button>
        </div>

        {/* Additional Info */}
        <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span>ASIN: {product.asin}</span>
            {product.product_num_offers > 1 && (
              <span>{product.product_num_offers} offers available</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
