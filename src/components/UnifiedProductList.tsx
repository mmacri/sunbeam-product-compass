
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Star, ExternalLink, ShoppingCart, Filter, List, Grid } from 'lucide-react';
import { RapidApiProduct } from '@/types/rapidApi';

interface UnifiedProductListProps {
  products: RapidApiProduct[];
  onProductClick: (asin: string) => void;
}

export const UnifiedProductList: React.FC<UnifiedProductListProps> = ({
  products,
  onProductClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating-desc');
  const [filterCategory, setFilterCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.product_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.product_byline && product.product_byline.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(product => {
        switch (filterCategory) {
          case 'best-sellers':
            return product.is_best_seller;
          case 'amazon-choice':
            return product.is_amazon_choice;
          case 'prime':
            return product.is_prime;
          case 'eco-friendly':
            return product.climate_pledge_friendly;
          default:
            return true;
        }
      });
    }

    // Price range filter
    if (priceRange !== 'all') {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.product_price.replace(/[^0-9.]/g, ''));
        switch (priceRange) {
          case 'under-25':
            return price < 25;
          case '25-50':
            return price >= 25 && price <= 50;
          case '50-100':
            return price >= 50 && price <= 100;
          case 'over-100':
            return price > 100;
          default:
            return true;
        }
      });
    }

    // Sort products
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return parseFloat(a.product_price.replace(/[^0-9.]/g, '')) - parseFloat(b.product_price.replace(/[^0-9.]/g, ''));
        case 'price-desc':
          return parseFloat(b.product_price.replace(/[^0-9.]/g, '')) - parseFloat(a.product_price.replace(/[^0-9.]/g, ''));
        case 'rating-desc':
          return parseFloat(b.product_star_rating || '0') - parseFloat(a.product_star_rating || '0');
        case 'rating-asc':
          return parseFloat(a.product_star_rating || '0') - parseFloat(b.product_star_rating || '0');
        case 'reviews-desc':
          return (b.product_num_ratings || 0) - (a.product_num_ratings || 0);
        case 'alphabetical':
          return a.product_title.localeCompare(b.product_title);
        default:
          return 0;
      }
    });
  }, [products, searchTerm, sortBy, filterCategory, priceRange]);

  const formatPrice = (price: string) => price || 'N/A';

  const formatRating = (rating: string, numRatings: number) => (
    <div className="flex items-center gap-1">
      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      <span className="font-medium">{rating || 'N/A'}</span>
      <span className="text-gray-500 text-sm">({numRatings?.toLocaleString() || 0})</span>
    </div>
  );

  const ProductListItem = ({ product }: { product: RapidApiProduct }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex gap-6">
          <div className="w-32 h-32 bg-gray-50 flex items-center justify-center rounded-lg flex-shrink-0">
            <img
              src={product.product_photo}
              alt={product.product_title}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold text-lg leading-tight mb-1">
                {product.product_title}
              </h3>
              {product.product_byline && (
                <p className="text-sm text-gray-600">{product.product_byline}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              {formatRating(product.product_star_rating, product.product_num_ratings)}
              {product.sales_volume && (
                <span className="text-sm text-blue-600">{product.sales_volume}</span>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-green-600">
                {formatPrice(product.product_price)}
              </span>
              {product.product_original_price && 
                product.product_original_price !== product.product_price && (
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(product.product_original_price)}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {product.is_best_seller && (
                <Badge className="bg-orange-100 text-orange-800">Best Seller</Badge>
              )}
              {product.is_amazon_choice && (
                <Badge className="bg-blue-100 text-blue-800">Amazon's Choice</Badge>
              )}
              {product.is_prime && (
                <Badge variant="outline">Prime</Badge>
              )}
              {product.climate_pledge_friendly && (
                <Badge variant="outline">Eco-Friendly</Badge>
              )}
            </div>

            {product.coupon_text && (
              <div className="text-sm text-green-600 font-medium bg-green-50 p-2 rounded">
                {product.coupon_text}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                onClick={() => window.open(product.product_url, '_blank')}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy Now
              </Button>
              <Button
                variant="outline"
                onClick={() => onProductClick(product.asin)}
              >
                View Details
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(product.product_url, '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Product Catalog ({filteredAndSortedProducts.length} of {products.length})
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating-desc">Highest Rated</SelectItem>
                <SelectItem value="rating-asc">Lowest Rated</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="reviews-desc">Most Reviews</SelectItem>
                <SelectItem value="alphabetical">A-Z</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="best-sellers">Best Sellers</SelectItem>
                <SelectItem value="amazon-choice">Amazon's Choice</SelectItem>
                <SelectItem value="prime">Prime Eligible</SelectItem>
                <SelectItem value="eco-friendly">Eco-Friendly</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-25">Under $25</SelectItem>
                <SelectItem value="25-50">$25 - $50</SelectItem>
                <SelectItem value="50-100">$50 - $100</SelectItem>
                <SelectItem value="over-100">Over $100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Display */}
      <div>
        {viewMode === 'list' ? (
          <div>
            {filteredAndSortedProducts.map((product) => (
              <ProductListItem key={product.asin} product={product} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <Card 
                key={product.asin}
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

                  <div className="flex items-center justify-between">
                    {formatRating(product.product_star_rating, product.product_num_ratings)}
                  </div>

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
                  </div>

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
                  </div>

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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {filteredAndSortedProducts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-xl font-semibold mb-4">No Products Found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search terms to find products.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
