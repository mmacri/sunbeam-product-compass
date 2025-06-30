
import { BaseRapidApiService } from './BaseRapidApiService';
import { RapidApiProductDetails, RapidApiReviewsResponse, RapidApiOffersResponse } from '../../types/rapidApi';

export class ProductDetailsService extends BaseRapidApiService {
  // Product Details
  static async getProductDetails(asin: string, country: string = 'US'): Promise<RapidApiProductDetails> {
    const params = {
      asin,
      country
    };

    return await this.makeRequest('/product-details', params);
  }

  // Product Reviews
  static async getProductReviews(asin: string, country: string = 'US', page: number = 1): Promise<RapidApiReviewsResponse> {
    const params = {
      asin,
      country,
      page: page.toString()
    };

    return await this.makeRequest('/product-reviews', params);
  }

  // Product Offers
  static async getProductOffers(asin: string, country: string = 'US'): Promise<RapidApiOffersResponse> {
    const params = {
      asin,
      country
    };

    return await this.makeRequest('/product-offers', params);
  }
}
