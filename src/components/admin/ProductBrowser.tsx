import React, { useState } from 'react';
import { useProductBrowserData } from '@/hooks/useProductBrowserData';
import { useProductBrowserSelection } from '@/hooks/useProductBrowserSelection';
import { useProductOperations } from '@/hooks/useProductOperations';
import { useProductDatabase } from '@/hooks/useProductDatabase';
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
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  // Custom hooks for different concerns
  const {
    products,
    setProducts,
    filteredProducts,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    categoryFilter,
    setCategoryFilter,
    isSearching,
    isLoadingRapidApi,
    handleLoadFromRapidApi,
    handleSearchProducts
  } = useProductBrowserData();

  const {
    selectedAsins,
    selectedColumns,
    toggleSelection,
    selectAllFiltered,
    clearSelection,
    handleColumnSave
  } = useProductBrowserSelection();

  const {
    exportSelectedProducts,
    handleImport,
    saveSelectedForUsers
  } = useProductOperations();

  const { updateDatabase } = useProductDatabase();

  // Event handlers that bridge hooks with UI feedback
  const handleLoadFromRapidApiWithFeedback = async () => {
    const result = await handleLoadFromRapidApi();
    if (result.success) {
      onShowMessage(`Loaded ${result.count} best seller products from RapidAPI`);
      onLogAction('load_rapidapi_products', { count: result.count, type: 'best_sellers' });
    } else {
      onShowMessage(result.error, 'error');
      onLogAction('load_rapidapi_error', { error: result.error });
    }
  };

  const handleSearchProductsWithFeedback = async (query: string) => {
    const result = await handleSearchProducts(query);
    if (result.success) {
      onShowMessage(`Found ${result.count} products for "${result.query}"`);
      onLogAction('search_rapidapi_products', { query: result.query, count: result.count });
    } else {
      onShowMessage(result.error, 'error');
      onLogAction('search_rapidapi_error', { query, error: result.error });
    }
  };

  const handleColumnSaveWithFeedback = (columns: string[]) => {
    handleColumnSave(columns);
    setShowColumnSelector(false);
    onShowMessage('Column selection saved successfully');
  };

  const handleExportWithFeedback = async () => {
    const result = await exportSelectedProducts(products, selectedAsins, selectedColumns);
    if (result.success) {
      if (result.type === 'with_reviews') {
        onShowMessage(`Exported ${result.count} products with reviews to Excel`);
        onLogAction('export_products_with_reviews', { count: result.count, columns: selectedColumns });
      } else {
        onShowMessage(`Exported ${result.count} products to Excel (reviews fetch failed)`);
        onLogAction('export_products_fallback', { count: result.count, columns: selectedColumns });
      }
    } else {
      onShowMessage(result.error, 'error');
    }
  };

  const handleImportWithFeedback = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      onShowMessage('No file selected', 'error');
      return;
    }

    const result = await handleImport(file);
    if (result.success) {
      setProducts(result.products);
      localStorage.setItem('sunbeam-products', JSON.stringify(result.products));
      onShowMessage(`Imported ${result.count} products`);
      onLogAction('import_products', { count: result.count });
    } else {
      onShowMessage(result.error, 'error');
    }
  };

  const handleSelectAllFilteredWithFeedback = () => {
    const result = selectAllFiltered(filteredProducts);
    onShowMessage(`Selected all ${result.count} filtered products`);
    onLogAction('select_all_filtered', { count: result.count });
  };

  const handleClearSelectionWithFeedback = () => {
    clearSelection();
    onShowMessage('Cleared all selections');
    onLogAction('clear_selection', {});
  };

  const handleSaveSelectedForUsersWithFeedback = () => {
    const result = saveSelectedForUsers(products, selectedAsins);
    onShowMessage(`Saved ${result.count} selected products for users`);
    onLogAction('save_selected_for_users', { count: result.count });
  };

  const handleUpdateDatabaseWithFeedback = async () => {
    const selectedProducts = products.filter(p => selectedAsins.includes(p.asin));
    onShowMessage('Updating database... This may take a moment.', 'success');
    
    const result = await updateDatabase(selectedProducts);
    if (result.success) {
      onShowMessage(`Database updated: ${result.savedCount} new products, ${result.updatedCount} updated products`);
      onLogAction('update_database', { savedCount: result.savedCount, updatedCount: result.updatedCount, total: result.total });
    } else {
      onShowMessage(result.error, 'error');
      onLogAction('update_database_error', { error: result.error });
    }
  };

  const handleMergeProductsWithFeedback = async () => {
    onShowMessage('Merging duplicate products... This may take a moment.', 'success');
    
    try {
      const { data, error } = await supabase.rpc('merge_duplicate_products');
      
      if (error) {
        onShowMessage(`Error merging products: ${error.message}`, 'error');
        onLogAction('merge_products_error', { error: error.message });
        return;
      }

      if (data && data.length > 0) {
        const totalMerged = data.reduce((sum: number, item: any) => sum + item.merged_count, 0);
        onShowMessage(`Successfully merged ${totalMerged} duplicate products across ${data.length} product groups`);
        onLogAction('merge_products_success', { mergedCount: totalMerged, groups: data.length });
      } else {
        onShowMessage('No duplicate products found to merge');
        onLogAction('merge_products_success', { mergedCount: 0, groups: 0 });
      }
    } catch (error) {
      onShowMessage(`Failed to merge products: ${error.message}`, 'error');
      onLogAction('merge_products_error', { error: error.message });
    }
  };

  return (
    <div className="space-y-6">
      <ProductBrowserHeader
        onLoadFromRapidApi={handleLoadFromRapidApiWithFeedback}
        onSearchProducts={handleSearchProductsWithFeedback}
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
        onColumnSave={handleColumnSaveWithFeedback}
      />

      <ProductBrowserActions
        filteredProductsCount={filteredProducts.length}
        selectedAsinsCount={selectedAsins.length}
        onSelectAllFiltered={handleSelectAllFilteredWithFeedback}
        onClearSelection={handleClearSelectionWithFeedback}
        onExportSelected={handleExportWithFeedback}
        onSaveSelectedForUsers={handleSaveSelectedForUsersWithFeedback}
        onUpdateDatabase={handleUpdateDatabaseWithFeedback}
        onMergeProducts={handleMergeProductsWithFeedback}
        onImport={handleImportWithFeedback}
      />

      <ProductBrowserGrid
        products={filteredProducts}
        selectedAsins={selectedAsins}
        onToggleSelection={toggleSelection}
      />
    </div>
  );
};
