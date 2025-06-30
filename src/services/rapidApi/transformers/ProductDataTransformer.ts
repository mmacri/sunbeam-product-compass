
import { 
  RapidApiProductDetails, 
  RapidApiReviewsResponse, 
  RapidApiOffersResponse, 
  ProductData 
} from '../../../types/rapidApi';
import { CategoryDetector } from '../utils/CategoryDetector';
import { FeatureGenerator } from '../utils/FeatureGenerator';
import { SpecsGenerator } from '../utils/SpecsGenerator';
import { MetaDataGenerator } from '../utils/MetaDataGenerator';

export class ProductDataTransformer {
  static transformProductData(
    details: RapidApiProductDetails, 
    reviewsData: RapidApiReviewsResponse | null, 
    offersData: RapidApiOffersResponse | null
  ): ProductData {
    const title = details.product_title;
    const currentPrice = details.product_price;
    const originalPrice = details.product_original_price;
    const rating = parseFloat(details.product_star_rating) || undefined;
    const reviews = details.product_num_ratings;

    // Enhanced description from multiple sources
    const description = this.generateEnhancedDescription(details);
    
    // Category from category path
    const category = details.category_path?.length > 0 
      ? details.category_path[details.category_path.length - 1].name 
      : CategoryDetector.detectFromText(title, description);
    
    // Key features from about_product
    const keyFeatures = details.about_product?.slice(0, 5) || FeatureGenerator.generateKeyFeatures(details);
    
    // Specs from product details and information
    const specs = SpecsGenerator.generateEnhancedSpecs(details);
    
    // Price history (simulated for now)
    const priceHistory = SpecsGenerator.generatePriceHistory(currentPrice);
    
    // Meta tags and search terms
    const metaTags = MetaDataGenerator.generateMetaTags(title, description, category);
    const searchTerms = MetaDataGenerator.generateSearchTerms(title, description);
    
    // Images
    const images = [details.product_photo, ...(details.product_photos || [])].filter(Boolean);
    
    // Offers
    const offers = offersData?.offers?.map(offer => ({
      seller: offer.seller_name,
      price: offer.offer_price,
      condition: offer.offer_condition,
      shipping: offer.offer_shipping_price,
      isPrime: offer.is_prime
    })) || [];

    // Review excerpts
    const reviewExcerpts = reviewsData?.reviews?.slice(0, 5).map(review => ({
      title: review.review_title,
      text: review.review_comment.substring(0, 200) + '...',
      rating: parseFloat(review.review_star_rating),
      date: review.review_date,
      verified: review.verified_purchase
    })) || [];
    
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
      categories: details.category_path?.map(cat => cat.name) || [category],
      images,
      offers,
      reviewExcerpts
    };
  }

  private static generateEnhancedDescription(details: RapidApiProductDetails): string {
    const parts = [];
    
    if (details.product_description) {
      parts.push(details.product_description);
    }
    
    if (details.customers_say) {
      parts.push(`Customers say: ${details.customers_say}`);
    }
    
    if (details.about_product?.length > 0) {
      parts.push(details.about_product.slice(0, 3).join(' '));
    }
    
    return parts.join(' ') || `High-quality ${details.product_title.toLowerCase()} with excellent customer reviews.`;
  }
}
