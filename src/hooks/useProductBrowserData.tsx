import { useState, useEffect, useMemo } from 'react';
import { RapidApiProduct } from '@/types/rapidApi';
import { RapidApiService } from '@/services/rapidApi';
import { useRapidApiProducts } from '@/hooks/useRapidApiProducts';

export const useProductBrowserData = () => {
  const [products, setProducts] = useState<RapidApiProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating-desc');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  const { isLoadingRapidApi, loadProductsFromRapidApi } = useRapidApiProducts();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const storedProducts = localStorage.getItem('sunbeam-products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  };

  const handleLoadFromRapidApi = async () => {
    try {
      const rapidProducts = await loadProductsFromRapidApi();
      if (rapidProducts.length > 0) {
        setProducts(rapidProducts);
        localStorage.setItem('sunbeam-products', JSON.stringify(rapidProducts));
        return { success: true, count: rapidProducts.length };
      } else {
        return { success: false, error: 'No products found. Please check your RapidAPI configuration.' };
      }
    } catch (error) {
      return { success: false, error: 'Failed to load products from RapidAPI. Please check your API key.' };
    }
  };

  const handleSearchProducts = async (query: string) => {
    const rapidApiKey = localStorage.getItem('rapidapi-key');
    if (!rapidApiKey) {
      return { success: false, error: 'RapidAPI key not configured. Please set it in Settings.' };
    }

    setIsSearching(true);
    try {
      RapidApiService.setApiKey(rapidApiKey);
      const searchResults = await RapidApiService.searchProducts(query, {
        sortBy: 'BEST_SELLERS',
        country: 'US',
        page: 1
      });

      if (searchResults.products && searchResults.products.length > 0) {
        const searchedProducts = searchResults.products;
        setProducts(searchedProducts);
        localStorage.setItem('sunbeam-products', JSON.stringify(searchedProducts));
        return { success: true, count: searchedProducts.length, query };
      } else {
        return { success: false, error: `No products found for "${query}". Try a different search term.` };
      }
    } catch (error) {
      console.error('Search error:', error);
      return { success: false, error: 'Failed to search products. Please check your API key and try again.' };
    } finally {
      setIsSearching(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.product_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.product_byline && product.product_byline.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => {
        switch (categoryFilter) {
          case 'best-sellers':
            return product.is_best_seller;
          case 'amazon-choice':
            return product.is_amazon_choice;
          case 'prime':
            return product.is_prime;
          case 'eco-friendly':
            return product.climate_pledge_friendly;
          default:
            return true;
        }
      });
    }

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => parseFloat(a.product_price.replace(/[^0-9.]/g, '')) - parseFloat(b.product_price.replace(/[^0-9.]/g, '')));
        break;
      case 'price-desc':
        filtered.sort((a, b) => parseFloat(b.product_price.replace(/[^0-9.]/g, '')) - parseFloat(a.product_price.replace(/[^0-9.]/g, '')));
        break;
      case 'rating-desc':
        filtered.sort((a, b) => parseFloat(b.product_star_rating || '0') - parseFloat(a.product_star_rating || '0'));
        break;
      case 'rating-asc':
        filtered.sort((a, b) => parseFloat(a.product_star_rating || '0') - parseFloat(b.product_star_rating || '0'));
        break;
      case 'reviews-desc':
        filtered.sort((a, b) => (b.product_num_ratings || 0) - (a.product_num_ratings || 0));
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.product_title.localeCompare(b.product_title));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, searchTerm, sortBy, categoryFilter]);

  return {
    products,
    setProducts,
    filteredProducts,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    categoryFilter,
    setCategoryFilter,
    isSearching,
    isLoadingRapidApi,
    handleLoadFromRapidApi,
    handleSearchProducts,
    loadProducts
  };
};