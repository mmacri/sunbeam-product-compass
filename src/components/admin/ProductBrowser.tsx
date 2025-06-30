
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
  Plus,
  Download,
  FileSpreadsheet
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

  const exportToExcel = () => {
    if (filteredProducts.length === 0) {
      onShowMessage('No products to export', 'error');
      return;
    }

    // Create CSV content
    const headers = [
      'ASIN', 'Title', 'Price', 'Original Price', 'Rating', 'Reviews', 'URL', 
      'Is Prime', 'Is Best Seller', 'Is Amazon Choice', 'Currency', 'Delivery',
      'Sales Volume', 'Coupon', 'Availability', 'Min Offer Price', 'Num Offers'
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredProducts.map(product => [
        product.asin,
        `"${product.product_title.replace(/"/g, '""')}"`,
        product.product_price,
        product.product_original_price || '',
        product.product_star_rating,
        product.product_num_ratings,
        product.product_url,
        product.is_prime ? 'Yes' : 'No',
        product.is_best_seller ? 'Yes' : 'No',
        product.is_amazon_choice ? 'Yes' : 'No',
        product.currency,
        `"${product.delivery.replace(/"/g, '""')}"`,
        product.sales_volume || '',
        product.coupon_text || '',
        product.product_availability || '',
        product.product_minimum_offer_price,
        product.product_num_offers
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `amazon-products-${searchQuery}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onLogAction('Products Exported to Excel', { 
      query: searchQuery, 
      productCount: filteredProducts.length 
    });
    onShowMessage(`Exported ${filteredProducts.length} products to Excel`);
  };

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
            Product Browser & Data Export
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
              <Button
                onClick={exportToExcel}
                variant="outline"
                className="flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export to Excel
              </Button>
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
            <CardTitle className="flex items-center justify-between">
              <span>Search Results</span>
              <Button
                onClick={exportToExcel}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export {filteredProducts.length} Products
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Image</TableHead>
                    <TableHead className="min-w-64">Product Details</TableHead>
                    <TableHead>Pricing</TableHead>
                    <TableHead>Rating & Reviews</TableHead>
                    <TableHead>Features & Status</TableHead>
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
                          <div className="text-xs text-gray-500">
                            ASIN: {product.asin}
                          </div>
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
                          {product.product_num_offers > 1 && (
                            <div className="text-xs text-blue-600">
                              {product.product_num_offers} offers from {formatPrice(product.product_minimum_offer_price)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {formatRating(product.product_star_rating, product.product_num_ratings)}
                          {product.sales_volume && (
                            <div className="text-xs text-blue-600">{product.sales_volume}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-xs">
                          {product.coupon_text && (
                            <div className="text-green-600 font-medium">{product.coupon_text}</div>
                          )}
                          {product.delivery && (
                            <div className="text-gray-600">{product.delivery}</div>
                          )}
                          {product.product_availability && (
                            <div className="text-gray-600">{product.product_availability}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedProduct(product)}
                            title="View detailed overview"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(product.product_url, '_blank')}
                            title="View on Amazon"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          {onAddProduct && (
                            <Button
                              size="sm"
                              onClick={() => handleAddProduct(product)}
                              title="Add to tracking"
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

      {/* Product Overview Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between border-b">
              <CardTitle>Complete Product Overview</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedProduct(null)}
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Image and Basic Info */}
                <div className="space-y-4">
                  <img
                    src={selectedProduct.product_photo}
                    alt={selectedProduct.product_title}
                    className="w-full max-w-md mx-auto rounded-lg"
                  />
                  <div className="space-y-2">
                    <h1 className="text-xl font-bold">{selectedProduct.product_title}</h1>
                    {selectedProduct.product_byline && (
                      <p className="text-gray-600">{selectedProduct.product_byline}</p>
                    )}
                  </div>
                </div>

                {/* Detailed Information */}
                <div className="space-y-6">
                  {/* Pricing Information */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Pricing Details</h3>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-green-600">
                        {formatPrice(selectedProduct.product_price)}
                      </div>
                      {selectedProduct.product_original_price && 
                        selectedProduct.product_original_price !== selectedProduct.product_price && (
                        <div className="text-gray-500 line-through">
                          Original: {formatPrice(selectedProduct.product_original_price)}
                        </div>
                      )}
                      {selectedProduct.unit_count > 1 && (
                        <div className="text-sm">
                          Unit Price: {formatPrice(selectedProduct.unit_price)} ({selectedProduct.unit_count} units)
                        </div>
                      )}
                      {selectedProduct.coupon_text && (
                        <div className="text-green-600 font-medium bg-green-100 p-2 rounded">
                          {selectedProduct.coupon_text}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reviews and Rating */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Customer Reviews</h3>
                    <div className="space-y-2">
                      {formatRating(selectedProduct.product_star_rating, selectedProduct.product_num_ratings)}
                      {selectedProduct.sales_volume && (
                        <div className="text-blue-600 font-medium">{selectedProduct.sales_volume}</div>
                      )}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Product Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><strong>ASIN:</strong> {selectedProduct.asin}</div>
                      <div><strong>Currency:</strong> {selectedProduct.currency}</div>
                      <div><strong>Available Offers:</strong> {selectedProduct.product_num_offers}</div>
                      <div><strong>Min Offer Price:</strong> {formatPrice(selectedProduct.product_minimum_offer_price)}</div>
                      <div><strong>Delivery:</strong> {selectedProduct.delivery}</div>
                      <div><strong>Availability:</strong> {selectedProduct.product_availability || 'In Stock'}</div>
                    </div>
                  </div>

                  {/* Special Features */}
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-2">Special Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.is_best_seller && (
                        <Badge className="bg-orange-100 text-orange-800">🏆 Best Seller</Badge>
                      )}
                      {selectedProduct.is_amazon_choice && (
                        <Badge className="bg-blue-100 text-blue-800">⭐ Amazon's Choice</Badge>
                      )}
                      {selectedProduct.is_prime && (
                        <Badge className="bg-blue-100 text-blue-800">🚚 Prime Eligible</Badge>
                      )}
                      {selectedProduct.climate_pledge_friendly && (
                        <Badge className="bg-green-100 text-green-800">🌱 Climate Pledge Friendly</Badge>
                      )}
                      {selectedProduct.has_variations && (
                        <Badge className="bg-gray-100 text-gray-800">🔄 Has Variations</Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4 border-t">
                    <Button
                      onClick={() => window.open(selectedProduct.product_url, '_blank')}
                      className="flex-1"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Amazon
                    </Button>
                    {onAddProduct && (
                      <Button
                        onClick={() => {
                          handleAddProduct(selectedProduct);
                          setSelectedProduct(null);
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add to Tracking
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      )}
    </div>
  );
};
