
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Search,
  Filter,
  ExternalLink,
  Star,
  ShoppingCart,
  RefreshCw,
  Eye,
  Plus
} from 'lucide-react';
import { RapidApiService } from '@/services/rapidApi';
import { RapidApiProduct } from '@/types/rapidApi';

interface ProductBrowserProps {
  onShowMessage: (message: string, type?: 'success' | 'error') => void;
  onLogAction: (action: string, details: any) => void;
  onAddProduct?: (product: RapidApiProduct) => void;
}

export const ProductBrowser: React.FC<ProductBrowserProps> = ({
  onShowMessage,
  onLogAction,
  onAddProduct
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<RapidApiProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('BEST_SELLERS');
  const [filterBy, setFilterBy] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<RapidApiProduct | null>(null);

  const searchProducts = async () => {
    if (!searchQuery.trim()) {
      onShowMessage('Please enter a search query', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await RapidApiService.searchProducts(searchQuery, {
        sortBy,
        country: 'US',
        page: 1
      });

      setProducts(result.products || []);
      onLogAction('Product Search', { 
        query: searchQuery, 
        totalResults: result.total_products,
        sortBy 
      });
      onShowMessage(`Found ${result.total_products} products for "${searchQuery}"`);
    } catch (error) {
      onShowMessage(`Search failed: ${error.message}`, 'error');
      onLogAction('Product Search Failed', { 
        query: searchQuery, 
        error: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!filterBy) return products;
    
    return products.filter(product => {
      const searchText = `${product.product_title} ${product.product_byline || ''}`.toLowerCase();
      return searchText.includes(filterBy.toLowerCase());
    });
  }, [products, filterBy]);

  const formatPrice = (price: string) => {
    return price || 'N/A';
  };

  const formatRating = (rating: string, numRatings: number) => {
    return (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="font-medium">{rating || 'N/A'}</span>
        <span className="text-gray-500">({numRatings?.toLocaleString() || 0})</span>
      </div>
    );
  };

  const handleAddProduct = (product: RapidApiProduct) => {
    if (onAddProduct) {
      onAddProduct(product);
      onShowMessage(`Added "${product.product_title}" to tracking`);
      onLogAction('Product Added from Browser', { 
        asin: product.asin, 
        title: product.product_title 
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Product Browser
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search for products (e.g., massage gun, laptop, headphones)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchProducts()}
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="BEST_SELLERS">Best Sellers</option>
              <option value="PRICE_LOW_TO_HIGH">Price: Low to High</option>
              <option value="PRICE_HIGH_TO_LOW">Price: High to Low</option>
              <option value="NEWEST_ARRIVALS">Newest</option>
              <option value="AVG_CUSTOMER_REVIEW">Top Rated</option>
            </select>
            <Button onClick={searchProducts} disabled={loading}>
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Search
            </Button>
          </div>

          {products.length > 0 && (
            <div className="flex items-center gap-4">
              <Input
                placeholder="Filter results..."
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="max-w-xs"
              />
              <span className="text-sm text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Table */}
      {filteredProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Image</TableHead>
                    <TableHead className="min-w-64">Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.asin}>
                      <TableCell>
                        <img
                          src={product.product_photo}
                          alt={product.product_title}
                          className="w-12 h-12 object-contain rounded"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <h3 className="font-medium text-sm leading-tight">
                            {product.product_title}
                          </h3>
                          {product.product_byline && (
                            <p className="text-xs text-gray-600">{product.product_byline}</p>
                          )}
                          <div className="flex gap-1 flex-wrap">
                            {product.is_best_seller && (
                              <Badge variant="secondary" className="text-xs">Best Seller</Badge>
                            )}
                            {product.is_amazon_choice && (
                              <Badge variant="secondary" className="text-xs">Amazon's Choice</Badge>
                            )}
                            {product.is_prime && (
                              <Badge variant="outline" className="text-xs">Prime</Badge>
                            )}
                            {product.climate_pledge_friendly && (
                              <Badge variant="outline" className="text-xs">Eco-Friendly</Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-bold text-green-600">
                            {formatPrice(product.product_price)}
                          </div>
                          {product.product_original_price && 
                            product.product_original_price !== product.product_price && (
                            <div className="text-xs text-gray-500 line-through">
                              {formatPrice(product.product_original_price)}
                            </div>
                          )}
                          {product.unit_count > 1 && (
                            <div className="text-xs text-gray-600">
                              {formatPrice(product.unit_price)} each
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatRating(product.product_star_rating, product.product_num_ratings)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-xs">
                          {product.coupon_text && (
                            <div className="text-green-600 font-medium">{product.coupon_text}</div>
                          )}
                          {product.sales_volume && (
                            <div className="text-blue-600">{product.sales_volume}</div>
                          )}
                          {product.delivery && (
                            <div className="text-gray-600">{product.delivery}</div>
                          )}
                          <div className="text-gray-500">
                            ASIN: {product.asin}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedProduct(product)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(product.product_url, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          {onAddProduct && (
                            <Button
                              size="sm"
                              onClick={() => handleAddProduct(product)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <Card className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Product Details</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedProduct(null)}
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedProduct.product_photo}
                    alt={selectedProduct.product_title}
                    className="w-full max-w-sm mx-auto"
                  />
                </div>
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">{selectedProduct.product_title}</h2>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-600">
                      {formatPrice(selectedProduct.product_price)}
                    </div>
                    {formatRating(selectedProduct.product_star_rating, selectedProduct.product_num_ratings)}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>ASIN:</strong> {selectedProduct.asin}</div>
                    <div><strong>Currency:</strong> {selectedProduct.currency}</div>
                    <div><strong>Offers:</strong> {selectedProduct.product_num_offers}</div>
                    <div><strong>Min Offer:</strong> {formatPrice(selectedProduct.product_minimum_offer_price)}</div>
                    {selectedProduct.unit_count > 1 && (
                      <>
                        <div><strong>Unit Count:</strong> {selectedProduct.unit_count}</div>
                        <div><strong>Unit Price:</strong> {formatPrice(selectedProduct.unit_price)}</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      )}
    </div>
  );
};
