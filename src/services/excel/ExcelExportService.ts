import { RapidApiProduct } from '@/types/rapidApi';
import { ProductReviewEnhancer } from './ProductReviewEnhancer';
import { ProductDataMapper } from './ProductDataMapper';
import { CsvUtils } from './CsvUtils';
import { ALL_HEADERS } from './ExcelConstants';

// Service for exporting products to Excel/CSV

export class ExcelExportService {
  static async exportToExcel(
    products: RapidApiProduct[], 
    selectedColumns?: string[], 
    onProgress?: (current: number, total: number) => void
  ): Promise<void> {
    console.log('Starting export with reviews for', products.length, 'products');
    
    // Enhance products with real review data
    const enhancedProducts = await ProductReviewEnhancer.enhanceProductsWithReviews(products, onProgress);

    const headersToUse = selectedColumns && selectedColumns.length > 0 ? selectedColumns : ALL_HEADERS;
    
    // Map products to CSV data
    const csvData = enhancedProducts.map(product => 
      headersToUse.map(header => {
        const value = ProductDataMapper.mapProductData(product, header);
        return CsvUtils.formatCellValue(value);
      })
    );

    const csvContent = CsvUtils.createCSVContent(headersToUse, csvData);
    const filename = `sunbeam-products-with-reviews-${new Date().toISOString().split('T')[0]}.csv`;
    
    CsvUtils.downloadCSV(csvContent, filename);
  }
}