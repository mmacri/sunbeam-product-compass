
import { RapidApiProduct } from '@/types/rapidApi';

export class ExcelService {
  static exportToExcel(products: RapidApiProduct[], selectedColumns?: string[]): void {
    // Enhanced headers mapping to user's template plus additional data
    const allHeaders = [
      'affiliate_link', 'title', 'image_url', 'gallery_image_urls', 'description', 'price', 'sale_price', 
      'rating', 'review_1', 'review_2', 'category', 'tags', 'sku', 'status', 'date_added', 'cta',
      'affiliate_network', 'commission_rate', 'availability', 'in_stock', 'specifications', 'custom_attributes', 'action',
      // Additional fields from current export
      'asin', 'unit_price', 'unit_count', 'currency', 'product_num_ratings', 'sales_volume',
      'product_num_offers', 'product_minimum_offer_price', 'is_best_seller', 'is_amazon_choice', 
      'is_prime', 'climate_pledge_friendly', 'has_variations', 'delivery', 'product_byline', 
      'coupon_text', 'product_badge', 'standing_screen_display_size', 'memory_storage_capacity', 'ram_memory_installed_size'
    ];

    const headersToUse = selectedColumns && selectedColumns.length > 0 ? selectedColumns : allHeaders;
    
    const headerLabels = headersToUse.map(header => {
      const labelMap: Record<string, string> = {
        // User's template headers
        'affiliate_link': 'Affiliate Link',
        'title': 'Title',
        'image_url': 'Image URL',
        'gallery_image_urls': 'Gallery Image URLs',
        'description': 'Description',
        'price': 'Price',
        'sale_price': 'Sale Price',
        'rating': 'Rating',
        'review_1': 'Review 1',
        'review_2': 'Review 2',
        'category': 'Category',
        'tags': 'Tags',
        'sku': 'SKU',
        'status': 'Status',
        'date_added': 'Date Added',
        'cta': 'Call to Action',
        'affiliate_network': 'Affiliate Network',
        'commission_rate': 'Commission Rate',
        'availability': 'Availability',
        'in_stock': 'In Stock',
        'specifications': 'Specifications',
        'custom_attributes': 'Custom Attributes',
        'action': 'Action',
        // Additional fields
        'asin': 'ASIN',
        'unit_price': 'Unit Price',
        'unit_count': 'Unit Count',
        'currency': 'Currency',
        'product_num_ratings': 'Number of Ratings',
        'sales_volume': 'Sales Volume',
        'product_num_offers': 'Number of Offers',
        'product_minimum_offer_price': 'Minimum Offer Price',
        'is_best_seller': 'Is Best Seller',
        'is_amazon_choice': 'Is Amazon Choice',
        'is_prime': 'Is Prime',
        'climate_pledge_friendly': 'Climate Pledge Friendly',
        'has_variations': 'Has Variations',
        'delivery': 'Delivery',
        'product_byline': 'Byline',
        'coupon_text': 'Coupon Text',
        'product_badge': 'Product Badge',
        'standing_screen_display_size': 'Display Size',
        'memory_storage_capacity': 'Storage Capacity',
        'ram_memory_installed_size': 'RAM Size'
      };
      return labelMap[header] || header;
    });

    const csvContent = [
      headerLabels.join(','),
      ...products.map(product => 
        headersToUse.map(header => {
          let value = this.mapProductData(product, header);
          if (typeof value === 'string') {
            return `"${value.replace(/"/g, '""')}"`;
          } else if (typeof value === 'boolean') {
            return value;
          } else if (typeof value === 'number') {
            return value;
          } else {
            return `"${value || ''}"`;
          }
        }).join(',')
      )
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

  private static mapProductData(product: RapidApiProduct, header: string): any {
    const getAffiliateUrl = (asin: string) => `http://www.amazon.com/dp/${asin}/ref=nosim?tag=homefitrecove-20`;
    
    const generateSpecs = () => {
      const specs = [];
      if (product.standing_screen_display_size) specs.push(`Display: ${product.standing_screen_display_size}`);
      if (product.memory_storage_capacity) specs.push(`Storage: ${product.memory_storage_capacity}`);
      if (product.ram_memory_installed_size) specs.push(`RAM: ${product.ram_memory_installed_size}`);
      if (product.unit_count > 1) specs.push(`Unit Count: ${product.unit_count}`);
      return specs.join('; ');
    };

    const generateTags = () => {
      const tags = [];
      if (product.is_best_seller) tags.push('Best Seller');
      if (product.is_amazon_choice) tags.push('Amazon Choice');
      if (product.is_prime) tags.push('Prime');
      if (product.climate_pledge_friendly) tags.push('Eco-Friendly');
      if (product.product_badge) tags.push(product.product_badge);
      return tags.join(', ');
    };

    const generateDescription = () => {
      const parts = [];
      if (product.product_description) parts.push(product.product_description);
      if (product.about_product?.length) parts.push(product.about_product.slice(0, 3).join(' '));
      if (product.customers_say) parts.push(`Customers say: ${product.customers_say}`);
      return parts.join(' ') || `High-quality ${product.product_title.toLowerCase()} with excellent customer reviews.`;
    };

    switch (header) {
      // User's template mapping
      case 'affiliate_link': return getAffiliateUrl(product.asin);
      case 'title': return product.product_title;
      case 'image_url': return product.product_photo;
      case 'gallery_image_urls': return ''; // Not available in current API
      case 'description': return generateDescription();
      case 'price': return product.product_price;
      case 'sale_price': return product.product_original_price || '';
      case 'rating': return product.product_star_rating;
      case 'review_1': return ''; // Not available in current API
      case 'review_2': return ''; // Not available in current API
      case 'category': return 'Electronics'; // Default category
      case 'tags': return generateTags();
      case 'sku': return product.asin;
      case 'status': return 'Active';
      case 'date_added': return new Date().toISOString().split('T')[0];
      case 'cta': return 'Buy Now - Best Price';
      case 'affiliate_network': return 'Amazon Associates';
      case 'commission_rate': return '4-8%';
      case 'availability': return product.product_availability || 'In Stock';
      case 'in_stock': return product.product_availability ? 'Yes' : 'Unknown';
      case 'specifications': return generateSpecs();
      case 'custom_attributes': return product.coupon_text || '';
      case 'action': return 'View Product';
      
      // Direct API field mapping
      default: return (product as any)[header] || '';
    }
  }

  private static cleanValue(value: string): string {
    return value.replace(/^"|"$/g, '').trim();
  }
}
