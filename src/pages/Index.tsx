
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductRequestForm } from '@/components/ProductRequestForm';
import { ProductSearch } from '@/components/ProductSearch';
import { useTheme } from '@/contexts/ThemeContext';
import { useProductData } from '@/hooks/useProductData';
import { StaleDataWarning } from '@/components/StaleDataWarning';
import { AppHeader } from '@/components/AppHeader';
import { HeroSection } from '@/components/HeroSection';
import { ProductCard } from '@/components/ProductCard';
import { CallToAction } from '@/components/CallToAction';
import { AppFooter } from '@/components/AppFooter';

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const {
    filteredProducts,
    searchableProducts,
    staleDataWarning,
    realProducts,
    isLoadingRapidApi,
    handleSearchResults,
    refreshData
  } = useProductData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <StaleDataWarning show={staleDataWarning} onRefresh={refreshData} />

      <AppHeader 
        theme={theme}
        toggleTheme={toggleTheme}
        realProductsCount={realProducts.length}
        isLoadingRapidApi={isLoadingRapidApi}
      />

      <main className="container mx-auto px-6 py-8">
        <HeroSection />

        <div className="mb-16">
          <ProductRequestForm />
        </div>

        {searchableProducts.length > 0 && (
          <ProductSearch
            products={searchableProducts}
            onSearchResults={handleSearchResults}
          />
        )}

        <div className="grid gap-8 md:gap-12">
          {filteredProducts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <h3 className="text-xl font-semibold mb-4">
                  {isLoadingRapidApi ? 'Loading Products...' : 'No Products Available Yet'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {isLoadingRapidApi ? 
                    'Fetching the latest products from our database...' :
                    'Use the request form above to suggest products for review, or visit the admin panel to add products directly.'
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
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>

        <CallToAction />
      </main>

      <AppFooter />
    </div>
  );
};

export default Index;
