
import React from 'react';
import { AdminDashboard } from '@/components/AdminDashboard';
import { AppHeader } from '@/components/AppHeader';
import { ExcelExportTest } from '@/components/admin/ExcelExportTest';
import { ApiDataDebugger } from '@/components/admin/ApiDataDebugger';
import { useTheme } from '@/contexts/ThemeContext';
import { useProductData } from '@/hooks/useProductData';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const { selectedRapidApiProducts, isLoadingRapidApi } = useProductData();

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    toast({
      title: type === 'success' ? 'Success' : 'Error',
      description: message,
      variant: type === 'error' ? 'destructive' : 'default'
    });
  };

  const handleViewProduct = (productId: string) => {
    showMessage(`Viewing product: ${productId}`);
  };

  const handleEditProduct = (productId: string) => {
    showMessage(`Editing product: ${productId}`);
  };

  const handleDeleteProduct = (productId: string) => {
    showMessage(`Deleted product: ${productId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AppHeader 
        theme={theme}
        toggleTheme={toggleTheme}
        realProductsCount={selectedRapidApiProducts.length}
        isLoadingRapidApi={isLoadingRapidApi}
      />
      
      {/* Excel Export Test Section */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        <ExcelExportTest />
        <ApiDataDebugger />
      </div>
      
      <AdminDashboard
        onViewProduct={handleViewProduct}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
      />
    </div>
  );
};

export default Admin;
