
import { useState, useEffect } from 'react';
import { mockProducts } from '@/utils/mockData';
import { RapidApiService } from '@/services/rapidApi';

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
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [searchableProducts, setSearchableProducts] = useState<SearchableProduct[]>([]);
  const [staleDataWarning, setStaleDataWarning] = useState(false);
  const [realProducts, setRealProducts] = useState<any[]>([]);
  const [isLoadingRapidApi, setIsLoadingRapidApi] = useState(false);

  const transformRapidApiProduct = (rapidProduct: any): Product => {
    return {
      id: rapidProduct.asin,
      title: rapidProduct.product_title,
      currentPrice: rapidProduct.product_price,
      originalPrice: rapidProduct.product_original_price || rapidProduct.product_price,
      rating: parseFloat(rapidProduct.product_star_rating) || 4.0,
      reviews: rapidProduct.product_num_ratings || 0,
      category: 'Electronics',
      description: `${rapidProduct.product_title} - ${rapidProduct.product_byline || 'Quality product from Amazon marketplace'}`,
      keyFeatures: [
        'Amazon Prime eligible',
        rapidProduct.is_best_seller ? 'Best Seller' : 'Popular choice',
        rapidProduct.is_amazon_choice ? 'Amazon\'s Choice' : 'Highly rated',
        'Fast delivery available'
      ],
      specs: {
        'ASIN': rapidProduct.asin,
        'Price': rapidProduct.product_price,
        'Rating': `${rapidProduct.product_star_rating}/5 (${rapidProduct.product_num_ratings} reviews)`,
        'Availability': rapidProduct.product_availability || 'In Stock'
      },
      stores: [
        { name: 'Amazon', url: rapidProduct.product_url }
      ],
      priceHistory: [
        { date: new Date().toISOString().split('T')[0], price: rapidProduct.product_price, store: 'Amazon' }
      ]
    };
  };

  const transformRapidApiToSearchableProduct = (rapidProduct: any): SearchableProduct => {
    return {
      id: rapidProduct.asin,
      title: rapidProduct.product_title,
      price: rapidProduct.product_price,
      category: 'Electronics',
      categories: ['Electronics'],
      metaTags: [
        rapidProduct.is_best_seller ? 'best-seller' : '',
        rapidProduct.is_amazon_choice ? 'amazon-choice' : '',
        rapidProduct.is_prime ? 'prime' : ''
      ].filter(Boolean),
      searchTerms: rapidProduct.product_title.toLowerCase().split(' '),
      tags: [
        rapidProduct.is_best_seller ? 'Best Seller' : '',
        rapidProduct.is_amazon_choice ? 'Amazon\'s Choice' : '',
        rapidProduct.is_prime ? 'Prime' : ''
      ].filter(Boolean),
      lastUpdated: new Date().toISOString()
    };
  };

  const transformAdminProduct = (adminProduct: any): Product => {
    return {
      id: adminProduct.id,
      title: adminProduct.title,
      currentPrice: adminProduct.price,
      originalPrice: adminProduct.price,
      rating: 4.5,
      reviews: 128,
      category: adminProduct.category || 'General',
      description: `Comprehensive review and analysis of ${adminProduct.title}. Track pricing, compare features, and make informed purchasing decisions.`,
      keyFeatures: [
        'Real-time price tracking',
        'Expert analysis and review',
        'Price history monitoring',
        'Multi-store comparison'
      ],
      specs: {
        'Last Updated': new Date(adminProduct.lastUpdated).toLocaleDateString(),
        'Price Alert Threshold': adminProduct.threshold > 0 ? `$${adminProduct.threshold}` : 'Not set',
        'Tags': adminProduct.tags.join(', ') || 'None'
      },
      stores: [
        { name: 'Original Store', url: adminProduct.url }
      ],
      priceHistory: [
        { date: new Date().toISOString().split('T')[0], price: adminProduct.price, store: 'Current' }
      ]
    };
  };

  const transformToSearchableProduct = (adminProduct: any): SearchableProduct => {
    return {
      id: adminProduct.id,
      title: adminProduct.title,
      price: adminProduct.price,
      category: adminProduct.category || 'General',
      categories: adminProduct.categories || [],
      metaTags: adminProduct.metaTags || [],
      searchTerms: adminProduct.searchTerms || [],
      tags: adminProduct.tags || [],
      lastUpdated: adminProduct.lastUpdated
    };
  };

  const transformMockToSearchableProduct = (mockProduct: any): SearchableProduct => {
    return {
      id: mockProduct.id.toString(),
      title: mockProduct.title,
      price: mockProduct.currentPrice,
      category: mockProduct.category,
      categories: [mockProduct.category],
      metaTags: ['premium', 'highly-rated'],
      searchTerms: mockProduct.title.toLowerCase().split(' '),
      tags: ['featured', 'popular'],
      lastUpdated: new Date().toISOString()
    };
  };

  const loadProductsFromRapidApi = async () => {
    const rapidApiKey = localStorage.getItem('rapidapi-key');
    if (!rapidApiKey) return;

    setIsLoadingRapidApi(true);
    try {
      RapidApiService.setApiKey(rapidApiKey);
      const searchResults = await RapidApiService.searchProducts('best sellers', {
        sortBy: 'BEST_SELLERS',
        country: 'US',
        page: 1
      });

      if (searchResults.products && searchResults.products.length > 0) {
        const transformedProducts = searchResults.products.slice(0,10).map(transformRapidApiProduct);
        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
        setSearchableProducts(searchResults.products.slice(0,10).map(transformRapidApiToSearchableProduct));
      }
    } catch (error) {
      console.error('Failed to load products from RapidAPI:', error);
    } finally {
      setIsLoadingRapidApi(false);
    }
  };

  const loadInitialData = async () => {
    const adminProducts = localStorage.getItem('sunbeam-products');
    if (adminProducts) {
      try {
        const parsed = JSON.parse(adminProducts);
        setRealProducts(parsed);
        if (parsed.length > 0) {
          const transformedProducts = parsed.map(transformAdminProduct);
          setProducts(transformedProducts);
          setSearchableProducts(parsed.map(transformToSearchableProduct));
        }
      } catch (error) {
        console.error('Failed to load real products:', error);
      }
    }

    const rapidApiKey = localStorage.getItem('rapidapi-key');
    if (rapidApiKey && realProducts.length === 0) {
      await loadProductsFromRapidApi();
    }

    if (realProducts.length === 0) {
      setSearchableProducts(mockProducts.map(transformMockToSearchableProduct));
    }

    const lastUpdate = localStorage.getItem('sunbeam-last-update');
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    
    if (lastUpdate && (now - parseInt(lastUpdate)) > oneDay) {
      setStaleDataWarning(true);
    }

    if (!lastUpdate) {
      localStorage.setItem('sunbeam-last-update', now.toString());
    }
  };

  const refreshData = async () => {
    setStaleDataWarning(false);
    localStorage.setItem('sunbeam-last-update', new Date().getTime().toString());
    
    const adminProducts = localStorage.getItem('sunbeam-products');
    if (adminProducts) {
      try {
        const parsed = JSON.parse(adminProducts);
        setRealProducts(parsed);
        if (parsed.length > 0) {
          const transformedProducts = parsed.map(transformAdminProduct);
          setProducts(transformedProducts);
          setSearchableProducts(parsed.map(transformToSearchableProduct));
        }
      } catch (error) {
        console.error('Failed to refresh products:', error);
      }
    }

    await loadProductsFromRapidApi();
  };

  const handleSearchResults = (results: SearchableProduct[]) => {
    const resultIds = results.map(r => r.id);
    const filtered = products.filter(p => resultIds.includes(p.id.toString()));
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  return {
    products,
    filteredProducts,
    searchableProducts,
    staleDataWarning,
    realProducts,
    isLoadingRapidApi,
    handleSearchResults,
    refreshData
  };
};
