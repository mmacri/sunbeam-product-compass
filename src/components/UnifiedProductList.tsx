
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter, List, Grid, Package, Star, ShoppingCart } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

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

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <Card className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-2xl">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Premium Product Catalog</h2>
                <p className="text-orange-100 text-sm font-normal">
                  Curated collection of top-rated products • {filteredAndSortedProducts.length} of {products.length} products
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="text-white hover:bg-white/20"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="text-white hover:bg-white/20"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Enhanced Filters */}
      <Card className="shadow-lg border-2 border-orange-100 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="w-5 h-5 text-orange-500" />
            Smart Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Search products, brands, features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-2 focus:border-orange-300"
            />
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="border-2 focus:border-orange-300">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating-desc">⭐ Highest Rated First</SelectItem>
                <SelectItem value="rating-asc">⭐ Lowest Rated First</SelectItem>
                <SelectItem value="price-asc">💰 Price: Low to High</SelectItem>
                <SelectItem value="price-desc">💰 Price: High to Low</SelectItem>
                <SelectItem value="reviews-desc">👥 Most Reviews</SelectItem>
                <SelectItem value="alphabetical">🔤 A-Z</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="border-2 focus:border-orange-300">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">🛍️ All Products</SelectItem>
                <SelectItem value="best-sellers">🏆 Best Sellers</SelectItem>
                <SelectItem value="amazon-choice">⚡ Amazon's Choice</SelectItem>
                <SelectItem value="prime">📦 Prime Eligible</SelectItem>
                <SelectItem value="eco-friendly">🌱 Eco-Friendly</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="border-2 focus:border-orange-300">
                <SelectValue placeholder="Price range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">💵 All Prices</SelectItem>
                <SelectItem value="under-25">💸 Under $25</SelectItem>
                <SelectItem value="25-50">💰 $25 - $50</SelectItem>
                <SelectItem value="50-100">💎 $50 - $100</SelectItem>
                <SelectItem value="over-100">👑 Over $100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Display */}
      <div>
{viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                    {product.product_title}
                  </h3>
                  {product.product_byline && (
                    <p className="text-xs text-gray-600 line-clamp-1">{product.product_byline}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{product.product_star_rating || 'N/A'}</span>
                      <span className="text-gray-500 text-sm">({product.product_num_ratings?.toLocaleString() || 0})</span>
                    </div>
                    {product.sales_volume && (
                      <span className="text-xs text-blue-600">{product.sales_volume}</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-green-600">
                        {product.product_price || 'N/A'}
                      </span>
                      {product.product_original_price && 
                        product.product_original_price !== product.product_price && (
                        <span className="text-sm text-gray-500 line-through">
                          {product.product_original_price}
                        </span>
                      )}
                    </div>
                    {product.unit_count > 1 && (
                      <p className="text-xs text-gray-600">
                        {product.unit_price} per unit
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {product.is_best_seller && (
                      <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                        Best Seller
                      </Badge>
                    )}
                    {product.is_amazon_choice && (
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                        Amazon&apos;s Choice
                      </Badge>
                    )}
                    {product.is_prime && (
                      <Badge variant="outline" className="text-xs">Prime</Badge>
                    )}
                    {product.climate_pledge_friendly && (
                      <Badge variant="outline" className="text-xs">Eco-Friendly</Badge>
                    )}
                  </div>

                  {product.coupon_text && (
                    <div className="text-xs text-green-600 font-medium bg-green-50 p-2 rounded">
                      {product.coupon_text}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        const affiliateUrl = `http://www.amazon.com/dp/${product.asin}/ref=nosim?tag=homefitrecove-20`;
                        window.open(affiliateUrl, '_blank');
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Buy Now
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onProductClick(product.asin);
                      }}
                    >
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAndSortedProducts.map((product) => (
              <Card 
                key={product.asin} 
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => onProductClick(product.asin)}
              >
                <div className="flex">
                  <div className="w-48 bg-gray-50 flex items-center justify-center p-4">
                    <img
                      src={product.product_photo}
                      alt={product.product_title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  
                  <CardContent className="flex-1 p-4 space-y-3">
                    <h3 className="font-semibold text-lg leading-tight">
                      {product.product_title}
                    </h3>
                    {product.product_byline && (
                      <p className="text-sm text-gray-600">{product.product_byline}</p>
                    )}
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{product.product_star_rating || 'N/A'}</span>
                        <span className="text-gray-500 text-sm">({product.product_num_ratings?.toLocaleString() || 0})</span>
                      </div>
                      {product.sales_volume && (
                        <span className="text-sm text-blue-600">{product.sales_volume}</span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-green-600">
                          {product.product_price || 'N/A'}
                        </span>
                        {product.product_original_price && 
                          product.product_original_price !== product.product_price && (
                          <span className="text-lg text-gray-500 line-through">
                            {product.product_original_price}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {product.is_best_seller && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          Best Seller
                        </Badge>
                      )}
                      {product.is_amazon_choice && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Amazon&apos;s Choice
                        </Badge>
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

                    <div className="flex gap-2 pt-2">
                      <Button
                        className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          const affiliateUrl = `http://www.amazon.com/dp/${product.asin}/ref=nosim?tag=homefitrecove-20`;
                          window.open(affiliateUrl, '_blank');
                        }}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Buy Now
                      </Button>
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onProductClick(product.asin);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {filteredAndSortedProducts.length === 0 && (
        <Card className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <CardContent>
            <div className="space-y-4">
              <Package className="w-16 h-16 text-gray-400 mx-auto" />
              <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400">No Products Found</h3>
              <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">
                We couldn't find any products matching your criteria. Try adjusting your filters or search terms to discover amazing products.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('all');
                  setPriceRange('all');
                }}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
              >
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
