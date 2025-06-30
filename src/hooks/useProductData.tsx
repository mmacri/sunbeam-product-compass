
import { useState, useEffect } from 'react';
import { mockProducts } from '@/utils/mockData';
import { useSelectedProducts } from './useSelectedProducts';
import { useAdminProducts } from './useAdminProducts';
import { useRapidApiProducts } from './useRapidApiProducts';
import { useStaleDataWarning } from './useStaleDataWarning';
import {
  transformRapidApiProduct,
  transformRapidApiToSearchableProduct,
  transformAdminProduct,
  transformToSearchableProduct,
  transformMockToSearchableProduct
} from '@/utils/productTransformers';

interface SearchableProduct {
  id: string;
  title: string;
  price: string;
  category: string;
  categories?: string[];
  metaTags?: string[];
  searchTerms?: string[];
  tags: string[];
  lastUpdated: string;
}

interface Product {
  id: string | number;
  title: string;
  currentPrice: string;
  originalPrice: string;
  rating: number;
  reviews: number;
  category: string;
  description: string;
  keyFeatures: string[];
  specs: Record<string, string>;
  stores: Array<{ name: string; url: string }>;
  priceHistory: Array<{ date: string; price: string; store: string }>;
}

export const useProductData = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchableProducts, setSearchableProducts] = useState<SearchableProduct[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const { selectedRapidApiProducts, loadSelectedProducts, saveSelectedProducts } = useSelectedProducts();
  const { realProducts, setRealProducts, loadAdminProducts } = useAdminProducts();
  const { isLoadingRapidApi, loadProductsFromRapidApi } = useRapidApiProducts();
  const { staleDataWarning, refreshData: refreshStaleData } = useStaleDataWarning();

  const loadInitialData = async () => {
    if (isInitialized) return;
    
    console.log('Loading initial data...');
    
    try {
      // Priority 1: Load selected products for user display
      const selectedProducts = loadSelectedProducts();
      
      if (selectedProducts && selectedProducts.length > 0) {
        console.log('Using selected RapidAPI products:', selectedProducts.length);
        const transformedProducts = selectedProducts.map(transformRapidApiProduct);
        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
        setSearchableProducts(selectedProducts.map(transformRapidApiToSearchableProduct));
        setIsInitialized(true);
        return;
      }

      // Priority 2: Load admin products
      const adminProducts = loadAdminProducts();
      if (adminProducts.length > 0) {
        console.log('Using admin products:', adminProducts.length);
        const transformedProducts = adminProducts.map(transformAdminProduct);
        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
        setSearchableProducts(adminProducts.map(transformToSearchableProduct));
        setIsInitialized(true);
        return;
      }

      // Priority 3: Try RapidAPI if configured
      const rapidApiKey = localStorage.getItem('rapidapi-key');
      if (rapidApiKey) {
        console.log('Attempting to load from RapidAPI...');
        const rapidProducts = await loadProductsFromRapidApi();
        if (rapidProducts.length > 0) {
          console.log('Using RapidAPI products:', rapidProducts.length);
          const transformedProducts = rapidProducts.map(transformRapidApiProduct);
          setProducts(transformedProducts);
          setFilteredProducts(transformedProducts);
          setSearchableProducts(rapidProducts.map(transformRapidApiToSearchableProduct));
          setIsInitialized(true);
          return;
        }
      }

      // Priority 4: Fallback to mock data
      console.log('Using mock products as fallback');
      setSearchableProducts(mockProducts.map(transformMockToSearchableProduct));
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setIsInitialized(true);
      
    } catch (error) {
      console.error('Error loading initial data:', error);
      // Fallback to mock data on error
      setSearchableProducts(mockProducts.map(transformMockToSearchableProduct));
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setIsInitialized(true);
    }
  };

  const refreshData = async () => {
    setIsInitialized(false);
    refreshStaleData();
    await loadInitialData();
  };

  const handleSearchResults = (results: SearchableProduct[]) => {
    const resultIds = results.map(r => r.id);
    const filtered = products.filter(p => resultIds.includes(p.id.toString()));
    setFilteredProducts(filtered);
  };

  // Initialize data on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Re-initialize when selected products change
  useEffect(() => {
    if (isInitialized && selectedRapidApiProducts.length > 0) {
      setIsInitialized(false);
      loadInitialData();
    }
  }, [selectedRapidApiProducts.length]);

  return {
    products,
    filteredProducts,
    searchableProducts,
    staleDataWarning,
    realProducts,
    isLoadingRapidApi,
    selectedRapidApiProducts,
    handleSearchResults,
    refreshData,
    saveSelectedProducts,
    isInitialized
  };
};
