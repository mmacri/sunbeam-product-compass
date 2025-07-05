import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, TrendingDown, Users, DollarSign, Calendar, BarChart3 } from 'lucide-react';

interface DatabaseProduct {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  sale_price: number | null;
  rating: number | null;
  image_url: string | null;
  affiliate_url: string | null;
  asin: string | null;
  attributes: any;
  specifications: any;
  price_history: any;
  commission_rate: number | null;
  click_count: number | null;
  conversion_count: number | null;
  revenue_generated: number | null;
  api_last_updated: string | null;
  created_at: string;
  updated_at: string;
}

interface EnhancedProductCardProps {
  product: DatabaseProduct;
}

export const EnhancedProductCard: React.FC<EnhancedProductCardProps> = ({ product }) => {
  // Parse price history to find lowest price
  const getLowestPrice = () => {
    try {
      const priceHistory = Array.isArray(product.price_history) 
        ? product.price_history 
        : JSON.parse(product.price_history || '[]');
      if (priceHistory.length === 0) return null;
      return Math.min(...priceHistory.map((p: any) => p.price || 0));
    } catch {
      return null;
    }
  };

  // Parse attributes for additional info
  const getReviewCount = () => {
    return product.attributes?.product_num_ratings_parsed || 
           product.attributes?.originalCsvData?.product_num_ratings_parsed || 
           product.attributes?.product_num_ratings ||
           product.specifications?.num_ratings ||
           null;
  };

  const getSalesVolume = () => {
    return product.attributes?.sales_volume || 
           product.attributes?.originalCsvData?.sales_volume ||
           null;
  };

  const getDeliveryInfo = () => {
    return product.attributes?.delivery || 
           product.attributes?.originalCsvData?.delivery ||
           null;
  };

  // Get real reviews from specifications (stored from API)
  const getReviewData = () => {
    if (product.specifications) {
      return {
        review1Text: product.specifications.review_1_text || '',
        review1Title: product.specifications.review_1_title || '',
        review1Rating: product.specifications.review_1_rating || '',
        review2Text: product.specifications.review_2_text || '',
        review2Title: product.specifications.review_2_title || '',
        review2Rating: product.specifications.review_2_rating || '',
        totalReviews: product.specifications.total_reviews_fetched || 0
      };
    }
    return null;
  };

  const lowestPrice = getLowestPrice();
  const reviewCount = getReviewCount();
  const salesVolume = getSalesVolume();
  const deliveryInfo = getDeliveryInfo();
  const reviewData = getReviewData();

  const formatPrice = (price: number | null) => price ? `$${price.toFixed(2)}` : 'N/A';
  const formatNumber = (num: number | null | string) => {
    if (!num) return null;
    const numValue = typeof num === 'string' ? parseInt(num.replace(/[^0-9]/g, '')) : num;
    if (numValue >= 1000) {
      return `${(numValue / 1000).toFixed(1)}K`;
    }
    return numValue.toLocaleString();
  };

  const savingsAmount = product.sale_price && product.price 
    ? product.sale_price - product.price 
    : 0;

  const savingsPercent = product.sale_price && product.price && savingsAmount > 0
    ? Math.round((savingsAmount / product.sale_price) * 100)
    : 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:border-orange-200">
      {/* Product Image */}
      <div className="aspect-square bg-gray-50 flex items-center justify-center p-4 relative">
        <img
          src={product.image_url || '/placeholder.svg'}
          alt={product.name}
          className="max-w-full max-h-full object-contain"
        />
        {savingsPercent > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            {savingsPercent}% OFF
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4 space-y-4">
        {/* Product Title */}
        <h3 className="font-semibold text-sm leading-tight line-clamp-2">
          {product.name}
        </h3>
        
        {/* Product Description */}
        {product.description && (
          <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
        )}

        {/* Rating & Reviews */}
        <div className="flex items-center justify-between">
          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{product.rating.toFixed(1)}</span>
              {reviewCount && (
                <span className="text-xs text-gray-500">({formatNumber(reviewCount)} reviews)</span>
              )}
            </div>
          )}
          {salesVolume && (
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <Users className="w-3 h-3" />
              <span>{salesVolume}</span>
            </div>
          )}
        </div>

        {/* Price Information */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-green-600">
              {formatPrice(product.price)}
            </span>
            {product.sale_price && product.sale_price !== product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.sale_price)}
              </span>
            )}
            {savingsAmount > 0 && (
              <span className="text-xs text-red-600 font-medium">
                Save {formatPrice(savingsAmount)}
              </span>
            )}
          </div>
          
          {/* Lowest Price History */}
          {lowestPrice && lowestPrice < (product.price || 0) && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <TrendingDown className="w-3 h-3" />
              <span>Lowest: {formatPrice(lowestPrice)}</span>
            </div>
          )}
        </div>

        {/* Product Badges */}
        <div className="flex flex-wrap gap-1">
          {product.attributes?.is_best_seller && (
            <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
              Best Seller
            </Badge>
          )}
          {product.attributes?.is_amazon_choice && (
            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
              Amazon&apos;s Choice
            </Badge>
          )}
          {product.attributes?.is_prime && (
            <Badge variant="outline" className="text-xs">Prime</Badge>
          )}
          {product.attributes?.climate_pledge_friendly && (
            <Badge variant="outline" className="text-xs text-green-700">Eco-Friendly</Badge>
          )}
        </div>

        {/* Customer Reviews Section (Real API Data) */}
        {reviewData && (reviewData.review1Text || reviewData.review2Text) && (
          <div className="space-y-2 border-t pt-3">
            <h4 className="text-sm font-semibold text-gray-800">Customer Reviews</h4>
            {reviewData.review1Text && (
              <div className="bg-blue-50 p-3 rounded-lg">
                {reviewData.review1Title && (
                  <p className="font-medium text-sm text-blue-900 mb-1">{reviewData.review1Title}</p>
                )}
                <p className="text-xs text-blue-800 line-clamp-3">{reviewData.review1Text}</p>
                {reviewData.review1Rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-blue-700">{reviewData.review1Rating}/5</span>
                  </div>
                )}
              </div>
            )}
            {reviewData.review2Text && (
              <div className="bg-green-50 p-3 rounded-lg">
                {reviewData.review2Title && (
                  <p className="font-medium text-sm text-green-900 mb-1">{reviewData.review2Title}</p>
                )}
                <p className="text-xs text-green-800 line-clamp-3">{reviewData.review2Text}</p>
                {reviewData.review2Rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-green-700">{reviewData.review2Rating}/5</span>
                  </div>
                )}
              </div>
            )}
            {reviewData.totalReviews > 0 && (
              <p className="text-xs text-gray-500">
                📊 Total reviews fetched: {reviewData.totalReviews}
              </p>
            )}
          </div>
        )}

        {/* Delivery Information */}
        {deliveryInfo && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            📦 {deliveryInfo}
          </div>
        )}

        {/* Admin/Affiliate Information */}
        <div className="border-t pt-3 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            {product.commission_rate && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                <span>{product.commission_rate}% commission</span>
              </div>
            )}
            {product.click_count !== null && (
              <div className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                <span>{product.click_count} clicks</span>
              </div>
            )}
          </div>
          
          {product.api_last_updated && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>Updated: {new Date(product.api_last_updated).toLocaleDateString()}</span>
            </div>
          )}
          
          {product.revenue_generated && product.revenue_generated > 0 && (
            <div className="text-xs text-green-600 font-medium">
              💰 Revenue: ${product.revenue_generated.toFixed(2)}
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button
          className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
          onClick={() => product.affiliate_url && window.open(product.affiliate_url, '_blank')}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Buy Now - Best Price
        </Button>
      </CardContent>
    </Card>
  );
};