
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductSearch } from '@/components/ProductSearch';
import { useTheme } from '@/contexts/ThemeContext';
import { useProductData } from '@/hooks/useProductData';
import { StaleDataWarning } from '@/components/StaleDataWarning';
import { AppHeader } from '@/components/AppHeader';
import { HeroSection } from '@/components/HeroSection';
import { ProductCard } from '@/components/ProductCard';
import { CallToAction } from '@/components/CallToAction';
import { AppFooter } from '@/components/AppFooter';
import { FullProductPage } from '@/components/FullProductPage';

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const [selectedProductAsin, setSelectedProductAsin] = useState<string | null>(null);
  
  const {
    filteredProducts,
    searchableProducts,
    staleDataWarning,
    selectedRapidApiProducts,
    isLoadingRapidApi,
    handleSearchResults,
    refreshData
  } = useProductData();

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

        {searchableProducts.length > 0 && (
          <div className="mb-8">
            <ProductSearch
              products={searchableProducts}
              onSearchResults={handleSearchResults}
            />
          </div>
        )}

        <div className="grid gap-8 md:gap-12">
          {filteredProducts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <h3 className="text-xl font-semibold mb-4">
                  {isLoadingRapidApi ? 'Loading Products...' : 'No Products Available'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {isLoadingRapidApi ? 
                    'Loading selected products...' :
                    'No products have been selected yet. Visit the admin panel to search and select products to display here.'
                  }
                </p>
                {!isLoadingRapidApi && (
                  <Button 
                    onClick={() => window.open('/admin', '_blank')}
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                  >
                    Go to Admin Panel
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} onClick={() => setSelectedProductAsin(product.id.toString())}>
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>

        {filteredProducts.length > 0 && (
          <div className="mt-16 text-center bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Explore More Products</h3>
            <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
              Click on any product above to view detailed information, pricing, and purchase options.
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
