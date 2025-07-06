
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  FileText, 
  BarChart3,
  Activity,
  Search,
  Plus,
  LogOut,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ProductManagement } from '@/components/admin/ProductManagement';
import { UnifiedProductWorkflow } from '@/components/admin/UnifiedProductWorkflow';
import { TemplateManagement } from '@/components/admin/TemplateManagement';
import { ReportsAndLogs } from '@/components/admin/ReportsAndLogs';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { ProductBrowser } from '@/components/admin/ProductBrowser';
import { DealManagement } from '@/components/admin/DealManagement';

interface Product {
  id: string;
  title: string;
  url: string;
  threshold: number;
  tags: string[];
  price: string;
  lastUpdated: string;
}

interface LogEntry {
  timestamp: string;
  action: string;
  details: any;
}

interface AdminDashboardProps {
  onViewProduct: (productId: string) => void;
  onEditProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onViewProduct,
  onEditProduct,
  onDeleteProduct
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [messageArea, setMessageArea] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const { toast } = useToast();
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const initializeAdmin = async () => {
      try {
        await loadProducts();
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing admin:', error);
        showMessage('Error loading admin panel', 'error');
        setIsLoading(false);
      }
    };

    initializeAdmin();
  }, []);

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setMessageArea(message);
    toast({
      title: type === 'success' ? 'Success' : 'Error',
      description: message,
      variant: type === 'error' ? 'destructive' : 'default'
    });
    setTimeout(() => setMessageArea(''), 3000);
  };

  const logAction = (action: string, details: any) => {
    const newLog: LogEntry = {
      timestamp: new Date().toISOString(),
      action,
      details
    };
    try {
      const logs = JSON.parse(localStorage.getItem('sunbeam-logs') || '[]');
      const updatedLogs = [newLog, ...logs].slice(0, 100);
      localStorage.setItem('sunbeam-logs', JSON.stringify(updatedLogs));
    } catch (error) {
      console.error('Error logging action:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const saved = localStorage.getItem('sunbeam-products');
      if (saved) {
        const parsedProducts = JSON.parse(saved);
        const validProducts = parsedProducts.map((product: any) => ({
          id: product.id || Date.now().toString(),
          title: product.title || 'Untitled Product',
          url: product.url || '',
          threshold: product.threshold || 0,
          tags: Array.isArray(product.tags) ? product.tags : [],
          price: product.price || '$0.00',
          lastUpdated: product.lastUpdated || new Date().toISOString()
        }));
        setProducts(validProducts);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    }
  };

  const saveProducts = (updatedProducts: Product[]) => {
    try {
      localStorage.setItem('sunbeam-products', JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
      loadProducts(); // Refresh the products list
    } catch (error) {
      console.error('Error saving products:', error);
      showMessage('Error saving products', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Message Area */}
      {messageArea && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-md shadow-lg z-50">
          {messageArea}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Sunbeam Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage products, templates, and generate blog content
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{user?.email}</span>
              {isAdmin && <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs">Admin</span>}
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Products
            </TabsTrigger>
            <TabsTrigger value="deals" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Deals
            </TabsTrigger>
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Browse & Select
            </TabsTrigger>
            <TabsTrigger value="template" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Reports & Logs
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <UnifiedProductWorkflow
              products={products}
              onProductsChange={saveProducts}
              onLogAction={logAction}
            />
            <ProductManagement
              products={products}
              onProductsChange={saveProducts}
              onEditProduct={onEditProduct}
              onDeleteProduct={onDeleteProduct}
              onShowMessage={showMessage}
              onLogAction={logAction}
            />
          </TabsContent>

          <TabsContent value="deals" className="space-y-6">
            <DealManagement onShowMessage={showMessage} />
          </TabsContent>

          <TabsContent value="browse" className="space-y-6">
            <ProductBrowser
              onShowMessage={showMessage}
              onLogAction={logAction}
            />
          </TabsContent>

          <TabsContent value="template" className="space-y-6">
            <TemplateManagement
              products={products}
              onLogAction={logAction}
              onShowMessage={showMessage}
            />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ReportsAndLogs
              products={products}
              onLogAction={logAction}
              onShowMessage={showMessage}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <AdminSettings
              onShowMessage={showMessage}
              onLogAction={logAction}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
