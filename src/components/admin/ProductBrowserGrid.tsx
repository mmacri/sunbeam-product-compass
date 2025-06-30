
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RapidApiProduct } from '@/types/rapidApi';
import { ProductCard } from './ProductCard';

interface ProductBrowserGridProps {
  products: RapidApiProduct[];
  selectedAsins: string[];
  onToggleSelection: (asin: string) => void;
}

export const ProductBrowserGrid: React.FC<ProductBrowserGridProps> = ({
  products,
  selectedAsins,
  onToggleSelection
}) => {
  const isSelected = (asin: string): boolean => {
    return selectedAsins.includes(asin);
  };

  if (!products || products.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-500 dark:text-gray-400">
          <p className="text-lg font-medium mb-2">No products loaded</p>
          <p className="text-sm">Use "Load Best Sellers" or search for products to get started.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.asin}
          product={product}
          isSelected={isSelected(product.asin)}
          onToggleSelection={onToggleSelection}
        />
      ))}
    </div>
  );
};
