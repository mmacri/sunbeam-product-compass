
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus,
  Link2,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Settings
} from 'lucide-react';
import { ProductExtractor } from '@/services/productExtractor';
import { RapidApiService } from '@/services/rapidApi';
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

interface UnifiedProductWorkflowProps {
  products: Product[];
  onProductsChange: (products: Product[]) => void;
  onLogAction: (action: string, details: any) => void;
}

export const UnifiedProductWorkflow: React.FC<UnifiedProductWorkflowProps> = ({
  products,
  onProductsChange,
  onLogAction
}) => {
  const [currentStep, setCurrentStep] = useState<'input' | 'processing' | 'preview' | 'save'>('input');
  const [productUrl, setProductUrl] = useState('');
  const [extractedData, setExtractedData] = useState<any>(null);
  const [productSettings, setProductSettings] = useState({
    threshold: 0,
    tags: ''
  });
  const [progress, setProgress] = useState(0);
  const [isApiConfigured, setIsApiConfigured] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if RapidAPI is configured
    const rapidApiKey = localStorage.getItem('rapidapi-key');
    const rapidApiEnabled = localStorage.getItem('rapidapi-enabled') === 'true';
    setIsApiConfigured(!!rapidApiKey && rapidApiEnabled);
    
    if (rapidApiKey && rapidApiEnabled) {
      RapidApiService.setApiKey(rapidApiKey);
    }
  }, []);

  const processUrl = async () => {
    if (!productUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid product URL",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep('processing');
    setProgress(0);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      const data = await ProductExtractor.extractFromUrl(productUrl);
      clearInterval(progressInterval);
      setProgress(100);
      
      setExtractedData(data);
      setCurrentStep('preview');
      
      onLogAction('url_processed', { url: productUrl, title: data.title });
      
      toast({
        title: "Success!",
        description: "Product data extracted successfully",
      });
    } catch (error) {
      clearInterval(progressInterval);
      setCurrentStep('input');
      setProgress(0);
      
      onLogAction('url_process_failed', { url: productUrl, error: error.message });
      
      toast({
        title: "Extraction Failed",
        description: error.message || "Unable to extract product data. Please check the URL and try again.",
        variant: "destructive",
      });
    }
  };

  const saveProduct = () => {
    if (!extractedData) return;

    const newProduct: Product = {
      id: Date.now().toString(),
      title: extractedData.title,
      url: productUrl,
      threshold: productSettings.threshold,
      tags: productSettings.tags.split(',').map(t => t.trim()).filter(t => t),
      price: extractedData.currentPrice,
      lastUpdated: new Date().toISOString()
    };

    const updatedProducts = [...products, newProduct];
    onProductsChange(updatedProducts);
    onLogAction('product_added', { url: productUrl, title: extractedData.title });
    
    toast({
      title: "Product Added",
      description: "Product has been added to your tracking list",
    });

    // Reset workflow
    setCurrentStep('input');
    setProductUrl('');
    setExtractedData(null);
    setProductSettings({ threshold: 0, tags: '' });
    setProgress(0);
  };

  const resetWorkflow = () => {
    setCurrentStep('input');
    setProductUrl('');
    setExtractedData(null);
    setProductSettings({ threshold: 0, tags: '' });
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      {/* API Configuration Warning */}
      {!isApiConfigured && (
        <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <Settings className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800 dark:text-orange-200">
            <strong>Enhanced Features Disabled:</strong> Configure your RapidAPI key in Settings to unlock advanced product data extraction with rich metadata, ratings, and pricing information.
          </AlertDescription>
        </Alert>
      )}

      {/* Progress Indicator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Add New Product</span>
            <Badge variant="outline">
              Step {currentStep === 'input' ? '1' : currentStep === 'processing' ? '2' : currentStep === 'preview' ? '3' : '4'} of 4
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className={`flex items-center space-x-2 ${currentStep !== 'input' ? 'text-green-600' : 'text-blue-600'}`}>
              {currentStep !== 'input' ? <CheckCircle className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border-2 border-current" />}
              <span className="text-sm font-medium">Enter URL</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700">
              <div className={`h-full bg-blue-500 transition-all duration-300 ${currentStep === 'input' ? 'w-0' : 'w-full'}`} />
            </div>
            <div className={`flex items-center space-x-2 ${currentStep === 'processing' ? 'text-blue-600' : currentStep === 'preview' || currentStep === 'save' ? 'text-green-600' : 'text-gray-400'}`}>
              {currentStep === 'processing' ? <Loader2 className="w-5 h-5 animate-spin" /> : 
               currentStep === 'preview' || currentStep === 'save' ? <CheckCircle className="w-5 h-5" /> : 
               <div className="w-5 h-5 rounded-full border-2 border-current" />}
              <span className="text-sm font-medium">Extract Data</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700">
              <div className={`h-full bg-blue-500 transition-all duration-300 ${currentStep === 'input' || currentStep === 'processing' ? 'w-0' : 'w-full'}`} />
            </div>
            <div className={`flex items-center space-x-2 ${currentStep === 'save' ? 'text-green-600' : currentStep === 'preview' ? 'text-blue-600' : 'text-gray-400'}`}>
              {currentStep === 'save' ? <CheckCircle className="w-5 h-5" /> : 
               <div className="w-5 h-5 rounded-full border-2 border-current" />}
              <span className="text-sm font-medium">Configure & Save</span>
            </div>
          </div>

          {currentStep === 'input' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="product-url">Product URL</Label>
                <div className="flex space-x-2">
                  <Input
                    id="product-url"
                    placeholder="https://amazon.com/product/..."
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={processUrl} disabled={!productUrl.trim()}>
                    <Link2 className="w-4 h-4 mr-2" />
                    Extract
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'processing' && (
            <div className="space-y-4 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Extracting product data...</p>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {currentStep === 'preview' && extractedData && (
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Product data extracted successfully! Review the details below and configure your settings.
                </AlertDescription>
              </Alert>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Extracted Product Data</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                    <p><strong>Title:</strong> {extractedData.title}</p>
                    <p><strong>Price:</strong> {extractedData.currentPrice}</p>
                    <p><strong>Rating:</strong> {extractedData.rating}/5</p>
                    <p><strong>Category:</strong> {extractedData.category}</p>
                    <a 
                      href={productUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:underline text-sm"
                    >
                      View Product <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Product Settings</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="threshold">Price Alert Threshold ($)</Label>
                      <Input
                        id="threshold"
                        type="number"
                        placeholder="50"
                        value={productSettings.threshold}
                        onChange={(e) => setProductSettings({...productSettings, threshold: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        placeholder="electronics, wireless, headphones"
                        value={productSettings.tags}
                        onChange={(e) => setProductSettings({...productSettings, tags: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={resetWorkflow}>
                  Start Over
                </Button>
                <Button onClick={saveProduct} className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Link2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Alerts</p>
                <p className="text-2xl font-bold">{products.filter(p => p.threshold > 0).length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
                <p className="text-2xl font-bold">{products.filter(p => new Date(p.lastUpdated).getMonth() === new Date().getMonth()).length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
