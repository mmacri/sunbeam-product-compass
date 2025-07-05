import { RapidApiProduct } from '@/types/rapidApi';
import { ExcelExportService, ExcelImportService } from './excel';

// Main Excel service that delegates to specialized services
export class ExcelService {
  static async exportToExcel(
    products: RapidApiProduct[], 
    selectedColumns?: string[], 
    onProgress?: (current: number, total: number) => void
  ): Promise<void> {
    return ExcelExportService.exportToExcel(products, selectedColumns, onProgress);
  }

  static async importFromExcel(file: File): Promise<RapidApiProduct[]> {
    return ExcelImportService.importFromExcel(file);
  }
}