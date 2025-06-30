
import React from 'react';
import { AdminDashboard } from '@/components/AdminDashboard';
import { AdminHeader } from '@/components/AdminHeader';
import { ProductBrowser } from '@/components/admin/ProductBrowser';
import { useToast } from '@/hooks/use-toast';

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
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Browse, select, and manage products from the API. Configure which data fields to include and export your selections.
            </p>
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
