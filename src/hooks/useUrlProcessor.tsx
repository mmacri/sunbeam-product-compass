
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ProductExtractor } from '@/services/productExtractor';

export const useUrlProcessor = () => {
  const [productUrl, setProductUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const { toast } = useToast();

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

    try {
      const extractedProductData = await ProductExtractor.extractFromUrl(productUrl);
      
      setExtractedData(extractedProductData);
      
      // Log successful extraction
      if ((window as any).addAuditEntry) {
        (window as any).addAuditEntry(
          'Product Data Extracted',
          `Successfully extracted data for: ${extractedProductData.title}`,
          'create'
        );
      }

      toast({
        title: "Success!",
        description: "Real product data extracted successfully. Review the details in the preview panel.",
      });
    } catch (error) {
      console.error('Error extracting product data:', error);
      
      // Log extraction failure
      if ((window as any).addAuditEntry) {
        (window as any).addAuditEntry(
          'Product Extraction Failed',
          `Failed to extract data from: ${productUrl}. Error: ${error.message}`,
          'error'
        );
      }

      toast({
        title: "Extraction Failed",
        description: "Unable to extract product data. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    productUrl,
    setProductUrl,
    isLoading,
    extractedData,
    handleUrlSubmit
  };
};
