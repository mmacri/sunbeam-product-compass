
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { InteractivePriceChart } from './InteractivePriceChart';
import { ProductSpecs } from './ProductSpecs';
import { RefreshCw, Send, Share2, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  title: string;
  url: string;
  price: string;
  specs: Record<string, string>;
  history: Array<{ date: string; price: string; store: string }>;
  lastUpdated: string;
  threshold: number;
}

export const ProductPreview = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isStale, setIsStale] = useState(false);
  const [messageArea, setMessageArea] = useState('');
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    loadProductData();
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

  const loadProductData = () => {
    const savedProducts = localStorage.getItem('sunbeam-products');
    if (savedProducts) {
      const products = JSON.parse(savedProducts);
      if (products.length > 0) {
        const latestProduct = products[0];
        const mockProduct: Product = {
          id: latestProduct.id,
          title: latestProduct.title,
          url: latestProduct.url,
          price: latestProduct.price,
          specs: {
            'Brand': 'Sample Brand',
            'Model': 'SP-001',
            'Color': 'Black',
            'Weight': '1.2 lbs',
            'Dimensions': '10" x 6" x 2"',
            'Warranty': '2 years'
          },
          history: [
            { date: '2025-01-01', price: '$120.00', store: 'Amazon' },
            { date: '2025-01-15', price: '$115.00', store: 'Amazon' },
            { date: '2025-02-01', price: '$110.00', store: 'Amazon' },
            { date: '2025-02-15', price: latestProduct.price, store: 'Amazon' }
          ],
          lastUpdated: latestProduct.lastUpdated,
          threshold: latestProduct.threshold
        };
        setProduct(mockProduct);

        // Check if data is stale (older than 24 hours)
        const lastUpdate = new Date(latestProduct.lastUpdated);
        const now = new Date();
        const hoursDiff = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
        setIsStale(hoursDiff > 24);
      }
    }
  };

  const refreshData = () => {
    loadProductData();
    showMessage('Data refreshed successfully');
  };

  const postToWordPress = async () => {
    try {
      // Simulate WordPress API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showMessage('Posted to WordPress successfully');
    } catch (error) {
      showMessage('Failed to post to WordPress', 'error');
    }
  };

  const sendPriceAlert = async () => {
    if (!product) return;
    
    try {
      const currentPrice = parseFloat(product.price.replace('$', ''));
      if (currentPrice < product.threshold) {
        // Simulate email alert
        await new Promise(resolve => setTimeout(resolve, 1000));
        showMessage('Price alert sent successfully');
      } else {
        showMessage('Price is not below threshold', 'error');
      }
    } catch (error) {
      showMessage('Failed to send price alert', 'error');
    }
  };

  const getBuyLinks = () => {
    if (!product) return [];
    
    const links = [];
    if (product.url.includes('amazon.com')) {
      links.push({ name: 'Buy on Amazon', url: product.url });
    }
    if (product.url.includes('walmart.com')) {
      links.push({ name: 'Buy on Walmart', url: product.url });
    }
    if (links.length === 0) {
      links.push({ name: 'Buy on Source', url: product.url });
    }
    return links;
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No product data available. Please add products in the admin panel.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Message Area */}
      {messageArea && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-md shadow-lg z-50">
          {messageArea}
        </div>
      )}

      {/* Stale Banner */}
      {isStale && (
        <div className="bg-orange-100 dark:bg-orange-900 border-l-4 border-orange-500 p-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <p className="text-orange-700 dark:text-orange-300">
              ⚠️ This data is more than 24 hours old. Consider refreshing for the latest information.
            </p>
            <Button variant="outline" size="sm" onClick={refreshData}>
              Refresh Now
            </Button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {product.title} Review
              </h1>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {product.price}
                </Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Last updated: {new Date(product.lastUpdated).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={refreshData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
              <Button variant="outline" size="sm" onClick={postToWordPress}>
                <Share2 className="w-4 h-4 mr-2" />
                Post to WordPress
              </Button>
              <Button variant="outline" size="sm" onClick={sendPriceAlert}>
                <Send className="w-4 h-4 mr-2" />
                Send Price Alert
              </Button>
              <Button variant="outline" size="sm" onClick={toggleTheme}>
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </header>

        <div className="grid gap-6">
          {/* Product Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Product Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                This is a comprehensive review of the {product.title}. Based on our analysis, 
                this product offers excellent value for money with its current price of {product.price}. 
                The product features high-quality construction and reliable performance that makes it 
                a great choice for consumers looking for quality and affordability.
              </p>
            </CardContent>
          </Card>

          {/* Specifications */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Technical Specifications
            </h2>
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium text-gray-900 dark:text-gray-100">Spec</th>
                      <th className="text-left p-4 font-medium text-gray-900 dark:text-gray-100">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(product.specs).length > 0 ? (
                      Object.entries(product.specs).map(([key, value]) => (
                        <tr key={key} className="border-b last:border-b-0">
                          <td className="p-4 text-gray-700 dark:text-gray-300">{key}</td>
                          <td className="p-4 text-gray-900 dark:text-gray-100">{value}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="p-4 text-center text-gray-500">
                          No specs available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          {/* Price History Chart */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Price History
            </h2>
            <InteractivePriceChart 
              priceHistory={product.history} 
              title={product.title}
            />
          </div>

          {/* Buy Links */}
          <Card>
            <CardHeader>
              <CardTitle>Where to Buy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {getBuyLinks().map((link, index) => (
                  <Button key={index} asChild>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.name}
                    </a>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Review Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Review Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">Pros</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                    <li>Excellent build quality and durability</li>
                    <li>Competitive pricing with good value</li>
                    <li>Reliable performance and user-friendly design</li>
                    <li>Comprehensive warranty coverage</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">Cons</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                    <li>Limited color options available</li>
                    <li>May require additional accessories for full functionality</li>
                  </ul>
                </div>
                <Separator />
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Overall Rating: 4.5/5 ⭐⭐⭐⭐⭐
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Highly recommended for users looking for quality and value
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
