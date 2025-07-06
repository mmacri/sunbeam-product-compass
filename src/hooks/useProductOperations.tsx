import { ExcelService } from '@/services/excelService';
import { RapidApiProduct } from '@/types/rapidApi';
import { supabase } from '@/integrations/supabase/client';

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

  const deleteSelectedProducts = async (products: RapidApiProduct[], selectedAsins: string[]) => {
    const selectedProducts = products.filter(p => selectedAsins.includes(p.asin));
    if (selectedProducts.length === 0) {
      return { success: false, error: 'No products selected for deletion' };
    }

    try {
      // Delete from database by ASIN (since these are RapidAPI products, not database products)
      // We'll delete any database products that match these ASINs
      const asinsToDelete = selectedProducts.map(p => p.asin).filter(Boolean);
      
      if (asinsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('products')
          .delete()
          .in('asin', asinsToDelete);

        if (deleteError) {
          throw new Error(`Database deletion failed: ${deleteError.message}`);
        }
      }

      // Also remove from localStorage (RapidAPI products)
      const savedProducts = localStorage.getItem('sunbeam-products');
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        const filtered = parsed.filter((p: any) => !selectedAsins.includes(p.asin));
        localStorage.setItem('sunbeam-products', JSON.stringify(filtered));
      }

      return { success: true, count: selectedProducts.length };
    } catch (error) {
      console.error('Delete failed:', error);
      return { success: false, error: `Delete failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  };

  return {
    exportSelectedProducts,
    handleImport,
    saveSelectedForUsers,
    deleteSelectedProducts
  };
};