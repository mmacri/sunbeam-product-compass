
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useProductData } from '@/hooks/useProductData';
import { useDatabaseProducts } from '@/hooks/useDatabaseProducts';
import { DatabaseProductFilters } from '@/components/DatabaseProductFilters';
import { EnhancedProductCard } from '@/components/EnhancedProductCard';
import { StaleDataWarning } from '@/components/StaleDataWarning';
import { AppHeader } from '@/components/AppHeader';
import { HeroSection } from '@/components/HeroSection';
import { UnifiedProductList } from '@/components/UnifiedProductList';
import { ProductGrid } from '@/components/ProductGrid';
import { AppFooter } from '@/components/AppFooter';
import { FullProductPage } from '@/components/FullProductPage';
import { Link } from 'react-router-dom';
import { Settings, Rocket } from 'lucide-react';

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

  const { 
    products: databaseProducts, 
    allProducts,
    categories,
    loading: loadingDbProducts,
    // Basic filters
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    minRating,
    setMinRating,
    // Enhanced filters
    categoryFilter,
    setCategoryFilter,
    stockStatusFilter,
    setStockStatusFilter,
    dealStatusFilter,
    setDealStatusFilter,
    apiSourceFilter,
    setApiSourceFilter,
    priceStatusFilter,
    setPriceStatusFilter,
    recentUpdatesFilter,
    setRecentUpdatesFilter,
    commissionRange,
    setCommissionRange,
    performanceFilter,
    setPerformanceFilter
  } = useDatabaseProducts();

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

      <div className="fixed top-4 right-4 z-50">
        <Link to="/admin">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Admin
          </Button>
        </Link>
      </div>

      <AppHeader 
        theme={theme}
        toggleTheme={toggleTheme}
        realProductsCount={selectedRapidApiProducts.length}
        isLoadingRapidApi={isLoadingRapidApi}
      />

      <main className="container mx-auto px-6 py-8">
        <HeroSection />

        {/* Admin Access Section */}
        <div className="mb-8">
          <Card className="border-2 border-dashed border-indigo-300 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-3 text-indigo-700 dark:text-indigo-300">
                🛠️ Full Site Access - No Login Required
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This site is completely open - anyone can access all features including the admin panel.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Link to="/admin">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700">
                    🚀 Open Admin Panel
                  </Button>
                </Link>
                <Link to="/tool-reviews">
                  <Button variant="outline">📝 Tool Reviews</Button>
                </Link>
                <Link to="/guides">
                  <Button variant="outline">📚 Guides</Button>
                </Link>
                <Link to="/athletes">
                  <Button variant="outline">🏃 Athletes</Button>
                </Link>
                <Link to="/everyday-recovery">
                  <Button variant="outline">💪 Recovery</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 md:gap-12">
          {/* Database Products Section */}
          {allProducts.length > 0 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Products Available ({allProducts.length} total)
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Discover our curated selection of top-rated products
                </p>
              </div>
              
              <DatabaseProductFilters
                // Basic filters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortBy={sortBy}
                setSortBy={setSortBy}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                minRating={minRating}
                setMinRating={setMinRating}
                // Enhanced filters
                categories={categories}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                stockStatusFilter={stockStatusFilter}
                setStockStatusFilter={setStockStatusFilter}
                dealStatusFilter={dealStatusFilter}
                setDealStatusFilter={setDealStatusFilter}
                apiSourceFilter={apiSourceFilter}
                setApiSourceFilter={setApiSourceFilter}
                priceStatusFilter={priceStatusFilter}
                setPriceStatusFilter={setPriceStatusFilter}
                recentUpdatesFilter={recentUpdatesFilter}
                setRecentUpdatesFilter={setRecentUpdatesFilter}
                commissionRange={commissionRange}
                setCommissionRange={setCommissionRange}
                performanceFilter={performanceFilter}
                setPerformanceFilter={setPerformanceFilter}
                // Counts
                totalProducts={allProducts.length}
                filteredCount={databaseProducts.length}
              />
              
              {databaseProducts.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <h3 className="text-xl font-semibold mb-4">No Products Match Your Filters</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Try adjusting your search criteria or filters to find products.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {databaseProducts.map((product) => (
                    <EnhancedProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
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
