import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AdminHeader } from '@/components/AdminHeader';
import { AdminNavigation } from '@/components/admin/AdminNavigation';
import { UnifiedProductWorkflow } from '@/components/admin/UnifiedProductWorkflow';
import { ProductManagement } from '@/components/admin/ProductManagement';
import { ProductBrowser } from '@/components/admin/ProductBrowser';
import { TemplateEditor } from '@/components/TemplateEditor';
import { ReportingDashboard } from '@/components/ReportingDashboard';
import { AuditLog } from '@/components/AuditLog';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  title: string;
  url: string;
  threshold: number;
  tags: string[];
  price: string;
  lastUpdated: string;
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [pendingActions, setPendingActions] = useState(0);
  const { toast } = useToast();

  React.useEffect(() => {
    loadProducts();
    updatePendingActions();
  }, []);

  const loadProducts = () => {
    const saved = localStorage.getItem('sunbeam-products');
    if (saved) {
      setProducts(JSON.parse(saved));
    }
  };

  const saveProducts = (updatedProducts: Product[]) => {
    localStorage.setItem('sunbeam-products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
  };

  const updatePendingActions = () => {
    // Check for products that need attention (price changes, errors, etc.)
    const count = products.filter(p => {
      const lastUpdate = new Date(p.lastUpdated);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return lastUpdate < oneDayAgo;
    }).length;
    setPendingActions(count);
  };

  const logAction = (action: string, details: any) => {
    // Add to audit log
    if ((window as any).addAuditEntry) {
      (window as any).addAuditEntry(action, JSON.stringify(details), 'update');
    }
    
    // Update pending actions count
    updatePendingActions();
  };

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    toast({
      title: type === 'success' ? 'Success' : 'Error',
      description: message,
      variant: type === 'error' ? 'destructive' : 'default'
    });
  };

  const handleEditProduct = (productId: string) => {
    logAction('Product Edit Started', { productId });
    // Navigate to template tab for editing
    setActiveTab('template');
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      saveProducts(updatedProducts);
      logAction('Product Deleted', { productId });
      showMessage('Product deleted successfully');
    }
  };

  const handleAddProductFromBrowser = (rapidApiProduct: any) => {
    const newProduct: Product = {
      id: Date.now().toString(),
      title: rapidApiProduct.product_title,
      url: rapidApiProduct.product_url,
      threshold: 0, // User can set this later
      tags: [],
      price: rapidApiProduct.product_price,
      lastUpdated: new Date().toISOString()
    };

    const updatedProducts = [...products, newProduct];
    saveProducts(updatedProducts);
    logAction('Product Added from Browser', { 
      asin: rapidApiProduct.asin, 
      title: rapidApiProduct.product_title 
    });
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <UnifiedProductWorkflow
            products={products}
            onProductsChange={saveProducts}
            onLogAction={logAction}
          />
        );
      case 'url-processor':
        return (
          <ProductManagement
            products={products}
            onProductsChange={saveProducts}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onShowMessage={showMessage}
            onLogAction={logAction}
          />
        );
      case 'browser':
        return (
          <ProductBrowser
            onShowMessage={showMessage}
            onLogAction={logAction}
            onAddProduct={handleAddProductFromBrowser}
          />
        );
      case 'template':
        return <TemplateEditor />;
      case 'reports':
        return <ReportingDashboard />;
      case 'audit':
        return <AuditLog />;
      case 'settings':
        return (
          <AdminSettings
            onShowMessage={showMessage}
            onLogAction={logAction}
          />
        );
      default:
        return (
          <UnifiedProductWorkflow
            products={products}
            onProductsChange={saveProducts}
            onLogAction={logAction}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <AdminHeader />
      
      <AdminNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        productCount={products.length}
        pendingActions={pendingActions}
      />

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="space-y-6">
          {renderActiveTabContent()}
        </div>
      </main>
    </div>
  );
};

export default Admin;
