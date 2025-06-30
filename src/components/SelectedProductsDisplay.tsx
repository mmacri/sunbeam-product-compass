
import React, { useState, useMemo } from 'react';
import { ProductFilters } from '@/components/ProductFilters';
import { ProductGrid } from '@/components/ProductGrid';
import { RapidApiProduct } from '@/types/rapidApi';

interface SelectedProductsDisplayProps {
  products: RapidApiProduct[];
  onProductClick: (asin: string) => void;
}

export const SelectedProductsDisplay: React.FC<SelectedProductsDisplayProps> = ({
  products,
  onProductClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating-desc');
  const [filterCategory, setFilterCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.product_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.product_byline && product.product_byline.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter (based on product features/badges)
    if (filterCategory !== 'all') {
      filtered = filtered.filter(product => {
        switch (filterCategory) {
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

    // Price range filter
    if (priceRange !== 'all') {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.product_price.replace(/[^0-9.]/g, ''));
        switch (priceRange) {
          case 'under-25':
            return price < 25;
          case '25-50':
            return price >= 25 && price <= 50;
          case '50-100':
            return price >= 50 && price <= 100;
          case 'over-100':
            return price > 100;
          default:
            return true;
        }
      });
    }

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return parseFloat(a.product_price.replace(/[^0-9.]/g, '')) - parseFloat(b.product_price.replace(/[^0-9.]/g, ''));
        case 'price-desc':
          return parseFloat(b.product_price.replace(/[^0-9.]/g, '')) - parseFloat(a.product_price.replace(/[^0-9.]/g, ''));
        case 'rating-desc':
          return parseFloat(b.product_star_rating || '0') - parseFloat(a.product_star_rating || '0');
        case 'rating-asc':
          return parseFloat(a.product_star_rating || '0') - parseFloat(b.product_star_rating || '0');
        case 'reviews-desc':
          return (b.product_num_ratings || 0) - (a.product_num_ratings || 0);
        case 'alphabetical':
          return a.product_title.localeCompare(b.product_title);
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, searchTerm, sortBy, filterCategory, priceRange]);

  return (
    <div className="space-y-6">
      <ProductFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        filteredCount={filteredAndSortedProducts.length}
        totalCount={products.length}
      />

      <ProductGrid
        products={filteredAndSortedProducts}
        onProductClick={onProductClick}
      />
    </div>
  );
};
