
import { RapidApiProduct } from '@/types/rapidApi';

export class ExcelService {
  static exportToExcel(products: RapidApiProduct[]): void {
    const headers = [
      'ASIN',
      'Title',
      'Price',
      'Original Price',
      'Unit Price',
      'Unit Count',
      'Currency',
      'Star Rating',
      'Number of Ratings',
      'Sales Volume',
      'URL',
      'Photo URL',
      'Number of Offers',
      'Minimum Offer Price',
      'Is Best Seller',
      'Is Amazon Choice',
      'Is Prime',
      'Climate Pledge Friendly',
      'Has Variations',
      'Delivery',
      'Byline',
      'Coupon Text',
      'Product Badge',
      'Availability'
    ];

    const csvContent = [
      headers.join(','),
      ...products.map(product => [
        `"${product.asin}"`,
        `"${product.product_title.replace(/"/g, '""')}"`,
        `"${product.product_price}"`,
        `"${product.product_original_price || ''}"`,
        `"${product.unit_price}"`,
        product.unit_count,
        `"${product.currency}"`,
        `"${product.product_star_rating}"`,
        product.product_num_ratings,
        `"${product.sales_volume || ''}"`,
        `"${product.product_url}"`,
        `"${product.product_photo}"`,
        product.product_num_offers,
        `"${product.product_minimum_offer_price}"`,
        product.is_best_seller,
        product.is_amazon_choice,
        product.is_prime,
        product.climate_pledge_friendly,
        product.has_variations,
        `"${product.delivery}"`,
        `"${product.product_byline || ''}"`,
        `"${product.coupon_text || ''}"`,
        `"${product.product_badge || ''}"`,
        `"${product.product_availability || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `sunbeam-products-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

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

            const values = this.parseCSVLine(line);
            
            if (values.length < headers.length) continue;

            const product: RapidApiProduct = {
              asin: this.cleanValue(values[0]),
              product_title: this.cleanValue(values[1]),
              product_price: this.cleanValue(values[2]),
              product_original_price: this.cleanValue(values[3]) || undefined,
              unit_price: this.cleanValue(values[4]),
              unit_count: parseInt(this.cleanValue(values[5])) || 1,
              currency: this.cleanValue(values[6]),
              product_star_rating: this.cleanValue(values[7]),
              product_num_ratings: parseInt(this.cleanValue(values[8])) || 0,
              sales_volume: this.cleanValue(values[9]) || undefined,
              product_url: this.cleanValue(values[10]),
              product_photo: this.cleanValue(values[11]),
              product_num_offers: parseInt(this.cleanValue(values[12])) || 1,
              product_minimum_offer_price: this.cleanValue(values[13]),
              is_best_seller: this.cleanValue(values[14]).toLowerCase() === 'true',
              is_amazon_choice: this.cleanValue(values[15]).toLowerCase() === 'true',
              is_prime: this.cleanValue(values[16]).toLowerCase() === 'true',
              climate_pledge_friendly: this.cleanValue(values[17]).toLowerCase() === 'true',
              has_variations: this.cleanValue(values[18]).toLowerCase() === 'true',
              delivery: this.cleanValue(values[19]),
              product_byline: this.cleanValue(values[20]) || undefined,
              coupon_text: this.cleanValue(values[21]) || undefined,
              product_badge: this.cleanValue(values[22]) || undefined,
              product_availability: this.cleanValue(values[23]) || undefined
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

  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }

  private static cleanValue(value: string): string {
    return value.replace(/^"|"$/g, '').trim();
  }
}
