
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Plus,
  Filter,
  RefreshCw,
  Edit,
  Trash2
} from 'lucide-react';

interface Product {
  id: string;
  title: string;
  url: string;
  threshold: number;
  tags: string[];
  price: string;
  lastUpdated: string;
}

interface ProductManagementProps {
  products: Product[];
  onProductsChange: (products: Product[]) => void;
  onEditProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onShowMessage: (message: string, type?: 'success' | 'error') => void;
  onLogAction: (action: string, details: any) => void;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({
  products,
  onProductsChange,
  onEditProduct,
  onDeleteProduct,
  onShowMessage,
  onLogAction
}) => {
  const [newProduct, setNewProduct] = useState({
    url: '',
    threshold: 0,
    tags: ''
  });
  const [filterTag, setFilterTag] = useState('');

  const addProduct = async () => {
    if (!newProduct.url) {
      onShowMessage('URL is required', 'error');
      return;
    }

    const mockData = {
      title: 'Sample Product',
      price: '$99.99',
      description: 'High-quality product with excellent features',
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
      specs: {
        'Brand': 'Sample Brand',
        'Model': 'SP-001',
        'Color': 'Black'
      }
    };

    const product: Product = {
      id: Date.now().toString(),
      title: mockData.title,
      url: newProduct.url,
      threshold: newProduct.threshold,
      tags: newProduct.tags.split(',').map(t => t.trim()).filter(t => t),
      price: mockData.price,
      lastUpdated: new Date().toISOString()
    };

    const updatedProducts = [...products, product];
    onProductsChange(updatedProducts);
    onLogAction('product_added', { url: newProduct.url, threshold: newProduct.threshold });
    onShowMessage('Product added successfully');
    setNewProduct({ url: '', threshold: 0, tags: '' });
  };

  const rescrapeProduct = (id: string) => {
    const updatedProducts = products.map(p => 
      p.id === id 
        ? { ...p, lastUpdated: new Date().toISOString(), price: `$${(Math.random() * 100 + 50).toFixed(2)}` }
        : p
    );
    onProductsChange(updatedProducts);
    onLogAction('product_rescraped', { id });
    onShowMessage('Product data updated');
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Product
          </CardTitle>
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
          <Button onClick={addProduct} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </CardContent>
      </Card>

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
    </div>
  );
};
