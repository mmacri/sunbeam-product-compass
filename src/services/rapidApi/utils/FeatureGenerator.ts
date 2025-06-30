
import { RapidApiProduct, RapidApiProductDetails } from '../../../types/rapidApi';

export class FeatureGenerator {
  static generateKeyFeatures(product: RapidApiProduct | RapidApiProductDetails): string[] {
    const features = [];

    if ('is_best_seller' in product && product.is_best_seller) features.push('Amazon Best Seller');
    if ('is_amazon_choice' in product && product.is_amazon_choice) features.push('Amazon\'s Choice product');
    if ('climate_pledge_friendly' in product && product.climate_pledge_friendly) features.push('Climate Pledge Friendly certified');
    if ('product_num_ratings' in product && product.product_num_ratings > 1000) features.push(`Highly rated with ${product.product_num_ratings.toLocaleString()} reviews`);
    if ('coupon_text' in product && product.coupon_text) features.push(product.coupon_text);
    if ('sales_volume' in product && product.sales_volume) features.push(`Popular: ${product.sales_volume}`);

    // Add generic features to fill up to 5
    const genericFeatures = [
      'Fast and reliable shipping',
      'Customer satisfaction guaranteed',
      'Quality construction and materials'
    ];

    features.push(...genericFeatures);
    return features.slice(0, 5);
  }
}
