
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RapidApiProduct } from '@/types/rapidApi';

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.asin} className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-4">
            <div className="flex items-start">
              <div className="mr-4">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded text-orange-500 focus:ring-orange-500"
                  checked={isSelected(product.asin)}
                  onChange={() => onToggleSelection(product.asin)}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{product.product_title}</h3>
                <p className="text-gray-600">{product.product_price}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
