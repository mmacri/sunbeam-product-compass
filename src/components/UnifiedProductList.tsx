
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, List, Grid, Package } from 'lucide-react';
import { RapidApiProduct } from '@/types/rapidApi';
import { EnhancedProductCard } from '@/components/EnhancedProductCard';

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
              <EnhancedProductCard
                key={product.asin}
                product={product}
                onProductClick={onProductClick}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAndSortedProducts.map((product) => (
              <EnhancedProductCard
                key={product.asin}
                product={product}
                onProductClick={onProductClick}
              />
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
