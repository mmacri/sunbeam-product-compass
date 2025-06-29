import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Star, Moon, Sun, RefreshCw } from 'lucide-react';
import { ProductSpecs } from '@/components/ProductSpecs';
import { InteractivePriceChart } from '@/components/InteractivePriceChart';
import { ProductRequestForm } from '@/components/ProductRequestForm';
import { mockProducts } from '@/utils/mockData';
import { useTheme } from '@/contexts/ThemeContext';
import { ProductSearch } from '@/components/ProductSearch';

interface SearchableProduct {
  id: string;
  title: string;
  price: string;
  category: string;
  categories?: string[];
  metaTags?: string[];
  searchTerms?: string[];
  tags: string[];
  lastUpdated: string;
}

const Index = () => {
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [searchableProducts, setSearchableProducts] = useState<SearchableProduct[]>([]);
  const [staleDataWarning, setStaleDataWarning] = useState(false);
  const [realProducts, setRealProducts] = useState([]);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Load real products from admin
    const adminProducts = localStorage.getItem('sunbeam-products');
    if (adminProducts) {
      try {
        const parsed = JSON.parse(adminProducts);
        setRealProducts(parsed);
        // If we have real products, show them instead of mock data
        if (parsed.length > 0) {
          const transformedProducts = parsed.map(transformAdminProduct);
          setProducts(transformedProducts);
          setSearchableProducts(parsed.map(transformToSearchableProduct));
        }
      } catch (error) {
        console.error('Failed to load real products:', error);
      }
    } else {
      // Transform mock products for search
      setSearchableProducts(mockProducts.map(transformMockToSearchableProduct));
    }

    // Check for stale data
    const lastUpdate = localStorage.getItem('sunbeam-last-update');
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    
    if (lastUpdate && (now - parseInt(lastUpdate)) > oneDay) {
      setStaleDataWarning(true);
    }

    if (!lastUpdate) {
      localStorage.setItem('sunbeam-last-update', now.toString());
    }
  }, []);

  const transformAdminProduct = (adminProduct: any) => {
    return {
      id: adminProduct.id,
      title: adminProduct.title,
      currentPrice: adminProduct.price,
      originalPrice: adminProduct.price,
      rating: 4.5,
      reviews: 128,
      description: `Comprehensive review and analysis of ${adminProduct.title}. Track pricing, compare features, and make informed purchasing decisions.`,
      keyFeatures: [
        'Real-time price tracking',
        'Expert analysis and review',
        'Price history monitoring',
        'Multi-store comparison'
      ],
      specs: {
        'Last Updated': new Date(adminProduct.lastUpdated).toLocaleDateString(),
        'Price Alert Threshold': adminProduct.threshold > 0 ? `$${adminProduct.threshold}` : 'Not set',
        'Tags': adminProduct.tags.join(', ') || 'None'
      },
      stores: [
        { name: 'Original Store', url: adminProduct.url }
      ],
      priceHistory: [
        { date: new Date().toISOString().split('T')[0], price: adminProduct.price, store: 'Current' }
      ]
    };
  };

  const transformToSearchableProduct = (adminProduct: any): SearchableProduct => {
    return {
      id: adminProduct.id,
      title: adminProduct.title,
      price: adminProduct.price,
      category: adminProduct.category || 'General',
      categories: adminProduct.categories || [],
      metaTags: adminProduct.metaTags || [],
      searchTerms: adminProduct.searchTerms || [],
      tags: adminProduct.tags || [],
      lastUpdated: adminProduct.lastUpdated
    };
  };

  const transformMockToSearchableProduct = (mockProduct: any): SearchableProduct => {
    return {
      id: mockProduct.id.toString(),
      title: mockProduct.title,
      price: mockProduct.currentPrice,
      category: 'Electronics',
      categories: ['Electronics'],
      metaTags: ['premium', 'highly-rated'],
      searchTerms: mockProduct.title.toLowerCase().split(' '),
      tags: ['featured', 'popular'],
      lastUpdated: new Date().toISOString()
    };
  };

  const handleSearchResults = (results: SearchableProduct[]) => {
    // Filter the display products based on search results
    const resultIds = results.map(r => r.id);
    const filtered = products.filter(p => resultIds.includes(p.id.toString()));
    setFilteredProducts(filtered);
  };

  const refreshData = () => {
    setStaleDataWarning(false);
    localStorage.setItem('sunbeam-last-update', new Date().getTime().toString());
    
    // Reload real products
    const adminProducts = localStorage.getItem('sunbeam-products');
    if (adminProducts) {
      try {
        const parsed = JSON.parse(adminProducts);
        setRealProducts(parsed);
        if (parsed.length > 0) {
          const transformedProducts = parsed.map(transformAdminProduct);
          setProducts(transformedProducts);
          setSearchableProducts(parsed.map(transformToSearchableProduct));
        }
      } catch (error) {
        console.error('Failed to refresh products:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Stale Data Warning */}
      {staleDataWarning && (
        <div className="bg-yellow-100 dark:bg-yellow-900 border-b border-yellow-200 dark:border-yellow-800 px-6 py-3">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-800 dark:text-yellow-200">⚠️</span>
              <span className="text-yellow-800 dark:text-yellow-200 text-sm">
                Product data is over 24 hours old. Consider refreshing for latest information.
              </span>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={refreshData}
              className="border-yellow-300 text-yellow-800 hover:bg-yellow-200 dark:border-yellow-700 dark:text-yellow-200 dark:hover:bg-yellow-800"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-orange-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">☀️</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                Sunbeam Reviews
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="dark:text-gray-300"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-800">
                {realProducts.length > 0 ? `${realProducts.length} Live Products` : 'Product Reviews & Price Tracking'}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Smart Product Reviews & Price Tracking
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Get detailed product comparisons, live price tracking, and expert reviews 
            all in one place. Make informed buying decisions with our comprehensive analysis.
          </p>
        </div>

        {/* Product Request Form */}
        <div className="mb-16">
          <ProductRequestForm />
        </div>

        {/* Product Search */}
        {searchableProducts.length > 0 && (
          <ProductSearch
            products={searchableProducts}
            onSearchResults={handleSearchResults}
          />
        )}

        {/* Featured Products */}
        <div className="grid gap-8 md:gap-12">
          {filteredProducts.length === 0 && products.length > 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <h3 className="text-xl font-semibold mb-4">No Products Match Your Search</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search criteria or clearing the filters.
                </p>
              </CardContent>
            </Card>
          ) : filteredProducts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <h3 className="text-xl font-semibold mb-4">No Products Available Yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Use the request form above to suggest products for review, or visit the admin panel to add products directly.
                </p>
                <Button 
                  onClick={() => window.open('/admin', '_blank')}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                >
                  Go to Admin Panel
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{product.title}</CardTitle>
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-300 text-yellow-300' : 'text-yellow-300/50'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-yellow-100">{product.rating}/5</span>
                        <span className="text-yellow-100">({product.reviews} reviews)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{product.currentPrice}</div>
                      {product.originalPrice !== product.currentPrice && (
                        <div className="flex items-center text-yellow-200">
                          <span className="line-through text-sm mr-2">{product.originalPrice}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Product Description */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Product Overview</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{product.description}</p>
                      
                      {/* Key Features */}
                      <div className="mb-6">
                        <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Key Features</h4>
                        <ul className="space-y-2">
                          {product.keyFeatures.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                              <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Purchase Links */}
                      <div className="flex flex-wrap gap-3">
                        {product.stores.map((store) => (
                          <Button 
                            key={store.name}
                            variant="outline" 
                            className="flex items-center space-x-2 hover:bg-orange-50 hover:border-orange-300 dark:hover:bg-orange-900/20 dark:border-gray-600 dark:text-gray-300"
                            onClick={() => window.open(store.url, '_blank')}
                          >
                            <span>Buy on {store.name}</span>
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Specs and Price History */}
                    <div className="space-y-6">
                      <ProductSpecs specs={product.specs} />
                      <InteractivePriceChart 
                        priceHistory={product.priceHistory} 
                        title={product.title}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Want More Product Reviews?</h3>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            Our team continuously monitors prices and reviews new products. 
            Use the request form above to suggest products you'd like us to review.
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            className="bg-white text-orange-600 hover:bg-orange-50"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Request a Review
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">☀️</span>
              </div>
              <span className="text-xl font-bold">Sunbeam Reviews</span>
            </div>
            <p className="text-gray-400 mb-4">Smart Product Reviews & Price Tracking</p>
            <p className="text-sm text-gray-500">
              © 2025 Sunbeam Reviews. Internal tool for product analysis and review generation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
