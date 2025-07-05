import { RapidApiProduct } from '@/types/rapidApi';
import { RapidApiService } from '@/services/rapidApi';

// Service for enhancing products with real review data from the API

export class ProductReviewEnhancer {
  static async enhanceProductsWithReviews(
    products: RapidApiProduct[], 
    onProgress?: (current: number, total: number) => void
  ): Promise<any[]> {
    console.log('Enhancing products with reviews for', products.length, 'products');
    
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

    return enhancedProducts;
  }
}