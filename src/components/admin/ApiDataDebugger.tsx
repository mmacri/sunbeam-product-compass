import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RapidApiService } from '@/services/rapidApi';
import { useToast } from '@/hooks/use-toast';

export const ApiDataDebugger: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [searchQuery, setSearchQuery] = useState('wireless headphones');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const testApiCall = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter your RapidAPI key",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setApiResponse(null);
    
    try {
      RapidApiService.setApiKey(apiKey);
      console.log('Making API call with query:', searchQuery);
      
      const response = await RapidApiService.searchProducts(searchQuery, {
        sortBy: 'BEST_SELLERS',
        country: 'US',
        page: 1
      });

      console.log('Full API Response:', response);
      console.log('Products array:', response.products);
      
      if (response.products && response.products.length > 0) {
        console.log('First product structure:', response.products[0]);
        console.log('Available fields in first product:', Object.keys(response.products[0]));
        
        // Check specific fields we're mapping
        const firstProduct = response.products[0];
        console.log('Field mapping check:');
        console.log('- customers_say:', firstProduct.customers_say);
        console.log('- about_product:', firstProduct.about_product);
        console.log('- product_byline:', firstProduct.product_byline);
        console.log('- product_description:', firstProduct.product_description);
        console.log('- coupon_text:', firstProduct.coupon_text);
      }
      
      setApiResponse(response);
      toast({
        title: "Success",
        description: `Found ${response.products?.length || 0} products`,
      });
    } catch (error) {
      console.error('API call failed:', error);
      toast({
        title: "API Error", 
        description: error.message || "Failed to fetch data from RapidAPI",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>RapidAPI Data Structure Debugger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">RapidAPI Key:</label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your RapidAPI key"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Search Query:</label>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="wireless headphones"
            />
          </div>
        </div>

        <Button 
          onClick={testApiCall} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Testing API...' : 'Test API & Log Data Structure'}
        </Button>

        {apiResponse && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                API Response Summary
              </h3>
              <div className="text-sm space-y-1">
                <p>Total Products: {apiResponse.products?.length || 0}</p>
                <p>Query: {apiResponse.query}</p>
                <p>Country: {apiResponse.country}</p>
                <p>Status: {apiResponse.status}</p>
              </div>
            </div>

            {apiResponse.products && apiResponse.products.length > 0 && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  First Product Fields Check
                </h3>
                <div className="text-sm space-y-1">
                  <p><strong>Title:</strong> {apiResponse.products[0].product_title}</p>
                  <p><strong>customers_say:</strong> {apiResponse.products[0].customers_say || 'NULL'}</p>
                  <p><strong>about_product:</strong> {apiResponse.products[0].about_product ? 
                    `Array with ${apiResponse.products[0].about_product.length} items` : 'NULL'}</p>
                  <p><strong>product_byline:</strong> {apiResponse.products[0].product_byline || 'NULL'}</p>
                  <p><strong>product_description:</strong> {apiResponse.products[0].product_description || 'NULL'}</p>
                  <p><strong>All available fields:</strong> {Object.keys(apiResponse.products[0]).join(', ')}</p>
                </div>
              </div>
            )}

            <details className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <summary className="font-semibold cursor-pointer">Full API Response (Click to expand)</summary>
              <pre className="mt-2 text-xs overflow-auto max-h-96 bg-white dark:bg-gray-800 p-2 rounded">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </CardContent>
    </Card>
  );
};