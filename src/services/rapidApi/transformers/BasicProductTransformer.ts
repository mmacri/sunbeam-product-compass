
import { RapidApiProduct, ProductData } from '../../../types/rapidApi';
import { CategoryDetector } from '../utils/CategoryDetector';
import { FeatureGenerator } from '../utils/FeatureGenerator';
import { SpecsGenerator } from '../utils/SpecsGenerator';
import { MetaDataGenerator } from '../utils/MetaDataGenerator';

export class BasicProductTransformer {
  static transformBasicProductData(product: RapidApiProduct): ProductData {
    const title = product.product_title;
    const currentPrice = product.product_price;
    const originalPrice = product.product_original_price;
    const rating = parseFloat(product.product_star_rating) || undefined;
    const reviews = product.product_num_ratings;

    // Generate description from available data
    const description = this.generateDescription(product);
    
    // Detect category from title
    const category = CategoryDetector.detectFromText(title, description);
    
    // Generate key features
    const keyFeatures = FeatureGenerator.generateKeyFeatures(product);
    
    // Generate specs
    const specs = SpecsGenerator.generateSpecs(product);
    
    // Generate price history
    const priceHistory = SpecsGenerator.generatePriceHistory(currentPrice);
    
    // Generate meta tags and search terms
    const metaTags = MetaDataGenerator.generateMetaTags(title, description, category);
    const searchTerms = MetaDataGenerator.generateSearchTerms(title, description);
    
    return {
      title,
      currentPrice,
      originalPrice,
      description,
      rating,
      reviews,
      category,
      keyFeatures,
      specs,
      priceHistory,
      metaTags,
      searchTerms,
      categories: [category],
      images: [product.product_photo]
    };
  }

  private static generateDescription(product: RapidApiProduct): string {
    const features = [];
    
    if (product.is_best_seller) features.push('Amazon Best Seller');
    if (product.is_amazon_choice) features.push('Amazon\'s Choice');
    if (product.is_prime) features.push('Prime eligible');
    if (product.climate_pledge_friendly) features.push('Climate Pledge Friendly');
    if (product.sales_volume) features.push(`Popular item: ${product.sales_volume}`);
    if (product.coupon_text) features.push(product.coupon_text);
    if (product.product_badge) features.push(product.product_badge);

    const baseDescription = `High-quality ${product.product_title.toLowerCase()} with excellent customer reviews.`;
    const featuresText = features.length > 0 ? ` Special features: ${features.join(', ')}.` : '';
    const deliveryInfo = product.delivery ? ` ${product.delivery}` : '';

    return baseDescription + featuresText + deliveryInfo;
  }
}
