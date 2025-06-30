
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Key, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { RapidApiService } from '@/services/rapidApi';

interface ApiConfigurationProps {
  onShowMessage: (message: string, type?: 'success' | 'error') => void;
  onLogAction: (action: string, details: any) => void;
}

export const ApiConfiguration: React.FC<ApiConfigurationProps> = ({
  onShowMessage,
  onLogAction
}) => {
  const [rapidApiKey, setRapidApiKey] = useState('');
  const [isRapidApiEnabled, setIsRapidApiEnabled] = useState(false);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [testError, setTestError] = useState<string>('');

  useEffect(() => {
    // Load saved configuration
    const savedKey = localStorage.getItem('rapidapi-key');
    const savedEnabled = localStorage.getItem('rapidapi-enabled') === 'true';
    
    if (savedKey) {
      setRapidApiKey(savedKey);
      setIsRapidApiEnabled(savedEnabled);
      
      if (savedEnabled) {
        RapidApiService.setApiKey(savedKey);
      }
    }
  }, []);

  const handleSaveConfiguration = () => {
    if (isRapidApiEnabled && !rapidApiKey.trim()) {
      onShowMessage('Please enter a valid RapidAPI key', 'error');
      return;
    }

    localStorage.setItem('rapidapi-key', rapidApiKey);
    localStorage.setItem('rapidapi-enabled', isRapidApiEnabled.toString());

    if (isRapidApiEnabled) {
      RapidApiService.setApiKey(rapidApiKey);
    }

    onLogAction('API Configuration Updated', {
      rapidApiEnabled: isRapidApiEnabled,
      hasApiKey: !!rapidApiKey.trim()
    });

    onShowMessage('API configuration saved successfully');
    setTestResult(null);
    setTestError('');
  };

  const handleTestApi = async () => {
    if (!rapidApiKey.trim()) {
      onShowMessage('Please enter an API key first', 'error');
      return;
    }

    setIsTestingApi(true);
    setTestResult(null);
    setTestError('');

    try {
      console.log('Testing API with key:', `${rapidApiKey.substring(0, 10)}...`);
      
      // Test with a simple search query that matches the curl example
      const testQuery = 'massage gun';
      RapidApiService.setApiKey(rapidApiKey);
      
      const result = await RapidApiService.searchProducts(testQuery, {
        country: 'US',
        sortBy: 'BEST_SELLERS',
        condition: 'NEW',
        page: 1,
        isPrime: false,
        fourStarsAndUp: true
      });
      
      console.log('API test result:', result);
      
      if (result && (result.status === 'OK' || result.products)) {
        const productCount = result.total_products || result.products?.length || 0;
        setTestResult('success');
        onShowMessage(`API test successful! Found ${productCount} products for "${testQuery}".`);
        onLogAction('API Test Successful', { 
          testQuery, 
          totalProducts: productCount,
          sampleProduct: result.products?.[0]?.product_title || 'No products found'
        });
      } else {
        throw new Error('Invalid response format or no data returned');
      }
    } catch (error) {
      console.error('API test failed:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      setTestResult('error');
      setTestError(errorMessage);
      onShowMessage(`API test failed: ${errorMessage}`, 'error');
      onLogAction('API Test Failed', { error: errorMessage });
    } finally {
      setIsTestingApi(false);
    }
  };

  const handleToggleEnabled = (enabled: boolean) => {
    setIsRapidApiEnabled(enabled);
    setTestResult(null);
    setTestError('');
    if (!enabled) {
      // Clear API key when disabling
      RapidApiService.setApiKey('');
    }
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 dark:text-gray-100">
          <Settings className="w-5 h-5 text-blue-500" />
          API Configuration
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Configure external APIs for enhanced product data extraction
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* RapidAPI Configuration */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium dark:text-gray-200">RapidAPI - Amazon Data Scraper</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enhanced Amazon product search and data extraction with rich metadata
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={isRapidApiEnabled}
                onCheckedChange={handleToggleEnabled}
              />
              <Badge variant={isRapidApiEnabled ? 'default' : 'secondary'}>
                {isRapidApiEnabled ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Enabled
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 mr-1" />
                    Disabled
                  </>
                )}
              </Badge>
            </div>
          </div>

          {isRapidApiEnabled && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="rapidapi-key" className="dark:text-gray-200">API Key</Label>
                <div className="flex gap-2 mt-1">
                  <div className="relative flex-1">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="rapidapi-key"
                      type="password"
                      placeholder="Enter your RapidAPI key"
                      value={rapidApiKey}
                      onChange={(e) => setRapidApiKey(e.target.value)}
                      className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleTestApi}
                    disabled={isTestingApi || !rapidApiKey.trim()}
                    className="dark:border-gray-600 dark:text-gray-300"
                  >
                    {isTestingApi ? 'Testing...' : 'Test'}
                  </Button>
                </div>
                
                {/* Test Result Indicator */}
                {testResult && (
                  <div className={`flex items-center gap-2 mt-2 text-sm ${
                    testResult === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {testResult === 'success' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    {testResult === 'success' ? 'API connection successful' : `API test failed: ${testError}`}
                  </div>
                )}
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <p>• Get your API key from <a href="https://rapidapi.com/dataforseo/api/amazon-data-scraper" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">RapidAPI Amazon Data Scraper</a></p>
                <p>• Make sure you're subscribed to the API (check your RapidAPI dashboard)</p>
                <p>• Enhanced data includes product details, ratings, pricing, and availability</p>
                <p>• Falls back to web scraping if API fails or is unavailable</p>
              </div>
            </div>
          )}
        </div>

        {/* Save Configuration */}
        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button onClick={handleSaveConfiguration} className="bg-blue-600 hover:bg-blue-700">
            Save Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
