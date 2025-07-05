import { RapidApiProduct } from '@/types/rapidApi';
import { CsvUtils } from './CsvUtils';

// Service for importing products from Excel/CSV files

export class ExcelImportService {
  static async importFromExcel(file: File): Promise<RapidApiProduct[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n');
          
          if (lines.length < 2) {
            throw new Error('File appears to be empty or invalid');
          }

          const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
          const products: RapidApiProduct[] = [];

          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const values = CsvUtils.parseCSVLine(line);
            
            if (values.length < headers.length) continue;

            const product: RapidApiProduct = {
              asin: CsvUtils.cleanValue(values[0]),
              product_title: CsvUtils.cleanValue(values[1]),
              product_price: CsvUtils.cleanValue(values[2]),
              product_original_price: CsvUtils.cleanValue(values[3]) || undefined,
              unit_price: CsvUtils.cleanValue(values[4]),
              unit_count: parseInt(CsvUtils.cleanValue(values[5])) || 1,
              currency: CsvUtils.cleanValue(values[6]),
              product_star_rating: CsvUtils.cleanValue(values[7]),
              product_num_ratings: parseInt(CsvUtils.cleanValue(values[8])) || 0,
              sales_volume: CsvUtils.cleanValue(values[9]) || undefined,
              product_url: CsvUtils.cleanValue(values[10]),
              product_photo: CsvUtils.cleanValue(values[11]),
              product_num_offers: parseInt(CsvUtils.cleanValue(values[12])) || 1,
              product_minimum_offer_price: CsvUtils.cleanValue(values[13]),
              is_best_seller: CsvUtils.cleanValue(values[14]).toLowerCase() === 'true',
              is_amazon_choice: CsvUtils.cleanValue(values[15]).toLowerCase() === 'true',
              is_prime: CsvUtils.cleanValue(values[16]).toLowerCase() === 'true',
              climate_pledge_friendly: CsvUtils.cleanValue(values[17]).toLowerCase() === 'true',
              has_variations: CsvUtils.cleanValue(values[18]).toLowerCase() === 'true',
              delivery: CsvUtils.cleanValue(values[19]),
              product_byline: CsvUtils.cleanValue(values[20]) || undefined,
              coupon_text: CsvUtils.cleanValue(values[21]) || undefined,
              product_badge: CsvUtils.cleanValue(values[22]) || undefined,
              product_availability: CsvUtils.cleanValue(values[23]) || undefined
            };

            products.push(product);
          }

          resolve(products);
        } catch (error) {
          reject(new Error(`Failed to parse CSV file: ${error.message}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  }
}