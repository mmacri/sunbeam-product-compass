
import { useState } from 'react';
import { RapidApiService } from '@/services/rapidApi';

export const useRapidApiProducts = () => {
  const [isLoadingRapidApi, setIsLoadingRapidApi] = useState(false);

  const loadProductsFromRapidApi = async () => {
    const rapidApiKey = localStorage.getItem('rapidapi-key');
    if (!rapidApiKey) return [];

    setIsLoadingRapidApi(true);
    try {
      RapidApiService.setApiKey(rapidApiKey);
      const searchResults = await RapidApiService.searchProducts('best sellers', {
        sortBy: 'BEST_SELLERS',
        country: 'US',
        page: 1
      });

      if (searchResults.products && searchResults.products.length > 0) {
        return searchResults.products.slice(0, 10);
      }
    } catch (error) {
      console.error('Failed to load products from RapidAPI:', error);
    } finally {
      setIsLoadingRapidApi(false);
    }
    return [];
  };

  return {
    isLoadingRapidApi,
    loadProductsFromRapidApi
  };
};
