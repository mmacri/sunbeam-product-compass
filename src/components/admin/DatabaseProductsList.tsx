import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDatabaseProducts } from '@/hooks/useDatabaseProducts';
import { EnhancedProductCard } from '@/components/EnhancedProductCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Loader2, RefreshCw } from 'lucide-react';

interface DatabaseProductsListProps {
  onShowMessage: (message: string, type?: 'success' | 'error') => void;
}

export const DatabaseProductsList: React.FC<DatabaseProductsListProps> = ({
  onShowMessage
}) => {
  const {
    products,
    allProducts,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    minRating,
    setMinRating,
    refetch
  } = useDatabaseProducts();

  const handleRefresh = async () => {
    try {
      await refetch();
      onShowMessage(`Refreshed ${allProducts.length} database products`);
    } catch (err) {
      onShowMessage('Failed to refresh products', 'error');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading database products...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p className="mb-4">Error loading database products: {error}</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Database Products
              <Badge variant="secondary">{allProducts.length} total</Badge>
              <Badge variant="outline">{products.length} filtered</Badge>
            </CardTitle>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search Products</label>
              <Input
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                  <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                  <SelectItem value="rating-desc">Rating (High to Low)</SelectItem>
                  <SelectItem value="rating-asc">Rating (Low to High)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange([value[0], value[1]])}
                max={1000}
                min={0}
                step={10}
                className="mt-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Min Rating: {minRating}+
              </label>
              <Slider
                value={[minRating]}
                onValueChange={(value) => setMinRating(value[0])}
                max={5}
                min={0}
                step={0.5}
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {products.length === 0 ? (
        <Card>
          <CardContent className="text-center p-8">
            <p className="text-muted-foreground">
              {searchTerm || minRating > 0 || priceRange[0] > 0 || priceRange[1] < 1000
                ? 'No products match your current filters.'
                : 'No products found in the database.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <EnhancedProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};