
import React from 'react';
import { AddProductForm } from './AddProductForm';
import { ProductList } from './ProductList';

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
    </div>
  );
};
