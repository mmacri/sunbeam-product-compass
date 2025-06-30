
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ProductGridCard } from '@/components/ProductGridCard';
import { RapidApiProduct } from '@/types/rapidApi';

interface ProductGridProps {
  products: RapidApiProduct[];
  onProductClick: (asin: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductClick }) => {
  if (products.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">No Products Found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your filters or search terms to find products.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductGridCard
          key={product.asin}
          product={product}
          onProductClick={onProductClick}
        />
      ))}
    </div>
  );
};
