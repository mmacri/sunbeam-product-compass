
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

  const { selectedRapidApiProducts, loadSelectedProducts, saveSelectedProducts } = useSelectedProducts();
  const { realProducts, setRealProducts, loadAdminProducts } = useAdminProducts();
  const { isLoadingRapidApi, loadProductsFromRapidApi } = useRapidApiProducts();
  const { staleDataWarning, refreshData: refreshStaleData } = useStaleDataWarning();

  const loadInitialData = async () => {
    // Priority 1: Load selected products for user display
    const selectedProducts = loadSelectedProducts();
    
    if (!selectedProducts) {
      // Priority 2: Fallback to admin products
      const adminProducts = loadAdminProducts();
      if (adminProducts.length > 0) {
        const transformedProducts = adminProducts.map(transformAdminProduct);
        setProducts(transformedProducts);
        setSearchableProducts(adminProducts.map(transformToSearchableProduct));
      }

      // Priority 3: If no admin products and API available, try RapidAPI
      const rapidApiKey = localStorage.getItem('rapidapi-key');
      if (rapidApiKey && realProducts.length === 0) {
        const rapidProducts = await loadProductsFromRapidApi();
        if (rapidProducts.length > 0) {
          const transformedProducts = rapidProducts.map(transformRapidApiProduct);
          setProducts(transformedProducts);
          setFilteredProducts(transformedProducts);
          setSearchableProducts(rapidProducts.map(transformRapidApiToSearchableProduct));
        }
      }

      // Priority 4: Final fallback to mock data
      if (realProducts.length === 0 && selectedRapidApiProducts.length === 0) {
        setSearchableProducts(mockProducts.map(transformMockToSearchableProduct));
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
      }
    } else {
      const transformedProducts = selectedProducts.map(transformRapidApiProduct);
      setProducts(transformedProducts);
      setFilteredProducts(transformedProducts);
      setSearchableProducts(selectedProducts.map(transformRapidApiToSearchableProduct));
    }
  };

  const refreshData = async () => {
    refreshStaleData();
    
    // Reload selected products first
    const selectedProducts = loadSelectedProducts();
    
    const adminProducts = loadAdminProducts();
    if (adminProducts.length > 0 && selectedRapidApiProducts.length === 0) {
      const transformedProducts = adminProducts.map(transformAdminProduct);
      setProducts(transformedProducts);
      setSearchableProducts(adminProducts.map(transformToSearchableProduct));
    }

    if (selectedRapidApiProducts.length === 0) {
      const rapidProducts = await loadProductsFromRapidApi();
      if (rapidProducts.length > 0) {
        const transformedProducts = rapidProducts.map(transformRapidApiProduct);
        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
        setSearchableProducts(rapidProducts.map(transformRapidApiToSearchableProduct));
      }
    }
  };

  const handleSearchResults = (results: SearchableProduct[]) => {
    const resultIds = results.map(r => r.id);
    const filtered = products.filter(p => resultIds.includes(p.id.toString()));
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    loadInitialData();
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
    saveSelectedProducts
  };
};
