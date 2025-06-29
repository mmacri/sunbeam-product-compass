
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
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

interface AddProductFormProps {
  products: Product[];
  onProductsChange: (products: Product[]) => void;
  onShowMessage: (message: string, type?: 'success' | 'error') => void;
  onLogAction: (action: string, details: any) => void;
}

export const AddProductForm: React.FC<AddProductFormProps> = ({
  products,
  onProductsChange,
  onShowMessage,
  onLogAction
}) => {
  const [newProduct, setNewProduct] = useState({
    url: '',
    threshold: 0,
    tags: ''
  });
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const addProduct = async () => {
    if (!newProduct.url) {
      onShowMessage('URL is required', 'error');
      return;
    }

    setIsAddingProduct(true);
    try {
      const extractedData = await ProductExtractor.extractFromUrl(newProduct.url);
      
      const product: Product = {
        id: Date.now().toString(),
        title: extractedData.title,
        url: newProduct.url,
        threshold: newProduct.threshold,
        tags: newProduct.tags.split(',').map(t => t.trim()).filter(t => t),
        price: extractedData.currentPrice,
        lastUpdated: new Date().toISOString()
      };

      const updatedProducts = [...products, product];
      onProductsChange(updatedProducts);
      onLogAction('product_added', { url: newProduct.url, title: extractedData.title });
      onShowMessage('Product added successfully with real data');
      setNewProduct({ url: '', threshold: 0, tags: '' });
    } catch (error) {
      onLogAction('product_add_failed', { url: newProduct.url, error: error.message });
      onShowMessage('Failed to add product. Please check the URL and try again.', 'error');
    } finally {
      setIsAddingProduct(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New Product
        </CardTitle>
        <p className="text-sm text-gray-600">
          Real product data will be extracted from the provided URL
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="product-url">Product URL</Label>
            <Input
              id="product-url"
              placeholder="https://amazon.com/product..."
              value={newProduct.url}
              onChange={(e) => setNewProduct({...newProduct, url: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="alert-threshold">Alert Threshold ($)</Label>
            <Input
              id="alert-threshold"
              type="number"
              placeholder="50"
              value={newProduct.threshold}
              onChange={(e) => setNewProduct({...newProduct, threshold: Number(e.target.value)})}
            />
          </div>
          <div>
            <Label htmlFor="product-tags">Tags (comma separated)</Label>
            <Input
              id="product-tags"
              placeholder="electronics, wireless, headphones"
              value={newProduct.tags}
              onChange={(e) => setNewProduct({...newProduct, tags: e.target.value})}
            />
          </div>
        </div>
        <Button 
          onClick={addProduct} 
          className="w-full md:w-auto"
          disabled={isAddingProduct}
        >
          <Plus className="w-4 h-4 mr-2" />
          {isAddingProduct ? 'Extracting Product Data...' : 'Add Product'}
        </Button>
      </CardContent>
    </Card>
  );
};
