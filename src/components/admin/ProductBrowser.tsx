import React, { useState, useEffect, useMemo } from 'react';
import { ExcelService } from '@/services/excelService';
import { RapidApiProduct } from '@/types/rapidApi';
import { ProductSelectionService } from '@/services/productSelection';
import { useRapidApiProducts } from '@/hooks/useRapidApiProducts';
import { RapidApiService } from '@/services/rapidApi';
import { supabase } from '@/integrations/supabase/client';
import { ProductBrowserHeader } from './ProductBrowserHeader';
import { ProductBrowserControls } from './ProductBrowserControls';
import { ProductBrowserActions } from './ProductBrowserActions';
import { ProductBrowserGrid } from './ProductBrowserGrid';

interface ProductBrowserProps {
  onShowMessage: (message: string, type?: 'success' | 'error') => void;
  onLogAction: (action: string, details: any) => void;
}

export const ProductBrowser: React.FC<ProductBrowserProps> = ({
  onShowMessage,
  onLogAction
}) => {
  const [products, setProducts] = useState<RapidApiProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating-desc');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedAsins, setSelectedAsins] = useState<string[]>([]);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { isLoadingRapidApi, loadProductsFromRapidApi } = useRapidApiProducts();

  useEffect(() => {
    loadProducts();
    loadSelectedAsins();
  }, []);

  useEffect(() => {
    const savedColumns = localStorage.getItem('sunbeam-selected-columns');
    if (savedColumns) {
      setSelectedColumns(JSON.parse(savedColumns));
    }
  }, []);

  const loadProducts = () => {
    const storedProducts = localStorage.getItem('sunbeam-products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  };

  const loadSelectedAsins = () => {
    const selected = ProductSelectionService.getSelectedAsins();
    setSelectedAsins(selected);
  };

  const handleLoadFromRapidApi = async () => {
    try {
      const rapidProducts = await loadProductsFromRapidApi();
      if (rapidProducts.length > 0) {
        setProducts(rapidProducts);
        localStorage.setItem('sunbeam-products', JSON.stringify(rapidProducts));
        onShowMessage(`Loaded ${rapidProducts.length} best seller products from RapidAPI`);
        onLogAction('load_rapidapi_products', { count: rapidProducts.length, type: 'best_sellers' });
      } else {
        onShowMessage('No products found. Please check your RapidAPI configuration.', 'error');
      }
    } catch (error) {
      onShowMessage('Failed to load products from RapidAPI. Please check your API key.', 'error');
      onLogAction('load_rapidapi_error', { error: error.message || 'Unknown error' });
    }
  };

  const handleSearchProducts = async (query: string) => {
    const rapidApiKey = localStorage.getItem('rapidapi-key');
    if (!rapidApiKey) {
      onShowMessage('RapidAPI key not configured. Please set it in Settings.', 'error');
      return;
    }

    setIsSearching(true);
    try {
      RapidApiService.setApiKey(rapidApiKey);
      const searchResults = await RapidApiService.searchProducts(query, {
        sortBy: 'BEST_SELLERS',
        country: 'US',
        page: 1
      });

      if (searchResults.products && searchResults.products.length > 0) {
        // Remove the artificial limit - show all products returned by API
        const searchedProducts = searchResults.products;
        setProducts(searchedProducts);
        localStorage.setItem('sunbeam-products', JSON.stringify(searchedProducts));
        onShowMessage(`Found ${searchedProducts.length} products for "${query}"`);
        onLogAction('search_rapidapi_products', { query, count: searchedProducts.length });
      } else {
        onShowMessage(`No products found for "${query}". Try a different search term.`, 'error');
      }
    } catch (error) {
      console.error('Search error:', error);
      onShowMessage('Failed to search products. Please check your API key and try again.', 'error');
      onLogAction('search_rapidapi_error', { query, error: error.message || 'Unknown error' });
    } finally {
      setIsSearching(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.product_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.product_byline && product.product_byline.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => {
        switch (categoryFilter) {
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

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => parseFloat(a.product_price.replace(/[^0-9.]/g, '')) - parseFloat(b.product_price.replace(/[^0-9.]/g, '')));
        break;
      case 'price-desc':
        filtered.sort((a, b) => parseFloat(b.product_price.replace(/[^0-9.]/g, '')) - parseFloat(a.product_price.replace(/[^0-9.]/g, '')));
        break;
      case 'rating-desc':
        filtered.sort((a, b) => parseFloat(b.product_star_rating || '0') - parseFloat(a.product_star_rating || '0'));
        break;
      case 'rating-asc':
        filtered.sort((a, b) => parseFloat(a.product_star_rating || '0') - parseFloat(b.product_star_rating || '0'));
        break;
      case 'reviews-desc':
        filtered.sort((a, b) => (b.product_num_ratings || 0) - (a.product_num_ratings || 0));
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.product_title.localeCompare(b.product_title));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, searchTerm, sortBy, categoryFilter]);

  const handleColumnSave = (columns: string[]) => {
    setSelectedColumns(columns);
    setShowColumnSelector(false);
    onShowMessage('Column selection saved successfully');
  };

  const exportSelectedProducts = async () => {
    const selectedProducts = products.filter(p => selectedAsins.includes(p.asin));
    if (selectedProducts.length === 0) {
      onShowMessage('No products selected for export', 'error');
      return;
    }

    try {
      onShowMessage('Fetching reviews and exporting... This may take a moment.', 'success');
      // Use the enhanced export method that fetches real reviews
      await ExcelService.exportToExcelWithReviews(selectedProducts, selectedColumns, (current, total) => {
        console.log(`Progress: ${current}/${total} products processed`);
      });
      onShowMessage(`Exported ${selectedProducts.length} products with reviews to Excel`);
      onLogAction('export_products_with_reviews', { count: selectedProducts.length, columns: selectedColumns });
    } catch (error) {
      console.error('Export with reviews failed:', error);
      // Fallback to regular export
      ExcelService.exportToExcel(selectedProducts, selectedColumns);
      onShowMessage(`Exported ${selectedProducts.length} products to Excel (reviews fetch failed)`);
      onLogAction('export_products_fallback', { count: selectedProducts.length, columns: selectedColumns });
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      onShowMessage('No file selected', 'error');
      return;
    }

    try {
      const importedProducts = await ExcelService.importFromExcel(file);
      setProducts(importedProducts);
      localStorage.setItem('sunbeam-products', JSON.stringify(importedProducts));
      onShowMessage(`Imported ${importedProducts.length} products`);
      onLogAction('import_products', { count: importedProducts.length });
    } catch (error) {
      onShowMessage(`Import failed: ${error.message}`, 'error');
    }
  };

  const toggleSelection = (asin: string) => {
    ProductSelectionService.toggleProduct(asin);
    setSelectedAsins(ProductSelectionService.getSelectedAsins());
  };

  const selectAllFiltered = () => {
    const asins = filteredProducts.map(p => p.asin);
    ProductSelectionService.selectAll(asins);
    setSelectedAsins(ProductSelectionService.getSelectedAsins());
    onShowMessage(`Selected all ${filteredProducts.length} filtered products`);
    onLogAction('select_all_filtered', { count: filteredProducts.length });
  };

  const clearSelection = () => {
    ProductSelectionService.clearAll();
    setSelectedAsins([]);
    onShowMessage('Cleared all selections');
    onLogAction('clear_selection', {});
  };

  const saveSelectedForUsers = () => {
    const selectedProducts = products.filter(p => selectedAsins.includes(p.asin));
    localStorage.setItem('sunbeam-selected-rapidapi-products', JSON.stringify(selectedProducts));
    onShowMessage(`Saved ${selectedProducts.length} selected products for users`);
    onLogAction('save_selected_for_users', { count: selectedProducts.length });
  };

  const updateDatabase = async () => {
    const selectedProducts = products.filter(p => selectedAsins.includes(p.asin));
    if (selectedProducts.length === 0) {
      onShowMessage('No products selected for database update', 'error');
      return;
    }

    try {
      onShowMessage('Updating database... This may take a moment.', 'success');
      let savedCount = 0;
      let updatedCount = 0;

      for (const product of selectedProducts) {
        // Transform RapidAPI product to database format
        const priceValue = parseFloat(product.product_price?.replace(/[^0-9.]/g, '') || '0');
        const salePriceValue = product.product_original_price ? parseFloat(product.product_original_price.replace(/[^0-9.]/g, '') || '0') : null;
        
        const productData = {
          name: product.product_title,
          description: product.product_byline || product.product_title,
          price: priceValue || null,
          sale_price: salePriceValue && salePriceValue !== priceValue ? salePriceValue : null,
          rating: parseFloat(product.product_star_rating) || null,
          image_url: product.product_photo,
          slug: product.product_title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          asin: product.asin,
          api_source: 'rapidapi',
          api_last_updated: new Date().toISOString(),
          availability: product.product_availability !== 'Currently unavailable',
          in_stock: product.product_availability !== 'Currently unavailable',
          specifications: {
            star_rating: product.product_star_rating,
            num_ratings: product.product_num_ratings,
            byline: product.product_byline,
            availability: product.product_availability,
            url: product.product_url,
            is_best_seller: product.is_best_seller,
            is_amazon_choice: product.is_amazon_choice,
            is_prime: product.is_prime,
            climate_pledge_friendly: product.climate_pledge_friendly
          },
          attributes: {
            bestseller: product.is_best_seller,
            amazonChoice: product.is_amazon_choice,
            prime: product.is_prime,
            climatePledge: product.climate_pledge_friendly
          },
          price_history: JSON.stringify([{
            date: new Date().toISOString(),
            price: priceValue,
            source: 'rapidapi'
          }])
        };

        // Check if product exists by ASIN
        const { data: existingProduct } = await supabase
          .from('products')
          .select('id, price')
          .eq('asin', product.asin)
          .maybeSingle();

        if (existingProduct) {
          // Update existing product
          const { error } = await supabase
            .from('products')
            .update(productData)
            .eq('id', existingProduct.id);

          if (error) {
            console.error('Error updating product:', error);
            continue;
          }
          updatedCount++;

          // Save API snapshot
          await supabase.from('product_api_snapshots').insert({
            product_id: existingProduct.id,
            asin: product.asin,
            api_source: 'rapidapi',
            raw_data: JSON.parse(JSON.stringify(product)),
            price_at_time: priceValue,
            availability_at_time: productData.availability
          });
        } else {
          // Create new product
          const { data: newProduct, error } = await supabase
            .from('products')
            .insert(productData)
            .select('id')
            .single();

          if (error) {
            console.error('Error creating product:', error);
            continue;
          }
          savedCount++;

          // Save API snapshot
          if (newProduct) {
            await supabase.from('product_api_snapshots').insert({
              product_id: newProduct.id,
              asin: product.asin,
              api_source: 'rapidapi',
              raw_data: JSON.parse(JSON.stringify(product)),
              price_at_time: priceValue,
              availability_at_time: productData.availability
            });
          }
        }
      }

      onShowMessage(`Database updated: ${savedCount} new products, ${updatedCount} updated products`);
      onLogAction('update_database', { savedCount, updatedCount, total: selectedProducts.length });
    } catch (error) {
      console.error('Database update failed:', error);
      onShowMessage('Failed to update database. Please try again.', 'error');
      onLogAction('update_database_error', { error: error.message || 'Unknown error' });
    }
  };

  return (
    <div className="space-y-6">
      <ProductBrowserHeader
        onLoadFromRapidApi={handleLoadFromRapidApi}
        onSearchProducts={handleSearchProducts}
        isLoadingRapidApi={isLoadingRapidApi}
        isSearching={isSearching}
        productCount={products.length}
      />

      <ProductBrowserControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        showColumnSelector={showColumnSelector}
        setShowColumnSelector={setShowColumnSelector}
        onColumnSave={handleColumnSave}
      />

      <ProductBrowserActions
        filteredProductsCount={filteredProducts.length}
        selectedAsinsCount={selectedAsins.length}
        onSelectAllFiltered={selectAllFiltered}
        onClearSelection={clearSelection}
        onExportSelected={exportSelectedProducts}
        onSaveSelectedForUsers={saveSelectedForUsers}
        onUpdateDatabase={updateDatabase}
        onImport={handleImport}
      />

      <ProductBrowserGrid
        products={filteredProducts}
        selectedAsins={selectedAsins}
        onToggleSelection={toggleSelection}
      />
    </div>
  );
};
