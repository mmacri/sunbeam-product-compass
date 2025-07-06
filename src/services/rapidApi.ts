
import { ProductSearchService } from './rapidApi/ProductSearchService';
import { ProductDetailsService } from './rapidApi/ProductDetailsService';
import { DataTransformationService } from './rapidApi/DataTransformationService';
import { DealsService } from './rapidApi/DealsService';
import { 
  RapidApiSearchResponse, 
  RapidApiProductDetails, 
  RapidApiReviewsResponse, 
  RapidApiOffersResponse, 
  RapidApiCategoryResponse,
  RapidApiDealsResponse,
  ProductData
} from '../types/rapidApi';

export class RapidApiService {
  private static apiKey: string = '';

  static setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    ProductSearchService.setApiKey(apiKey);
    ProductDetailsService.setApiKey(apiKey);
    DealsService.setApiKey(apiKey);
  }

  // Product Search
  static async searchProducts(query: string, options: {
    country?: string;
    sortBy?: string;
    condition?: string;
    page?: number;
    isPrime?: boolean;
    fourStarsAndUp?: boolean;
  } = {}): Promise<RapidApiSearchResponse> {
    return await ProductSearchService.searchProducts(query, options);
  }

  // Product Details
  static async getProductDetails(asin: string, country: string = 'US'): Promise<RapidApiProductDetails> {
    return await ProductDetailsService.getProductDetails(asin, country);
  }

  // Product Reviews
  static async getProductReviews(asin: string, country: string = 'US', page: number = 1): Promise<RapidApiReviewsResponse> {
    return await ProductDetailsService.getProductReviews(asin, country, page);
  }

  // Product Offers
  static async getProductOffers(asin: string, country: string = 'US'): Promise<RapidApiOffersResponse> {
    return await ProductDetailsService.getProductOffers(asin, country);
  }

  // Products by Category
  static async getProductsByCategory(category: string, country: string = 'US', page: number = 1): Promise<RapidApiCategoryResponse> {
    return await ProductSearchService.getProductsByCategory(category, country, page);
  }

  // Deals
  static async getDeals(options: {
    country?: string;
    minProductStarRating?: string;
    priceRange?: string;
    discountRange?: string;
    page?: number;
  } = {}): Promise<RapidApiDealsResponse> {
    return await DealsService.fetchDeals(options);
  }

  // Deals by ASINs
  static async getDealsByASINs(asins: string[], country: string = 'US'): Promise<RapidApiDealsResponse> {
    return await DealsService.fetchDealsByASINs(asins, country);
  }

  // Deals with Filter
  static async getDealsWithFilter(options: {
    country?: string;
    minRating?: number;
    maxPrice?: number;
    minDiscount?: number;
    dealTypes?: string[];
    onlyPrime?: boolean;
  } = {}): Promise<RapidApiDealsResponse> {
    return await DealsService.fetchDealsWithFilter(options);
  }

  // Enhanced Product Data Extraction
  static async extractProductData(url: string): Promise<ProductData> {
    // Extract ASIN from Amazon URL
    const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/i) || url.match(/\/gp\/product\/([A-Z0-9]{10})/i);
    if (!asinMatch) {
      throw new Error('Could not extract ASIN from Amazon URL');
    }

    const asin = asinMatch[1];
    console.log('Extracted ASIN:', asin);

    try {
      // Fetch comprehensive product data
      const [productDetails, reviews, offers] = await Promise.allSettled([
        this.getProductDetails(asin),
        this.getProductReviews(asin),
        this.getProductOffers(asin)
      ]);

      // Handle product details
      if (productDetails.status !== 'fulfilled') {
        throw new Error('Failed to fetch product details');
      }

      const details = productDetails.value;
      const reviewsData = reviews.status === 'fulfilled' ? reviews.value : null;
      const offersData = offers.status === 'fulfilled' ? offers.value : null;

      return DataTransformationService.transformProductData(details, reviewsData, offersData);
    } catch (error) {
      console.error('Failed to extract comprehensive product data:', error);
      
      // Fallback to search-based extraction
      try {
        const searchResults = await this.searchProducts(asin);
        const product = searchResults.products?.find(p => p.asin === asin) || searchResults.products?.[0];
        
        if (!product) {
          throw new Error('Product not found in search results');
        }

        return DataTransformationService.transformBasicProductData(product);
      } catch (fallbackError) {
        console.error('Fallback extraction also failed:', fallbackError);
        throw new Error('Failed to extract product data from URL');
      }
    }
  }
}
