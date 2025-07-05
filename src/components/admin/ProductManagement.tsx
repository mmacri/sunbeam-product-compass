
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, List } from 'lucide-react';
import { AddProductForm } from './AddProductForm';
import { ProductList } from './ProductList';
import { DatabaseProductsList } from './DatabaseProductsList';

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
  const [viewMode, setViewMode] = useState<'tracked' | 'database'>('tracked');

  const handleEdit = (product: Product) => {
    onEditProduct(product.id);
  };

  const handleDelete = (id: string) => {
    onDeleteProduct(id);
  };

  const handleAdd = () => {
    onShowMessage('Add product form is above', 'success');
  };

  const handleView = (id: string) => {
    onShowMessage(`Viewing product: ${id}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Toggle between tracked and database products */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'tracked' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('tracked')}
            className="flex items-center gap-2"
          >
            <List className="w-4 h-4" />
            Tracked Products
            <Badge variant="secondary" className="ml-1">
              {products.length}
            </Badge>
          </Button>
          <Button
            variant={viewMode === 'database' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('database')}
            className="flex items-center gap-2"
          >
            <Database className="w-4 h-4" />
            Database Products
          </Button>
        </div>
      </div>

      {viewMode === 'tracked' ? (
        <>
          <AddProductForm
            products={products}
            onProductsChange={onProductsChange}
            onShowMessage={onShowMessage}
            onLogAction={onLogAction}
          />
          
          <ProductList
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
            onView={handleView}
          />
        </>
      ) : (
        <DatabaseProductsList
          onShowMessage={onShowMessage}
        />
      )}
    </div>
  );
};
