
import React, { useState, useEffect, useMemo } from 'react';
import { ExcelService } from '@/services/excelService';
import { RapidApiProduct } from '@/types/rapidApi';
import { ProductSelectionService } from '@/services/productSelection';
import { useRapidApiProducts } from '@/hooks/useRapidApiProducts';
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
        onShowMessage(`Loaded ${rapidProducts.length} products from RapidAPI`);
        onLogAction('load_rapidapi_products', { count: rapidProducts.length });
      } else {
        onShowMessage('No products found. Please check your RapidAPI configuration.', 'error');
      }
    } catch (error) {
      onShowMessage('Failed to load products from RapidAPI. Please check your API key.', 'error');
      onLogAction('load_rapidapi_error', { error: error.message || 'Unknown error' });
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

  const exportSelectedProducts = () => {
    const selectedProducts = products.filter(p => selectedAsins.includes(p.asin));
    if (selectedProducts.length === 0) {
      onShowMessage('No products selected for export', 'error');
      return;
    }

    const filteredProducts = selectedProducts.map(product => {
      const filtered: any = {};
      selectedColumns.forEach(column => {
        if (product.hasOwnProperty(column)) {
          filtered[column] = (product as any)[column];
        }
      });
      return filtered;
    });

    ExcelService.exportToExcel(filteredProducts.length > 0 ? filteredProducts : selectedProducts, selectedColumns);
    onShowMessage(`Exported ${selectedProducts.length} products to Excel`);
    onLogAction('export_products', { count: selectedProducts.length, columns: selectedColumns });
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

  return (
    <div className="space-y-6">
      <ProductBrowserHeader
        onLoadFromRapidApi={handleLoadFromRapidApi}
        isLoadingRapidApi={isLoadingRapidApi}
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
