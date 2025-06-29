
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Filter,
  RefreshCw,
  Edit,
  Trash2
} from 'lucide-react';
import { ProductExtractor } from '@/services/productExtractor';

interface Product {
  id: string;
  title: string;
  url: string;
  threshold: number;
  tags: string[];
  price: string;
  lastUpdated: string;
}

interface ProductListProps {
  products: Product[];
  onProductsChange: (products: Product[]) => void;
  onEditProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onShowMessage: (message: string, type?: 'success' | 'error') => void;
  onLogAction: (action: string, details: any) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onProductsChange,
  onEditProduct,
  onDeleteProduct,
  onShowMessage,
  onLogAction
}) => {
  const [filterTag, setFilterTag] = useState('');

  const rescrapeProduct = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    try {
      const extractedData = await ProductExtractor.extractFromUrl(product.url);
      
      const updatedProducts = products.map(p => 
        p.id === id 
          ? { 
              ...p, 
              title: extractedData.title,
              price: extractedData.currentPrice,
              lastUpdated: new Date().toISOString()
            }
          : p
      );
      onProductsChange(updatedProducts);
      onLogAction('product_rescraped', { id, title: extractedData.title });
      onShowMessage('Product data updated with fresh information');
    } catch (error) {
      onLogAction('product_rescrape_failed', { id, error: error.message });
      onShowMessage('Failed to update product data', 'error');
    }
  };

  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter(p => p.id !== id);
    onProductsChange(updatedProducts);
    onLogAction('product_deleted', { id });
    onShowMessage('Product deleted');
    onDeleteProduct(id);
  };

  const filteredProducts = filterTag 
    ? products.filter(p => p.tags.some(tag => tag.toLowerCase().includes(filterTag.toLowerCase())))
    : products;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Product List
        </CardTitle>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filter by tag..."
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="max-w-xs"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredProducts.length === 0 ? (
            <p className="text-gray-500">No products found</p>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.title}</h3>
                    <a 
                      href={product.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {product.url}
                    </a>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>Threshold: ${product.threshold}</span>
                      <span>Price: {product.price}</span>
                      <span>Updated: {new Date(product.lastUpdated).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {product.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => rescrapeProduct(product.id)}
                      title="Refresh product data"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditProduct(product.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteProduct(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
