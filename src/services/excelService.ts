
import { RapidApiProduct } from '@/types/rapidApi';

export class ExcelService {
  static exportToExcel(products: RapidApiProduct[], filename?: string): void {
    const headers = [
      'ASIN', 'Title', 'Price', 'Original Price', 'Rating', 'Reviews', 'URL',
      'Photo URL', 'Is Prime', 'Is Best Seller', 'Is Amazon Choice', 'Currency',
      'Delivery', 'Sales Volume', 'Coupon', 'Availability', 'Min Offer Price',
      'Num Offers', 'Byline', 'Unit Price', 'Unit Count', 'Climate Pledge Friendly'
    ];

    const csvContent = [
      headers.join(','),
      ...products.map(product => [
        product.asin,
        `"${product.product_title.replace(/"/g, '""')}"`,
        product.product_price,
        product.product_original_price || '',
        product.product_star_rating,
        product.product_num_ratings,
        product.product_url,
        product.product_photo,
        product.is_prime ? 'Yes' : 'No',
        product.is_best_seller ? 'Yes' : 'No',
        product.is_amazon_choice ? 'Yes' : 'No',
        product.currency,
        `"${product.delivery.replace(/"/g, '""')}"`,
        product.sales_volume || '',
        product.coupon_text || '',
        product.product_availability || '',
        product.product_minimum_offer_price,
        product.product_num_offers,
        `"${(product.product_byline || '').replace(/"/g, '""')}"`,
        product.unit_price,
        product.unit_count,
        product.climate_pledge_friendly ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename || `selected-products-${new Date().toISOString().split('T')[0]}.csv`);
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
          const csv = e.target?.result as string;
          const lines = csv.split('\n');
          const headers = lines[0].split(',');
          
          const products: RapidApiProduct[] = [];
          
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = this.parseCSVLine(lines[i]);
            if (values.length < headers.length) continue;
            
            const product: RapidApiProduct = {
              asin: values[0],
              product_title: values[1].replace(/^"|"$/g, '').replace(/""/g, '"'),
              product_price: values[2],
              product_original_price: values[3] || values[2],
              product_star_rating: values[4],
              product_num_ratings: parseInt(values[5]) || 0,
              product_url: values[6],
              product_photo: values[7],
              is_prime: values[8] === 'Yes',
              is_best_seller: values[9] === 'Yes',
              is_amazon_choice: values[10] === 'Yes',
              currency: values[11],
              delivery: values[12].replace(/^"|"$/g, '').replace(/""/g, '"'),
              sales_volume: values[13],
              coupon_text: values[14],
              product_availability: values[15],
              product_minimum_offer_price: values[16],
              product_num_offers: parseInt(values[17]) || 0,
              product_byline: values[18]?.replace(/^"|"$/g, '').replace(/""/g, '"'),
              unit_price: values[19],
              unit_count: parseInt(values[20]) || 1,
              climate_pledge_friendly: values[21] === 'Yes',
              has_variations: false
            };
            
            products.push(product);
          }
          
          resolve(products);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  private static parseCSVLine(line: string): string[] {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"' && (i === 0 || line[i-1] === ',')) {
        inQuotes = true;
      } else if (char === '"' && inQuotes && (i === line.length - 1 || line[i+1] === ',')) {
        inQuotes = false;
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
}
