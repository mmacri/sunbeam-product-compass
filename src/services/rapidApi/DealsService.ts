import { BaseRapidApiService } from './BaseRapidApiService';
import { RapidApiDealsResponse } from '@/types/rapidApi';

export class DealsService extends BaseRapidApiService {
  // Fetch all current deals
  static async fetchDeals(options: {
    country?: string;
    minProductStarRating?: string;
    priceRange?: string;
    discountRange?: string;
    page?: number;
  } = {}): Promise<RapidApiDealsResponse> {
    const params = {
      country: options.country || 'US',
      min_product_star_rating: options.minProductStarRating || 'ALL',
      price_range: options.priceRange || 'ALL',
      discount_range: options.discountRange || 'ALL',
      page: (options.page || 1).toString()
    };

    const response = await this.makeRequest('/deals-v2', params);
    
    // Transform response to match our expected structure
    return {
      status: response.status || 'OK',
      request_id: response.request_id || '',
      country: params.country,
      total_deals: response.total_deals || response.deals?.length || 0,
      deals: response.deals || []
    };
  }

  // Fetch deals for specific ASINs
  static async fetchDealsByASINs(asins: string[], country: string = 'US'): Promise<RapidApiDealsResponse> {
    try {
      // The deals API doesn't support filtering by ASIN directly,
      // so we fetch all deals and filter client-side
      const allDeals = await this.fetchDeals({ country });
      
      const filteredDeals = allDeals.deals.filter(deal => 
        asins.includes(deal.asin)
      );

      return {
        ...allDeals,
        total_deals: filteredDeals.length,
        deals: filteredDeals
      };
    } catch (error) {
      console.error('Failed to fetch deals by ASINs:', error);
      return {
        status: 'ERROR',
        request_id: '',
        country,
        total_deals: 0,
        deals: []
      };
    }
  }

  // Fetch deals with enhanced filtering
  static async fetchDealsWithFilter(options: {
    country?: string;
    minRating?: number;
    maxPrice?: number;
    minDiscount?: number;
    dealTypes?: string[];
    onlyPrime?: boolean;
  } = {}): Promise<RapidApiDealsResponse> {
    const allDeals = await this.fetchDeals({ 
      country: options.country,
      minProductStarRating: options.minRating ? options.minRating.toString() : 'ALL'
    });

    let filteredDeals = allDeals.deals;

    // Apply client-side filters
    if (options.maxPrice) {
      filteredDeals = filteredDeals.filter(deal => {
        const price = parseFloat(deal.product_price.replace(/[^0-9.]/g, ''));
        return price <= options.maxPrice!;
      });
    }

    if (options.minDiscount) {
      filteredDeals = filteredDeals.filter(deal => 
        deal.discount_percentage >= options.minDiscount!
      );
    }

    if (options.dealTypes && options.dealTypes.length > 0) {
      filteredDeals = filteredDeals.filter(deal => 
        options.dealTypes!.includes(deal.deal_type)
      );
    }

    if (options.onlyPrime) {
      filteredDeals = filteredDeals.filter(deal => deal.is_prime);
    }

    return {
      ...allDeals,
      total_deals: filteredDeals.length,
      deals: filteredDeals
    };
  }
}