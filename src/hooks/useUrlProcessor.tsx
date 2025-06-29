
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useUrlProcessor = () => {
  const [productUrl, setProductUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const { toast } = useToast();

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

  return {
    productUrl,
    setProductUrl,
    isLoading,
    extractedData,
    handleUrlSubmit
  };
};
