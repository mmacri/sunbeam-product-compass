
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings } from 'lucide-react';
import { ProductExtractor } from '@/services/productExtractor';
import { RapidApiService } from '@/services/rapidApi';
import { useToast } from '@/hooks/use-toast';
import { ProductWorkflowProgress } from './ProductWorkflowProgress';
import { ProductUrlInput } from './ProductUrlInput';
import { ProductProcessing } from './ProductProcessing';
import { ProductPreviewConfig } from './ProductPreviewConfig';
import { ProductWorkflowStats } from './ProductWorkflowStats';

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

    resetWorkflow();
  };

  const resetWorkflow = () => {
    setCurrentStep('input');
    setProductUrl('');
    setExtractedData(null);
    setProductSettings({ threshold: 0, tags: '' });
    setProgress(0);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'input':
        return (
          <ProductUrlInput
            productUrl={productUrl}
            onUrlChange={setProductUrl}
            onProcess={processUrl}
          />
        );
      case 'processing':
        return <ProductProcessing progress={progress} />;
      case 'preview':
        return extractedData ? (
          <ProductPreviewConfig
            extractedData={extractedData}
            productUrl={productUrl}
            productSettings={productSettings}
            onSettingsChange={setProductSettings}
            onSave={saveProduct}
            onReset={resetWorkflow}
          />
        ) : null;
      default:
        return null;
    }
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

      {/* Main Workflow Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            <ProductWorkflowProgress currentStep={currentStep} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <ProductWorkflowStats products={products} />
    </div>
  );
};
