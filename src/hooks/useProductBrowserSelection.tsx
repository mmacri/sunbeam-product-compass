import { useState, useEffect } from 'react';
import { ProductSelectionService } from '@/services/productSelection';
import { RapidApiProduct } from '@/types/rapidApi';

export const useProductBrowserSelection = () => {
  const [selectedAsins, setSelectedAsins] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  useEffect(() => {
    loadSelectedAsins();
    loadSelectedColumns();
  }, []);

  const loadSelectedAsins = () => {
    const selected = ProductSelectionService.getSelectedAsins();
    setSelectedAsins(selected);
  };

  const loadSelectedColumns = () => {
    const savedColumns = localStorage.getItem('sunbeam-selected-columns');
    if (savedColumns) {
      setSelectedColumns(JSON.parse(savedColumns));
    }
  };

  const toggleSelection = (asin: string) => {
    ProductSelectionService.toggleProduct(asin);
    setSelectedAsins(ProductSelectionService.getSelectedAsins());
  };

  const selectAllFiltered = (filteredProducts: RapidApiProduct[]) => {
    const asins = filteredProducts.map(p => p.asin);
    ProductSelectionService.selectAll(asins);
    setSelectedAsins(ProductSelectionService.getSelectedAsins());
    return { count: filteredProducts.length };
  };

  const clearSelection = () => {
    ProductSelectionService.clearAll();
    setSelectedAsins([]);
  };

  const invertSelection = (filteredProducts: RapidApiProduct[]) => {
    const asins = filteredProducts.map(p => p.asin);
    ProductSelectionService.invertSelection(asins);
    setSelectedAsins(ProductSelectionService.getSelectedAsins());
    return { count: ProductSelectionService.getSelectedAsins().length };
  };

  const handleColumnSave = (columns: string[]) => {
    setSelectedColumns(columns);
    localStorage.setItem('sunbeam-selected-columns', JSON.stringify(columns));
  };

  return {
    selectedAsins,
    selectedColumns,
    toggleSelection,
    selectAllFiltered,
    clearSelection,
    invertSelection,
    handleColumnSave
  };
};