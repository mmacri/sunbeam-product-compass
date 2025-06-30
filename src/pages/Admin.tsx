
import React from 'react';
import { AdminDashboard } from '@/components/AdminDashboard';
import { AdminHeader } from '@/components/AdminHeader';
import { ProductBrowser } from '@/components/admin/ProductBrowser';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const Admin = () => {
  const { toast } = useToast();

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    toast({
      title: type === 'success' ? 'Success' : 'Error',
      description: message,
      variant: type === 'error' ? 'destructive' : 'default'
    });
  };

  const logAction = (action: string, details: any) => {
    const newLog = {
      timestamp: new Date().toISOString(),
      action,
      details
    };
    const logs = JSON.parse(localStorage.getItem('sunbeam-logs') || '[]');
    const updatedLogs = [newLog, ...logs].slice(0, 100);
    localStorage.setItem('sunbeam-logs', JSON.stringify(updatedLogs));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AdminHeader />
      
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Product Management Center
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
              Browse, select, and manage products from the API. Configure which data fields to include and export your selections.
            </p>
            
            <Card className="max-w-md mx-auto bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-200 dark:border-orange-700">
              <CardContent className="p-6 text-center">
                <Package className="w-8 h-8 mx-auto mb-3 text-orange-600" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Ready to publish products?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  After selecting products below, save them for users and view them on the main site.
                </p>
                <Link to="/">
                  <Button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
                    View Products Page
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <ProductBrowser 
            onShowMessage={showMessage}
            onLogAction={logAction}
          />
        </div>
      </main>
    </div>
  );
};

export default Admin;
