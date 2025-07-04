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
  created_at: string;
  updated_at: string;
}

export const useDatabaseProducts = () => {
  const [products, setProducts] = useState<DatabaseProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minRating, setMinRating] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
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

    // Sort products
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
      default:
        break;
    }

    return filtered;
  }, [products, searchTerm, sortBy, priceRange, minRating]);

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products: filteredAndSortedProducts,
    allProducts: products,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    minRating,
    setMinRating,
    refetch: fetchProducts
  };
};