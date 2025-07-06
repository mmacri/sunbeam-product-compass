import { supabase } from '@/integrations/supabase/client';
import { DealsService } from './rapidApi/DealsService';
import { RapidApiDeal, RapidApiDealsResponse } from '@/types/rapidApi';

interface DatabaseDeal {
  id: string;
  product_id: string | null;
  asin: string;
  deal_title: string | null;
  original_price: number | null;
  deal_price: number | null;
  discount_percentage: number | null;
  deal_start_date: string | null;
  deal_end_date: string | null;
  deal_type: string | null;
  is_active: boolean;
  deal_url: string | null;
  raw_deal_data: any;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: string;
  asin: string | null;
  name: string;
  current_deal_id: string | null;
  has_active_deal: boolean;
  deal_last_updated: string | null;
}

export class DealManager {
  // Main function to sync deals with database
  static async syncDeals(): Promise<{
    success: boolean;
    dealsProcessed: number;
    dealsAdded: number;
    dealsUpdated: number;
    dealsDeactivated: number;
    error?: string;
  }> {
    try {
      console.log('Starting deal sync...');
      
      // Get products with ASINs for matching first
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, asin, name, current_deal_id, has_active_deal, deal_last_updated')
        .not('asin', 'is', null);

      if (productsError) {
        throw new Error(`Failed to fetch products: ${productsError.message}`);
      }

      console.log(`Found ${products?.length || 0} products with ASINs`);
      
      // Log a sample of ASINs for debugging
      if (products && products.length > 0) {
        console.log('Sample product ASINs:', products.slice(0, 5).map(p => p.asin));
      }
      
      // Fetch current deals from API
      const dealsResponse = await DealsService.fetchDeals();
      
      if (dealsResponse.status !== 'OK' || !dealsResponse.deals) {
        console.error('Deal API response:', dealsResponse);
        throw new Error('Failed to fetch deals from API');
      }

      console.log(`Fetched ${dealsResponse.deals.length} deals from API`);
      
      // Log a sample of deal ASINs for debugging
      if (dealsResponse.deals.length > 0) {
        console.log('Sample deal ASINs:', dealsResponse.deals.slice(0, 5).map(d => d.product_asin));
      }

      // Find matching ASINs
      const productASINs = new Set(products?.map(p => p.asin) || []);
      const matchingDeals = dealsResponse.deals.filter(deal => productASINs.has(deal.product_asin));
      
      console.log(`Found ${matchingDeals.length} matching deals out of ${dealsResponse.deals.length} total deals`);

      let dealsAdded = 0;
      let dealsUpdated = 0;
      let dealsDeactivated = 0;

      // Process each matching deal
      for (const deal of matchingDeals) {
        const result = await this.processDeal(deal, products || []);
        if (result.added) dealsAdded++;
        if (result.updated) dealsUpdated++;
        if (result.deactivated) dealsDeactivated++;
      }

      // Cleanup expired deals
      await this.cleanupExpiredDeals();

      console.log(`Deal sync completed: ${dealsAdded} added, ${dealsUpdated} updated, ${dealsDeactivated} deactivated`);

      return {
        success: true,
        dealsProcessed: dealsResponse.deals.length,
        dealsAdded,
        dealsUpdated,
        dealsDeactivated
      };
    } catch (error) {
      console.error('Deal sync failed:', error);
      return {
        success: false,
        dealsProcessed: 0,
        dealsAdded: 0,
        dealsUpdated: 0,
        dealsDeactivated: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Process individual deal
  private static async processDeal(
    deal: RapidApiDeal, 
    products: Product[]
  ): Promise<{ added: boolean; updated: boolean; deactivated: boolean }> {
    // Find matching product by ASIN
    const matchingProduct = products.find(p => p.asin === deal.product_asin);
    
    if (!matchingProduct) {
      console.log(`No matching product found for ASIN: ${deal.product_asin}`);
      return { added: false, updated: false, deactivated: false };
    }

    // Check if deal already exists
    const { data: existingDeal } = await supabase
      .from('product_deals')
      .select('*')
      .eq('asin', deal.product_asin)
      .eq('is_active', true)
      .single();

    const dealData = this.transformDealData(deal, matchingProduct.id);
    const dealStartTime = deal.deal_starts_at ? new Date(deal.deal_starts_at) : new Date();

    if (existingDeal) {
      // Check if this deal is newer than existing one
      const existingStartTime = existingDeal.deal_start_date ? new Date(existingDeal.deal_start_date) : new Date(0);
      
      if (dealStartTime > existingStartTime) {
        // Update with newer deal
        await this.updateDeal(existingDeal.id, dealData, matchingProduct.id);
        return { added: false, updated: true, deactivated: false };
      } else {
        // Keep existing deal (it's newer or same)
        return { added: false, updated: false, deactivated: false };
      }
    } else {
      // Create new deal
      await this.createDeal(dealData, matchingProduct.id);
      return { added: true, updated: false, deactivated: false };
    }
  }

  // Transform API deal data to database format
  private static transformDealData(deal: RapidApiDeal, productId: string) {
    const originalPrice = parseFloat(deal.list_price.amount || '0');
    const dealPrice = parseFloat(deal.deal_price.amount || '0');

    return {
      product_id: productId,
      asin: deal.product_asin,
      deal_title: deal.deal_title,
      original_price: originalPrice || null,
      deal_price: dealPrice || null,
      discount_percentage: deal.savings_percentage || null,
      deal_start_date: deal.deal_starts_at || new Date().toISOString(),
      deal_end_date: deal.deal_ends_at || null,
      deal_type: deal.deal_type || 'deal',
      deal_url: deal.deal_url,
      raw_deal_data: deal,
      is_active: true
    };
  }

  // Create new deal in database
  private static async createDeal(dealData: any, productId: string) {
    const { data: newDeal, error } = await supabase
      .from('product_deals')
      .insert(dealData)
      .select('id')
      .single();

    if (error) {
      console.error('Failed to create deal:', error);
      return;
    }

    // Update product with deal reference
    await supabase
      .from('products')
      .update({
        current_deal_id: newDeal.id,
        has_active_deal: true,
        deal_last_updated: new Date().toISOString()
      })
      .eq('id', productId);

    console.log(`Created new deal for product ${productId}`);
  }

  // Update existing deal
  private static async updateDeal(dealId: string, dealData: any, productId: string) {
    const { error } = await supabase
      .from('product_deals')
      .update(dealData)
      .eq('id', dealId);

    if (error) {
      console.error('Failed to update deal:', error);
      return;
    }

    // Update product's deal timestamp
    await supabase
      .from('products')
      .update({
        deal_last_updated: new Date().toISOString()
      })
      .eq('id', productId);

    console.log(`Updated deal ${dealId} for product ${productId}`);
  }

  // Cleanup expired deals
  static async cleanupExpiredDeals() {
    const now = new Date().toISOString();
    
    // Deactivate expired deals
    const { data: expiredDeals, error } = await supabase
      .from('product_deals')
      .update({ is_active: false })
      .lt('deal_end_date', now)
      .eq('is_active', true)
      .select('product_id');

    if (error) {
      console.error('Failed to cleanup expired deals:', error);
      return;
    }

    // Update products that no longer have active deals
    if (expiredDeals && expiredDeals.length > 0) {
      const productIds = expiredDeals.map(deal => deal.product_id).filter(Boolean);
      
      for (const productId of productIds) {
        // Check if product has any other active deals
        const { count } = await supabase
          .from('product_deals')
          .select('*', { count: 'exact', head: true })
          .eq('product_id', productId)
          .eq('is_active', true);

        if (count === 0) {
          // No active deals, update product
          await supabase
            .from('products')
            .update({
              current_deal_id: null,
              has_active_deal: false
            })
            .eq('id', productId);
        }
      }
    }

    console.log(`Cleaned up ${expiredDeals?.length || 0} expired deals`);
  }

  // Get deals for specific product
  static async getProductDeals(productId: string): Promise<DatabaseDeal[]> {
    const { data, error } = await supabase
      .from('product_deals')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch product deals:', error);
      return [];
    }

    return data || [];
  }

  // Get all active deals
  static async getActiveDeals(): Promise<DatabaseDeal[]> {
    const { data, error } = await supabase
      .from('product_deals')
      .select('*')
      .eq('is_active', true)
      .order('discount_percentage', { ascending: false });

    if (error) {
      console.error('Failed to fetch active deals:', error);
      return [];
    }

    return data || [];
  }
}
