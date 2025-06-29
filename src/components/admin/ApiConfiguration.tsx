
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Key, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { RainforestApiService } from '@/services/rainforestApi';

interface ApiConfigurationProps {
  onShowMessage: (message: string, type?: 'success' | 'error') => void;
  onLogAction: (action: string, details: any) => void;
}

export const ApiConfiguration: React.FC<ApiConfigurationProps> = ({
  onShowMessage,
  onLogAction
}) => {
  const [rainforestApiKey, setRainforestApiKey] = useState('');
  const [isRainforestEnabled, setIsRainforestEnabled] = useState(false);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    // Load saved configuration
    const savedKey = localStorage.getItem('rainforest-api-key');
    const savedEnabled = localStorage.getItem('rainforest-enabled') === 'true';
    
    if (savedKey) {
      setRainforestApiKey(savedKey);
      setIsRainforestEnabled(savedEnabled);
      
      if (savedEnabled) {
        RainforestApiService.setApiKey(savedKey);
      }
    }
  }, []);

  const handleSaveConfiguration = () => {
    if (isRainforestEnabled && !rainforestApiKey.trim()) {
      onShowMessage('Please enter a valid Rainforest API key', 'error');
      return;
    }

    localStorage.setItem('rainforest-api-key', rainforestApiKey);
    localStorage.setItem('rainforest-enabled', isRainforestEnabled.toString());

    if (isRainforestEnabled) {
      RainforestApiService.setApiKey(rainforestApiKey);
    }

    onLogAction('API Configuration Updated', {
      rainforestEnabled: isRainforestEnabled,
      hasApiKey: !!rainforestApiKey.trim()
    });

    onShowMessage('API configuration saved successfully');
    setTestResult(null);
  };

  const handleTestApi = async () => {
    if (!rainforestApiKey.trim()) {
      onShowMessage('Please enter an API key first', 'error');
      return;
    }

    setIsTestingApi(true);
    setTestResult(null);

    try {
      // Test with a sample Amazon product URL
      const testUrl = 'https://www.amazon.com/dp/B08N5WRWNW';
      RainforestApiService.setApiKey(rainforestApiKey);
      
      const result = await RainforestApiService.extractProductData(testUrl);
      
      if (result && result.title) {
        setTestResult('success');
        onShowMessage('API test successful! Enhanced data extraction is working.');
        onLogAction('API Test Successful', { testUrl, resultTitle: result.title });
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (error) {
      setTestResult('error');
      onShowMessage(`API test failed: ${error.message}`, 'error');
      onLogAction('API Test Failed', { error: error.message });
    } finally {
      setIsTestingApi(false);
    }
  };

  const handleToggleEnabled = (enabled: boolean) => {
    setIsRainforestEnabled(enabled);
    setTestResult(null);
    if (!enabled) {
      // Clear API key when disabling
      RainforestApiService.setApiKey('');
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
        {/* Rainforest API Configuration */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium dark:text-gray-200">Rainforest API</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enhanced Amazon product data extraction with rich metadata
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={isRainforestEnabled}
                onCheckedChange={handleToggleEnabled}
              />
              <Badge variant={isRainforestEnabled ? 'default' : 'secondary'}>
                {isRainforestEnabled ? (
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

          {isRainforestEnabled && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="rainforest-api-key" className="dark:text-gray-200">API Key</Label>
                <div className="flex gap-2 mt-1">
                  <div className="relative flex-1">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="rainforest-api-key"
                      type="password"
                      placeholder="Enter your Rainforest API key"
                      value={rainforestApiKey}
                      onChange={(e) => setRainforestApiKey(e.target.value)}
                      className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleTestApi}
                    disabled={isTestingApi || !rainforestApiKey.trim()}
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
                    {testResult === 'success' ? 'API connection successful' : 'API test failed'}
                  </div>
                )}
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <p>• Get your API key from <a href="https://rainforestapi.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">rainforestapi.com</a></p>
                <p>• Enhanced data includes categories, specifications, ratings, and metadata</p>
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
