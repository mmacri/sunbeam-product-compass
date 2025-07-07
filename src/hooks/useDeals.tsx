import { useState, useEffect } from 'react';
import { DealManager } from '@/services/DealManager';
import { RapidApiService } from '@/services/rapidApi';

interface Deal {
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

interface DealSyncResult {
  success: boolean;
  dealsProcessed: number;
  dealsAdded: number;
  dealsUpdated: number;
  dealsDeactivated: number;
  error?: string;
}

export const useDeals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch active deals from database
  const fetchActiveDeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const activeDeals = await DealManager.getActiveDeals();
      console.log('Fetched deals:', activeDeals.length, 'deals');
      console.log('Sample deal data:', activeDeals[0]);
      
      // Filter deals that have proper URLs for the hero banner
      const validDeals = activeDeals.filter(deal => 
        deal.deal_url && 
        deal.deal_title && 
        deal.deal_price !== null && 
        deal.original_price !== null
      );
      
      console.log('Valid deals with URLs:', validDeals.length);
      setDeals(validDeals);
    } catch (err) {
      console.error('Failed to fetch deals:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  };

  // Sync deals with API
  const syncDeals = async (): Promise<DealSyncResult> => {
    setSyncing(true);
    setError(null);
    try {
      const result = await DealManager.syncDeals();
      if (result.success) {
        // Refresh local deals after sync
        await fetchActiveDeals();
      } else {
        setError(result.error || 'Deal sync failed');
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sync failed';
      setError(errorMessage);
      return {
        success: false,
        dealsProcessed: 0,
        dealsAdded: 0,
        dealsUpdated: 0,
        dealsDeactivated: 0,
        error: errorMessage
      };
    } finally {
      setSyncing(false);
    }
  };

  // Get deals for specific product
  const getProductDeals = async (productId: string): Promise<Deal[]> => {
    try {
      return await DealManager.getProductDeals(productId);
    } catch (err) {
      console.error('Failed to fetch product deals:', err);
      return [];
    }
  };

  // Fetch deals from API (for preview/testing)
  const fetchApiDeals = async (options: {
    country?: string;
    minRating?: number;
    maxPrice?: number;
    minDiscount?: number;
    onlyPrime?: boolean;
  } = {}): Promise<any[]> => {
    setLoading(true);
    setError(null);
    try {
      const rapidApiKey = localStorage.getItem('rapidapi-key');
      if (!rapidApiKey) {
        throw new Error('RapidAPI key not configured');
      }

      RapidApiService.setApiKey(rapidApiKey);
      const response = await RapidApiService.getDealsWithFilter(options);
      
      if (response.status !== 'OK') {
        throw new Error('Failed to fetch deals from API');
      }

      return response.deals || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch API deals');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch deals on mount
  useEffect(() => {
    fetchActiveDeals();
  }, []);

  return {
    deals,
    loading,
    syncing,
    error,
    fetchActiveDeals,
    syncDeals,
    getProductDeals,
    fetchApiDeals,
    refetch: fetchActiveDeals
  };
};