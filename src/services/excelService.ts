import { RapidApiProduct, RapidApiReview } from '@/types/rapidApi';
import { RapidApiService } from './rapidApi';

export class ExcelService {
  static exportToExcel(products: RapidApiProduct[], selectedColumns?: string[]): void {
    // Complete A to AU columns (47 total) - User's template columns
    const userTemplateHeaders = [
      'affiliate_link', 'title', 'image_url', 'gallery_image_urls', 'description', 'price', 'sale_price', 
      'rating', 'review_1', 'review_2', 'category', 'tags', 'sku', 'status', 'date_added', 'cta',
      'affiliate_network', 'commission_rate', 'availability', 'in_stock', 'specifications', 'custom_attributes', 'action',
      'brand', 'model', 'color', 'size', 'weight', 'dimensions', 'material', 'warranty', 'manufacturer',
      'upc', 'isbn', 'shipping_weight', 'package_dimensions', 'item_weight', 'product_dimensions',
      'batteries_required', 'batteries_included', 'assembly_required', 'country_of_origin', 'target_audience',
      'age_range', 'style', 'pattern', 'features', 'compatibility', 'certification', 'energy_efficiency'
    ];
    
    // Additional API fields not in user template
    const additionalApiFields = [
      'asin', 'product_title', 'unit_price', 'unit_count', 'currency', 'product_num_ratings', 'sales_volume',
      'product_url', 'product_photo', 'product_num_offers', 'product_minimum_offer_price', 'is_best_seller', 
      'is_amazon_choice', 'is_prime', 'climate_pledge_friendly', 'has_variations', 'delivery', 'product_byline', 
      'coupon_text', 'product_badge', 'product_original_price', 'standing_screen_display_size', 
      'memory_storage_capacity', 'ram_memory_installed_size'
    ];

    const allHeaders = [...userTemplateHeaders, ...additionalApiFields];
    const headersToUse = selectedColumns && selectedColumns.length > 0 ? selectedColumns : allHeaders;
    
    const csvContent = [
      headersToUse.join(','),
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

  // Enhanced export with real reviews fetching
  static async exportToExcelWithReviews(products: RapidApiProduct[], selectedColumns?: string[], onProgress?: (current: number, total: number) => void): Promise<void> {
    console.log('Starting enhanced export with reviews for', products.length, 'products');
    
    // Fetch reviews for each product
    const enhancedProducts = await Promise.all(
      products.map(async (product, index) => {
        try {
          if (onProgress) onProgress(index + 1, products.length);
          
          console.log(`Fetching reviews for product ${index + 1}/${products.length}: ${product.product_title}`);
          const reviewsResponse = await RapidApiService.getProductReviews(product.asin, 'US', 1);
          
          const topReviews = reviewsResponse.reviews?.slice(0, 2) || [];
          
          return {
            ...product,
            // Add fetched review data
            review_1_text: topReviews[0]?.review_comment || '',
            review_1_title: topReviews[0]?.review_title || '',
            review_1_rating: topReviews[0]?.review_star_rating || '',
            review_2_text: topReviews[1]?.review_comment || '',
            review_2_title: topReviews[1]?.review_title || '',
            review_2_rating: topReviews[1]?.review_star_rating || '',
            total_reviews_fetched: reviewsResponse.total_reviews || 0
          };
        } catch (error) {
          console.error(`Failed to fetch reviews for ${product.asin}:`, error);
          return {
            ...product,
            review_1_text: '',
            review_1_title: '',
            review_1_rating: '',
            review_2_text: '', 
            review_2_title: '',
            review_2_rating: '',
            total_reviews_fetched: 0
          };
        }
      })
    );

    // Now export with enhanced data
    this.exportEnhancedProductsToCSV(enhancedProducts, selectedColumns);
  }

  private static exportEnhancedProductsToCSV(enhancedProducts: any[], selectedColumns?: string[]): void {
    // Complete A to AU columns (47 total) - User's template columns
    const userTemplateHeaders = [
      'affiliate_link', 'title', 'image_url', 'gallery_image_urls', 'description', 'price', 'sale_price', 
      'rating', 'review_1', 'review_2', 'category', 'tags', 'sku', 'status', 'date_added', 'cta',
      'affiliate_network', 'commission_rate', 'availability', 'in_stock', 'specifications', 'custom_attributes', 'action',
      'brand', 'model', 'color', 'size', 'weight', 'dimensions', 'material', 'warranty', 'manufacturer',
      'upc', 'isbn', 'shipping_weight', 'package_dimensions', 'item_weight', 'product_dimensions',
      'batteries_required', 'batteries_included', 'assembly_required', 'country_of_origin', 'target_audience',
      'age_range', 'style', 'pattern', 'features', 'compatibility', 'certification', 'energy_efficiency'
    ];
    
    // Additional API fields not in user template
    const additionalApiFields = [
      'asin', 'product_title', 'unit_price', 'unit_count', 'currency', 'product_num_ratings', 'sales_volume',
      'product_url', 'product_photo', 'product_num_offers', 'product_minimum_offer_price', 'is_best_seller', 
      'is_amazon_choice', 'is_prime', 'climate_pledge_friendly', 'has_variations', 'delivery', 'product_byline', 
      'coupon_text', 'product_badge', 'product_original_price', 'standing_screen_display_size', 
      'memory_storage_capacity', 'ram_memory_installed_size'
    ];

    const allHeaders = [...userTemplateHeaders, ...additionalApiFields];
    const headersToUse = selectedColumns && selectedColumns.length > 0 ? selectedColumns : allHeaders;
    
    const csvContent = [
      headersToUse.join(','),
      ...enhancedProducts.map(product => 
        headersToUse.map(header => {
          let value = this.mapEnhancedProductData(product, header);
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
    link.setAttribute('download', `sunbeam-products-with-reviews-${new Date().toISOString().split('T')[0]}.csv`);
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

  private static mapEnhancedProductData(product: any, header: string): any {
    // Enhanced mapping that uses fetched review data
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
      // Enhanced review mapping using fetched data
      case 'review_1': return product.review_1_text || product.customers_say || (product.about_product?.[0] || '');
      case 'review_2': return product.review_2_text || product.about_product?.[1] || product.about_product?.[2] || '';
      
      // Use regular mapping for other fields
      case 'affiliate_link': return getAffiliateUrl(product.asin);
      case 'title': return product.product_title;
      case 'image_url': return product.product_photo;
      case 'gallery_image_urls': return '';
      case 'description': return generateDescription();
      case 'price': return product.product_price;
      case 'sale_price': return product.product_original_price || '';
      case 'rating': return product.product_star_rating;
      case 'category': return product.product_byline || 'Electronics';
      case 'tags': return generateTags();
      case 'sku': return product.asin;
      case 'status': return 'Active';
      case 'date_added': return new Date().toISOString().split('T')[0];
      case 'cta': return 'Buy Now - Best Price';
      case 'affiliate_network': return 'Amazon Associates';
      case 'commission_rate': return '4-8%';
      case 'availability': return product.product_availability || 'In Stock';
      case 'in_stock': return product.product_availability !== 'Out of Stock' ? 'Yes' : 'No';
      case 'specifications': return generateSpecs();
      case 'custom_attributes': return product.coupon_text || '';
      case 'action': return 'View Product';
      
      // Additional template columns
      case 'brand': return product.product_byline || '';
      case 'model': return product.asin;
      case 'color': return '';
      case 'size': return product.standing_screen_display_size || '';
      case 'weight': return '';
      case 'dimensions': return product.standing_screen_display_size || '';
      case 'material': return '';
      case 'warranty': return '';
      case 'manufacturer': return product.product_byline || '';
      case 'upc': return '';
      case 'isbn': return '';
      case 'shipping_weight': return '';
      case 'package_dimensions': return '';
      case 'item_weight': return '';
      case 'product_dimensions': return product.standing_screen_display_size || '';
      case 'batteries_required': return '';
      case 'batteries_included': return '';
      case 'assembly_required': return '';
      case 'country_of_origin': return '';
      case 'target_audience': return '';
      case 'age_range': return '';
      case 'style': return '';
      case 'pattern': return '';
      case 'features': return product.about_product?.join('; ') || '';
      case 'compatibility': return '';
      case 'certification': return product.climate_pledge_friendly ? 'Climate Pledge Friendly' : '';
      case 'energy_efficiency': return product.climate_pledge_friendly ? 'Energy Star' : '';
      
      // Direct API field mapping
      default: return (product as any)[header] || '';
    }
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
      case 'gallery_image_urls': return '';
      case 'description': return generateDescription();
      case 'price': return product.product_price;
      case 'sale_price': return product.product_original_price || '';
      case 'rating': return product.product_star_rating;
      case 'review_1': return product.customers_say || (product.about_product?.[0] || '');
      case 'review_2': return product.about_product?.[1] || product.about_product?.[2] || '';
      case 'category': return product.product_byline || 'Electronics';
      case 'tags': return generateTags();
      case 'sku': return product.asin;
      case 'status': return 'Active';
      case 'date_added': return new Date().toISOString().split('T')[0];
      case 'cta': return 'Buy Now - Best Price';
      case 'affiliate_network': return 'Amazon Associates';
      case 'commission_rate': return '4-8%';
      case 'availability': return product.product_availability || 'In Stock';
      case 'in_stock': return product.product_availability !== 'Out of Stock' ? 'Yes' : 'No';
      case 'specifications': return generateSpecs();
      case 'custom_attributes': return product.coupon_text || '';
      case 'action': return 'View Product';
      
      // Additional template columns
      case 'brand': return product.product_byline || '';
      case 'model': return product.asin;
      case 'color': return '';
      case 'size': return product.standing_screen_display_size || '';
      case 'weight': return '';
      case 'dimensions': return product.standing_screen_display_size || '';
      case 'material': return '';
      case 'warranty': return '';
      case 'manufacturer': return product.product_byline || '';
      case 'upc': return '';
      case 'isbn': return '';
      case 'shipping_weight': return '';
      case 'package_dimensions': return '';
      case 'item_weight': return '';
      case 'product_dimensions': return product.standing_screen_display_size || '';
      case 'batteries_required': return '';
      case 'batteries_included': return '';
      case 'assembly_required': return '';
      case 'country_of_origin': return '';
      case 'target_audience': return '';
      case 'age_range': return '';
      case 'style': return '';
      case 'pattern': return '';
      case 'features': return product.about_product?.join('; ') || '';
      case 'compatibility': return '';
      case 'certification': return product.climate_pledge_friendly ? 'Climate Pledge Friendly' : '';
      case 'energy_efficiency': return product.climate_pledge_friendly ? 'Energy Star' : '';
      
      // Direct API field mapping
      default: return (product as any)[header] || '';
    }
  }

  private static cleanValue(value: string): string {
    return value.replace(/^"|"$/g, '').trim();
  }
}