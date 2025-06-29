
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { AdminDashboard } from '@/components/AdminDashboard';
import { TemplateEditor } from '@/components/TemplateEditor';
import { ReportingDashboard } from '@/components/ReportingDashboard';
import { AuditLog } from '@/components/AuditLog';
import { ProductPreview } from '@/components/ProductPreview';
import { AdminHeader } from '@/components/AdminHeader';
import { ProductUrlInput } from '@/components/ProductUrlInput';
import { useUrlProcessor } from '@/hooks/useUrlProcessor';

const Admin = () => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const {
    productUrl,
    setProductUrl,
    isLoading,
    extractedData,
    handleUrlSubmit
  } = useUrlProcessor();

  const handleViewProduct = (productId: string) => {
    setSelectedProductId(productId);
    setActiveTab('preview');
    
    if ((window as any).addAuditEntry) {
      (window as any).addAuditEntry(
        'Product Viewed',
        `Viewed product details for ID: ${productId}`,
        'update'
      );
    }
  };

  const handleEditProduct = (productId: string) => {
    setSelectedProductId(productId);
    setActiveTab('template');
    
    if ((window as any).addAuditEntry) {
      (window as any).addAuditEntry(
        'Product Edit Started',
        `Started editing product ID: ${productId}`,
        'update'
      );
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      if ((window as any).addAuditEntry) {
        (window as any).addAuditEntry(
          'Product Deleted',
          `Deleted product ID: ${productId}`,
          'delete'
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <AdminHeader />

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 dark:bg-gray-800">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="input">URL Input</TabsTrigger>
            <TabsTrigger value="template">Template</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <AdminDashboard
              onViewProduct={handleViewProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          </TabsContent>

          <TabsContent value="input" className="space-y-6">
            <ProductUrlInput
              productUrl={productUrl}
              setProductUrl={setProductUrl}
              isLoading={isLoading}
              extractedData={extractedData}
              onSubmit={handleUrlSubmit}
            />
          </TabsContent>

          <TabsContent value="template" className="space-y-6">
            <TemplateEditor productData={extractedData} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ReportingDashboard />
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <AuditLog />
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            {extractedData ? (
              <ProductPreview productData={extractedData} extractedData={extractedData} />
            ) : (
              <Card className="shadow-lg h-96 flex items-center justify-center dark:bg-gray-800 dark:border-gray-700">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No product data available</p>
                  <p className="text-sm">Process a product URL first to see the preview</p>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
