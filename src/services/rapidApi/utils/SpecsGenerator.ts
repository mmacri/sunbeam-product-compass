
import { RapidApiProduct, RapidApiProductDetails } from '../../../types/rapidApi';

export class SpecsGenerator {
  static generateEnhancedSpecs(details: RapidApiProductDetails): Record<string, string> {
    const specs: Record<string, string> = {
      'ASIN': details.asin,
      'Rating': `${details.product_star_rating}/5`,
      'Reviews': details.product_num_ratings.toLocaleString(),
      'Price': details.product_price,
      'Currency': details.currency
    };

    // Add product details
    if (details.product_details) {
      Object.assign(specs, details.product_details);
    }

    // Add product information
    if (details.product_information) {
      Object.assign(specs, details.product_information);
    }

    // Add sales rank
    if (details.sales_rank?.length > 0) {
      details.sales_rank.forEach((rank, index) => {
        specs[`Sales Rank ${index + 1}`] = `#${rank.rank} in ${rank.category}`;
      });
    }

    return specs;
  }

  static generateSpecs(product: RapidApiProduct): Record<string, string> {
    const specs: Record<string, string> = {
      'ASIN': product.asin,
      'Rating': `${product.product_star_rating}/5`,
      'Reviews': product.product_num_ratings.toLocaleString(),
      'Price': product.product_price,
      'Currency': product.currency
    };

    if (product.product_original_price && product.product_original_price !== product.product_price) {
      specs['Original Price'] = product.product_original_price;
    }

    if (product.unit_count > 1) {
      specs['Unit Count'] = product.unit_count.toString();
      specs['Unit Price'] = product.unit_price;
    }

    if (product.product_byline) {
      specs['Product Details'] = product.product_byline;
    }

    if (product.product_num_offers > 1) {
      specs['Available Offers'] = product.product_num_offers.toString();
      specs['Minimum Offer Price'] = product.product_minimum_offer_price;
    }

    return specs;
  }

  static generatePriceHistory(currentPrice: string): Array<{date: string; price: string; store: string}> {
    const price = parseFloat(currentPrice.replace(/[^0-9.]/g, ''));
    const variations = [0.95, 1.05, 0.98, 1.02, 0.92];
    
    return variations.map((multiplier, index) => ({
      date: new Date(Date.now() - (index + 1) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      price: `$${(price * multiplier).toFixed(2)}`,
      store: 'Amazon'
    }));
  }
}
