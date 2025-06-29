
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Moon, Sun, Link2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdminDashboard } from '@/components/AdminDashboard';
import { TemplateEditor } from '@/components/TemplateEditor';
import { ReportingDashboard } from '@/components/ReportingDashboard';
import { AuditLog } from '@/components/AuditLog';
import { ProductPreview } from '@/components/ProductPreview';
import { useTheme } from '@/contexts/ThemeContext';

const Admin = () => {
  const [productUrl, setProductUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid product URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Processing URL:", productUrl);

    // Log the action
    if ((window as any).addAuditEntry) {
      (window as any).addAuditEntry(
        'URL Processing Started',
        `Processing product URL: ${productUrl}`,
        'create'
      );
    }

    // Simulate API call to extract product data
    setTimeout(() => {
      const mockExtractedData = {
        title: detectProductFromUrl(productUrl),
        currentPrice: "$" + (Math.floor(Math.random() * 500) + 50),
        originalPrice: "$" + (Math.floor(Math.random() * 200) + 400),
        description: "High-quality product with excellent features and customer satisfaction. Advanced technology meets user-friendly design.",
        rating: parseFloat((4 + Math.random()).toFixed(1)),
        reviews: Math.floor(Math.random() * 5000) + 100,
        category: detectCategoryFromUrl(productUrl),
        keyFeatures: [
          "Premium build quality with durable materials",
          "Advanced functionality for professional use",
          "User-friendly design and interface",
          "Excellent value for money and performance",
          "Comprehensive warranty and support"
        ],
        specs: {
          "Brand": detectBrandFromUrl(productUrl),
          "Model": "Pro Series 2025",
          "Warranty": "2 Years Manufacturer",
          "Weight": (2 + Math.random() * 3).toFixed(1) + " lbs",
          "Dimensions": "12 x 8 x 4 inches",
          "Color Options": "Black, White, Silver"
        },
        priceHistory: [
          { date: "2025-06-01", price: "$450", store: "Amazon" },
          { date: "2025-06-15", price: "$420", store: "Walmart" },
          { date: "2025-06-29", price: "$399", store: "eBay" }
        ]
      };

      setExtractedData(mockExtractedData);
      setIsLoading(false);

      // Log successful extraction
      if ((window as any).addAuditEntry) {
        (window as any).addAuditEntry(
          'Product Data Extracted',
          `Successfully extracted data for: ${mockExtractedData.title}`,
          'create'
        );
      }

      toast({
        title: "Success!",
        description: "Product data extracted successfully. Review and edit in the preview panel.",
      });
    }, 2000);
  };

  const detectProductFromUrl = (url: string) => {
    if (url.includes('theragun') || url.includes('massage')) return 'Theragun Pro 5 Massage Gun';
    if (url.includes('laptop') || url.includes('macbook')) return 'MacBook Pro 14" M3 Chip';
    if (url.includes('headphones') || url.includes('airpods')) return 'Sony WH-1000XM5 Wireless Headphones';
    if (url.includes('phone') || url.includes('iphone')) return 'iPhone 15 Pro Max 256GB';
    if (url.includes('watch') || url.includes('apple')) return 'Apple Watch Series 9 GPS';
    if (url.includes('camera')) return 'Canon EOS R5 Mirrorless Camera';
    return 'Premium Professional Product';
  };

  const detectCategoryFromUrl = (url: string) => {
    if (url.includes('electronics') || url.includes('phone')) return 'Electronics';
    if (url.includes('health') || url.includes('massage')) return 'Health & Wellness';
    if (url.includes('computers') || url.includes('laptop')) return 'Computers & Technology';
    if (url.includes('camera') || url.includes('photo')) return 'Photography';
    return 'General';
  };

  const detectBrandFromUrl = (url: string) => {
    if (url.includes('apple')) return 'Apple';
    if (url.includes('sony')) return 'Sony';
    if (url.includes('canon')) return 'Canon';
    if (url.includes('theragun')) return 'Theragun';
    return 'Premium Brand';
  };

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
      
      toast({
        title: "Product Deleted",
        description: "The product has been removed from the system.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-indigo-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Sunbeam Admin Panel
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="dark:text-gray-300"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:border-indigo-800">
                Product Review Generator
              </Badge>
            </div>
          </div>
        </div>
      </header>

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
            <div className="grid lg:grid-cols-2 gap-8">
              {/* URL Input Panel */}
              <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  <CardTitle className="flex items-center space-x-2">
                    <Link2 className="w-5 h-5" />
                    <span>Product URL Input</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleUrlSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="product-url" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Product URL (Amazon, Walmart, eBay, etc.)
                      </label>
                      <Input
                        id="product-url"
                        type="url"
                        placeholder="https://amazon.com/product/..."
                        value={productUrl}
                        onChange={(e) => setProductUrl(e.target.value)}
                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processing...' : 'Extract Product Data'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Preview Panel */}
              <div>
                {extractedData ? (
                  <ProductPreview productData={extractedData} extractedData={extractedData} />
                ) : (
                  <Card className="shadow-lg h-96 flex items-center justify-center dark:bg-gray-800 dark:border-gray-700">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <Link2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Preview will appear here</p>
                      <p className="text-sm">Enter a product URL to get started</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
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
