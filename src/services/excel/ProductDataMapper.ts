// Product data mapping service for Excel export

export class ProductDataMapper {
  static mapProductData(product: any, header: string): any {
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
      case 'review_2': return product.review_2_text || (product.about_product?.[1] || product.about_product?.[2] || '');
      
      // User's template mapping
      case 'affiliate_link': return getAffiliateUrl(product.asin);
      case 'title': return product.product_title;
      case 'image_url': return product.product_photo;
      case 'gallery_image_urls': return '';
      case 'description': return generateDescription();
      case 'price': return product.product_original_price || product.product_price;
      case 'sale_price': return product.product_price;
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
}