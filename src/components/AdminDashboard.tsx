import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  RefreshCw, 
  FileText, 
  BarChart3,
  Activity,
  Plus,
  Filter,
  Settings
} from 'lucide-react';
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
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [newProduct, setNewProduct] = useState({
    url: '',
    threshold: 0,
    tags: ''
  });
  const [filterTag, setFilterTag] = useState('');
  const [template, setTemplate] = useState(`# {{title}} Review

**Price**: {{price}}
**Last Updated**: {{lastUpdated}}

## Product Overview
{{description}}

## Key Features
{{#each features}}
- {{this}}
{{/each}}

## Specifications
{{#each specs}}
**{{@key}}**: {{this}}
{{/each}}

---
*Review generated on {{timestamp}}*`);
  const [previewHtml, setPreviewHtml] = useState('');
  const [showLogs, setShowLogs] = useState(false);
  const [messageArea, setMessageArea] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
    loadLogs();
    loadTemplate();
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
    const updatedLogs = [newLog, ...logs].slice(0, 100);
    setLogs(updatedLogs);
    localStorage.setItem('sunbeam-logs', JSON.stringify(updatedLogs));
  };

  const loadProducts = () => {
    const saved = localStorage.getItem('sunbeam-products');
    if (saved) {
      setProducts(JSON.parse(saved));
    }
  };

  const loadLogs = () => {
    const saved = localStorage.getItem('sunbeam-logs');
    if (saved) {
      setLogs(JSON.parse(saved));
    }
  };

  const loadTemplate = () => {
    const saved = localStorage.getItem('sunbeam-template');
    if (saved) {
      setTemplate(saved);
    }
  };

  const saveProducts = (updatedProducts: Product[]) => {
    localStorage.setItem('sunbeam-products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
  };

  const addProduct = async () => {
    if (!newProduct.url) {
      showMessage('URL is required', 'error');
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
    saveProducts(updatedProducts);
    logAction('product_added', { url: newProduct.url, threshold: newProduct.threshold });
    showMessage('Product added successfully');
    setNewProduct({ url: '', threshold: 0, tags: '' });
  };

  const rescrapeProduct = (id: string) => {
    const updatedProducts = products.map(p => 
      p.id === id 
        ? { ...p, lastUpdated: new Date().toISOString(), price: `$${(Math.random() * 100 + 50).toFixed(2)}` }
        : p
    );
    saveProducts(updatedProducts);
    logAction('product_rescraped', { id });
    showMessage('Product data updated');
  };

  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter(p => p.id !== id);
    saveProducts(updatedProducts);
    logAction('product_deleted', { id });
    showMessage('Product deleted');
    onDeleteProduct(id);
  };

  const saveTemplate = () => {
    localStorage.setItem('sunbeam-template', template);
    logAction('template_saved', {});
    showMessage('Template saved');
  };

  const renderPreview = () => {
    if (products.length === 0) {
      setPreviewHtml('<p>No products available for preview</p>');
      return;
    }

    const sampleProduct = products[0];
    let html = template
      .replace(/\{\{title\}\}/g, sampleProduct.title)
      .replace(/\{\{price\}\}/g, sampleProduct.price)
      .replace(/\{\{lastUpdated\}\}/g, new Date(sampleProduct.lastUpdated).toLocaleDateString())
      .replace(/\{\{timestamp\}\}/g, new Date().toLocaleDateString());

    setPreviewHtml(html);
  };

  const exportLogs = (format: 'csv' | 'json') => {
    let data: string;
    
    if (format === 'csv') {
      const csvRows = logs.map(l => `${l.timestamp},${l.action},"${JSON.stringify(l.details)}"`);
      data = ['timestamp,action,details', ...csvRows].join('\n');
    } else {
      data = JSON.stringify(logs, null, 2);
    }
    
    const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sunbeam-logs.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    
    logAction('logs_exported', { format });
    showMessage(`Logs exported as ${format.toUpperCase()}`);
  };

  const filteredProducts = filterTag 
    ? products.filter(p => p.tags.some(tag => tag.toLowerCase().includes(filterTag.toLowerCase())))
    : products;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Message Area */}
      {messageArea && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-md shadow-lg z-50">
          {messageArea}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Sunbeam Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage products, templates, and generate blog content
          </p>
        </header>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="template" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Template
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Logs
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <section>
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
            </section>

            <section>
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
            </section>
          </TabsContent>

          {/* Template Tab */}
          <TabsContent value="template" className="space-y-6">
            <section>
              <Card>
                <CardHeader>
                  <CardTitle>Template Editor</CardTitle>
                  <p className="text-sm text-gray-600">
                    Use template variables like {`{{title}}`}, {`{{price}}`}, {`{{description}}`}, etc.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    placeholder="Enter your blog template using {{variable}} syntax..."
                    className="min-h-64 font-mono text-sm"
                  />
                  <div className="flex gap-2">
                    <Button onClick={saveTemplate}>
                      Save Template
                    </Button>
                    <Button variant="outline" onClick={renderPreview}>
                      Render Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section>
              <Card>
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="min-h-32 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <section>
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100">Total Products</h3>
                      <p className="text-2xl font-bold text-blue-600">{products.length}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-900 dark:text-green-100">Active Alerts</h3>
                      <p className="text-2xl font-bold text-green-600">
                        {products.filter(p => p.threshold > 0).length}
                      </p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold text-orange-900 dark:text-orange-100">Total Actions</h3>
                      <p className="text-2xl font-bold text-orange-600">{logs.length}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => exportLogs('csv')}>
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button variant="outline" onClick={() => exportLogs('json')}>
                      <Download className="w-4 h-4 mr-2" />
                      Export JSON
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <section>
              <Card>
                <CardHeader>
                  <CardTitle>System Logs</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowLogs(!showLogs)}>
                      <Eye className="w-4 h-4 mr-2" />
                      {showLogs ? 'Hide' : 'View'} Logs
                    </Button>
                    <Button variant="outline" onClick={() => exportLogs('csv')}>
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button variant="outline" onClick={() => exportLogs('json')}>
                      <Download className="w-4 h-4 mr-2" />
                      Export JSON
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {showLogs && (
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg max-h-64 overflow-y-auto">
                      <pre className="text-sm whitespace-pre-wrap">
                        {logs.slice(0, 10).map((log, index) => (
                          `${log.timestamp} - ${log.action} - ${JSON.stringify(log.details)}\n`
                        )).join('')}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            <section>
              <Card>
                <CardHeader>
                  <CardTitle>Content Preview</CardTitle>
                  <p className="text-sm text-gray-600">
                    This is how your content will appear to end users
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-6 bg-white dark:bg-gray-800">
                    <div 
                      className="prose prose-sm max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: previewHtml || '<p>Click "Render Preview" in the Template tab to see content here</p>' }}
                    />
                  </div>
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <section>
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Default Alert Threshold</Label>
                      <Input type="number" placeholder="50" />
                    </div>
                    <div>
                      <Label>WordPress API Endpoint</Label>
                      <Input placeholder="https://your-site.com/wp-json/wp/v2/posts" />
                    </div>
                    <div>
                      <Label>Email Alert Endpoint</Label>
                      <Input placeholder="https://your-email-service.com/send" />
                    </div>
                    <Button>Save Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
