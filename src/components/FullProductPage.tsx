
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Star, ShoppingCart, Truck, Award, Leaf } from 'lucide-react';
import { RapidApiProduct } from '@/types/rapidApi';

interface FullProductPageProps {
  product: RapidApiProduct;
  onBack: () => void;
}

export const FullProductPage: React.FC<FullProductPageProps> = ({ product, onBack }) => {
  const formatPrice = (price: string) => price || 'N/A';
  
  const formatRating = (rating: string, numRatings: number) => (
    <div className="flex items-center gap-1">
      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      <span className="font-medium">{rating || 'N/A'}</span>
      <span className="text-gray-500">({numRatings?.toLocaleString() || 0} reviews)</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-8">
        <Button onClick={onBack} variant="outline" className="mb-6">
          ← Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <Card>
            <CardContent className="p-6">
              <img
                src={product.product_photo}
                alt={product.product_title}
                className="w-full max-w-md mx-auto rounded-lg shadow-lg"
              />
            </CardContent>
          </Card>

          {/* Product Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{product.product_title}</CardTitle>
                {product.product_byline && (
                  <p className="text-gray-600 dark:text-gray-400">{product.product_byline}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price Section */}
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-green-600">
                      {formatPrice(product.product_price)}
                    </span>
                    {product.product_original_price && 
                      product.product_original_price !== product.product_price && (
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(product.product_original_price)}
                      </span>
                    )}
                  </div>
                  {product.unit_count > 1 && (
                    <p className="text-sm text-gray-600 mt-1">
                      {formatPrice(product.unit_price)} per unit ({product.unit_count} units)
                    </p>
                  )}
                  {product.coupon_text && (
                    <div className="mt-2 p-2 bg-green-100 dark:bg-green-800 rounded text-green-800 dark:text-green-200 text-sm font-medium">
                      {product.coupon_text}
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4">
                  {formatRating(product.product_star_rating, product.product_num_ratings)}
                  {product.sales_volume && (
                    <span className="text-blue-600 font-medium">{product.sales_volume}</span>
                  )}
                </div>

                {/* Special Features */}
                <div className="flex flex-wrap gap-2">
                  {product.is_best_seller && (
                    <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                      <Award className="w-3 h-3 mr-1" />
                      Best Seller
                    </Badge>
                  )}
                  {product.is_amazon_choice && (
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      <Star className="w-3 h-3 mr-1" />
                      Amazon's Choice
                    </Badge>
                  )}
                  {product.is_prime && (
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      <Truck className="w-3 h-3 mr-1" />
                      Prime
                    </Badge>
                  )}
                  {product.climate_pledge_friendly && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <Leaf className="w-3 h-3 mr-1" />
                      Climate Pledge Friendly
                    </Badge>
                  )}
                </div>

                {/* Purchase Button */}
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                  onClick={() => window.open(product.product_url, '_blank')}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Buy on Amazon
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>ASIN:</strong> {product.asin}</div>
                <div><strong>Currency:</strong> {product.currency}</div>
                <div><strong>Available Offers:</strong> {product.product_num_offers}</div>
                <div><strong>Min Offer Price:</strong> {formatPrice(product.product_minimum_offer_price)}</div>
                <div><strong>Availability:</strong> {product.product_availability || 'In Stock'}</div>
                <div><strong>Has Variations:</strong> {product.has_variations ? 'Yes' : 'No'}</div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping & Delivery */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping & Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">{product.delivery}</p>
              {product.is_prime && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800 dark:text-blue-200">Prime Eligible</span>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                    Fast, free delivery available with Amazon Prime membership
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
