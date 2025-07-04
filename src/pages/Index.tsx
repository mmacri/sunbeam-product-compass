
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useProductData } from '@/hooks/useProductData';
import { useDatabaseProducts } from '@/hooks/useDatabaseProducts';
import { StaleDataWarning } from '@/components/StaleDataWarning';
import { AppHeader } from '@/components/AppHeader';
import { HeroSection } from '@/components/HeroSection';
import { UnifiedProductList } from '@/components/UnifiedProductList';
import { ProductGrid } from '@/components/ProductGrid';
import { AppFooter } from '@/components/AppFooter';
import { FullProductPage } from '@/components/FullProductPage';
import { Star, ShoppingCart } from 'lucide-react';

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const [selectedProductAsin, setSelectedProductAsin] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  const {
    staleDataWarning,
    selectedRapidApiProducts,
    isLoadingRapidApi,
    refreshData
  } = useProductData();

  const { products: databaseProducts, loading: loadingDbProducts } = useDatabaseProducts();

  const selectedProduct = selectedProductAsin 
    ? selectedRapidApiProducts.find(p => p.asin === selectedProductAsin)
    : null;

  if (selectedProduct) {
    return (
      <FullProductPage 
        product={selectedProduct} 
        onBack={() => setSelectedProductAsin(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <StaleDataWarning show={staleDataWarning} onRefresh={refreshData} />

      <AppHeader 
        theme={theme}
        toggleTheme={toggleTheme}
        realProductsCount={selectedRapidApiProducts.length}
        isLoadingRapidApi={isLoadingRapidApi}
      />

      <main className="container mx-auto px-6 py-8">
        <HeroSection />

        <div className="grid gap-8 md:gap-12">
          {/* Database Products Section */}
          {databaseProducts.length > 0 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Products Available
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Discover our curated selection of top-rated products
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {databaseProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                      <img
                        src={product.image_url || '/placeholder.svg'}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    
                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                        {product.name}
                      </h3>
                      
                      {product.description && (
                        <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
                      )}
                      
                      {product.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{product.rating.toFixed(1)}</span>
                        </div>
                      )}
                      
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-green-600">
                            ${product.price?.toFixed(2) || 'N/A'}
                          </span>
                          {product.sale_price && product.sale_price !== product.price && (
                            <span className="text-sm text-gray-500 line-through">
                              ${product.sale_price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                        onClick={() => product.affiliate_url && window.open(product.affiliate_url, '_blank')}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Buy Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* RapidAPI Products Section */}
          {selectedRapidApiProducts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <h3 className="text-xl font-semibold mb-4">
                  {isLoadingRapidApi ? 'Loading Products...' : 'No Additional Products Available'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {isLoadingRapidApi ? 
                    'Loading curated products...' :
                    'Our team is curating more products for you. Check back soon or visit the admin panel to select products.'
                  }
                </p>
                {!isLoadingRapidApi && (
                  <Button 
                    onClick={() => window.open('/admin', '_blank')}
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                  >
                    Admin Panel
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <UnifiedProductList 
              products={selectedRapidApiProducts}
              onProductClick={setSelectedProductAsin}
            />
          )}
        </div>

        {selectedRapidApiProducts.length > 0 && (
          <div className="mt-16 text-center bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Find Your Perfect Product</h3>
            <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
              Browse our curated selection of top-rated products. Click on any product to view detailed information, pricing, and purchase options.
            </p>
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-white text-orange-600 hover:bg-orange-50"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Back to Top
            </Button>
          </div>
        )}
      </main>

      <AppFooter />
    </div>
  );
};

export default Index;
