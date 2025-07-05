import { ExcelService } from '@/services/excelService';
import { RapidApiProduct } from '@/types/rapidApi';

export const useProductOperations = () => {
  const exportSelectedProducts = async (products: RapidApiProduct[], selectedAsins: string[], selectedColumns: string[]) => {
    const selectedProducts = products.filter(p => selectedAsins.includes(p.asin));
    if (selectedProducts.length === 0) {
      return { success: false, error: 'No products selected for export' };
    }

    try {
      // Use the unified export method that now always fetches real reviews
      await ExcelService.exportToExcel(selectedProducts, selectedColumns, (current, total) => {
        console.log(`Progress: ${current}/${total} products processed`);
      });
      return { success: true, count: selectedProducts.length, type: 'with_reviews' };
    } catch (error) {
      console.error('Export failed:', error);
      return { success: false, error: `Export failed: ${error.message}` };
    }
  };

  const handleImport = async (file: File) => {
    if (!file) {
      return { success: false, error: 'No file selected' };
    }

    try {
      const importedProducts = await ExcelService.importFromExcel(file);
      return { success: true, products: importedProducts, count: importedProducts.length };
    } catch (error) {
      return { success: false, error: `Import failed: ${error.message}` };
    }
  };

  const saveSelectedForUsers = (products: RapidApiProduct[], selectedAsins: string[]) => {
    const selectedProducts = products.filter(p => selectedAsins.includes(p.asin));
    localStorage.setItem('sunbeam-selected-rapidapi-products', JSON.stringify(selectedProducts));
    return { success: true, count: selectedProducts.length };
  };

  return {
    exportSelectedProducts,
    handleImport,
    saveSelectedForUsers
  };
};