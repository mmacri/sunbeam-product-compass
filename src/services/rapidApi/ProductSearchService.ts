
import { BaseRapidApiService } from './BaseRapidApiService';
import { RapidApiSearchResponse, RapidApiCategoryResponse } from '../../types/rapidApi';

export class ProductSearchService extends BaseRapidApiService {
  // Product Search
  static async searchProducts(query: string, options: {
    country?: string;
    sortBy?: string;
    condition?: string;
    page?: number;
    isPrime?: boolean;
    fourStarsAndUp?: boolean;
  } = {}): Promise<RapidApiSearchResponse> {
    const params = {
      query,
      country: options.country || 'US',
      sort_by: options.sortBy || 'BEST_SELLERS',
      product_condition: options.condition || 'NEW',
      deals_and_discounts: 'ALL_DISCOUNTS',
      page: (options.page || 1).toString(),
      is_prime: (options.isPrime || false).toString(),
      four_stars_and_up: (options.fourStarsAndUp || true).toString()
    };

    return await this.makeRequest('/search', params);
  }

  // Products by Category
  static async getProductsByCategory(category: string, country: string = 'US', page: number = 1): Promise<RapidApiCategoryResponse> {
    const params = {
      category,
      country,
      page: page.toString()
    };

    return await this.makeRequest('/products-by-category', params);
  }
}
