import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DatabaseProduct {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  sale_price: number | null;
  rating: number | null;
  image_url: string | null;
  affiliate_url: string | null;
  asin: string | null;
  attributes: any;
  specifications: any;
  price_history: any;
  commission_rate: number | null;
  click_count: number | null;
  conversion_count: number | null;
  revenue_generated: number | null;
  api_last_updated: string | null;
  api_source: string | null;
  in_stock: boolean | null;
  availability: boolean | null;
  category_id: string | null;
  created_at: string;
  updated_at: string;
  has_active_deal?: boolean;
  current_deal?: {
    id: string;
    discount_percentage: number | null;
    deal_price: number | null;
    original_price: number | null;
    deal_type: string | null;
    deal_end_date: string | null;
    is_active: boolean;
  } | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export const useDatabaseProducts = () => {
  const [products, setProducts] = useState<DatabaseProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Basic filters
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  
  // Enhanced filters
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockStatusFilter, setStockStatusFilter] = useState('all');
  const [dealStatusFilter, setDealStatusFilter] = useState('all');
  const [apiSourceFilter, setApiSourceFilter] = useState('all');
  const [priceStatusFilter, setPriceStatusFilter] = useState('all');
  const [recentUpdatesFilter, setRecentUpdatesFilter] = useState('all');
  const [commissionRange, setCommissionRange] = useState<[number, number]>([0, 50]);
  const [performanceFilter, setPerformanceFilter] = useState('all');

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch products with category and deal data
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(
            id,
            name,
            slug
          ),
          current_deal:product_deals!current_deal_id(
            id,
            discount_percentage,
            deal_price,
            original_price,
            deal_type,
            deal_end_date,
            is_active
          )
        `)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      // Fetch categories for filter dropdown
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name');

      if (categoriesError) throw categoriesError;

      setProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Enhanced search filter (name, description, ASIN)
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.asin && product.asin.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => 
        product.category_id === categoryFilter
      );
    }

    // Stock status filter
    if (stockStatusFilter !== 'all') {
      filtered = filtered.filter(product => {
        const inStock = product.in_stock ?? product.availability ?? true;
        return stockStatusFilter === 'in-stock' ? inStock : !inStock;
      });
    }

    // Deal status filter
    if (dealStatusFilter !== 'all') {
      filtered = filtered.filter(product => {
        const hasActiveDeal = product.has_active_deal || product.current_deal?.is_active;
        return dealStatusFilter === 'deals-only' ? hasActiveDeal : !hasActiveDeal;
      });
    }

    // API source filter
    if (apiSourceFilter !== 'all') {
      filtered = filtered.filter(product => {
        const source = product.api_source || 'manual';
        return source === apiSourceFilter;
      });
    }

    // Price status filter
    if (priceStatusFilter !== 'all') {
      filtered = filtered.filter(product => {
        const onSale = product.sale_price && product.price && product.sale_price < product.price;
        return priceStatusFilter === 'on-sale' ? onSale : !onSale;
      });
    }

    // Recent updates filter
    if (recentUpdatesFilter !== 'all') {
      const now = new Date();
      const daysDiff = recentUpdatesFilter === 'week' ? 7 : 30;
      const cutoffDate = new Date(now.getTime() - (daysDiff * 24 * 60 * 60 * 1000));
      
      filtered = filtered.filter(product => {
        const updatedAt = new Date(product.updated_at);
        const apiUpdatedAt = product.api_last_updated ? new Date(product.api_last_updated) : null;
        return updatedAt > cutoffDate || (apiUpdatedAt && apiUpdatedAt > cutoffDate);
      });
    }

    // Commission rate filter
    filtered = filtered.filter(product => {
      const commission = product.commission_rate || 0;
      return commission >= commissionRange[0] && commission <= commissionRange[1];
    });

    // Performance filter
    if (performanceFilter !== 'all') {
      filtered = filtered.filter(product => {
        switch (performanceFilter) {
          case 'high-traffic':
            return (product.click_count || 0) > 100;
          case 'high-converting':
            return (product.conversion_count || 0) > 10;
          case 'top-revenue':
            return (product.revenue_generated || 0) > 500;
          default:
            return true;
        }
      });
    }

    // Price range filter
    filtered = filtered.filter(product => {
      if (!product.price) return true;
      return product.price >= priceRange[0] && product.price <= priceRange[1];
    });

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(product => 
        product.rating && product.rating >= minRating
      );
    }

    // Enhanced sorting
    switch (sortBy) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating-desc':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'rating-asc':
        filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      case 'created-desc':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'created-asc':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'updated-desc':
        filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        break;
      case 'updated-asc':
        filtered.sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
        break;
      case 'clicks-desc':
        filtered.sort((a, b) => (b.click_count || 0) - (a.click_count || 0));
        break;
      case 'conversions-desc':
        filtered.sort((a, b) => (b.conversion_count || 0) - (a.conversion_count || 0));
        break;
      case 'revenue-desc':
        filtered.sort((a, b) => (b.revenue_generated || 0) - (a.revenue_generated || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [
    products, searchTerm, sortBy, priceRange, minRating,
    categoryFilter, stockStatusFilter, dealStatusFilter, apiSourceFilter,
    priceStatusFilter, recentUpdatesFilter, commissionRange, performanceFilter
  ]);

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products: filteredAndSortedProducts,
    allProducts: products,
    categories,
    loading,
    error,
    // Basic filters
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    minRating,
    setMinRating,
    // Enhanced filters
    categoryFilter,
    setCategoryFilter,
    stockStatusFilter,
    setStockStatusFilter,
    dealStatusFilter,
    setDealStatusFilter,
    apiSourceFilter,
    setApiSourceFilter,
    priceStatusFilter,
    setPriceStatusFilter,
    recentUpdatesFilter,
    setRecentUpdatesFilter,
    commissionRange,
    setCommissionRange,
    performanceFilter,
    setPerformanceFilter,
    refetch: fetchProducts
  };
};