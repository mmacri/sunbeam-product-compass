
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Key, CheckCircle, XCircle } from 'lucide-react';
import { ProductExtractor } from '@/services/productExtractor';

interface ApiConfigurationProps {
  onShowMessage: (message: string, type?: 'success' | 'error') => void;
}

export const ApiConfiguration: React.FC<ApiConfigurationProps> = ({
  onShowMessage
}) => {
  const [rainforestApiKey, setRainforestApiKey] = useState('');
  const [isRainforestEnabled, setIsRainforestEnabled] = useState(false);
  const [isTestingApi, setIsTestingApi] = useState(false);

  useEffect(() => {
    // Load saved configuration
    const savedKey = localStorage.getItem('rainforest-api-key');
    const savedEnabled = localStorage.getItem('rainforest-enabled') === 'true';
    
    if (savedKey) {
      setRainforestApiKey(savedKey);
      setIsRainforestEnabled(savedEnabled);
      
      if (savedEnabled) {
        ProductExtractor.configureRainforestApi(savedKey);
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
      ProductExtractor.configureRainforestApi(rainforestApiKey);
    } else {
      ProductExtractor.disableRainforestApi();
    }

    onShowMessage('API configuration saved successfully');
  };

  const handleTestApi = async () => {
    if (!rainforestApiKey.trim()) {
      onShowMessage('Please enter an API key first', 'error');
      return;
    }

    setIsTestingApi(true);
    try {
      // Test with a sample Amazon product URL
      const testUrl = 'https://www.amazon.com/dp/B08N5WRWNW';
      ProductExtractor.configureRainforestApi(rainforestApiKey);
      
      await ProductExtractor.extractFromUrl(testUrl);
      onShowMessage('API test successful! Enhanced data extraction is working.');
    } catch (error) {
      onShowMessage(`API test failed: ${error.message}`, 'error');
    } finally {
      setIsTestingApi(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          API Configuration
        </CardTitle>
        <p className="text-sm text-gray-600">
          Configure external APIs for enhanced product data extraction
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rainforest API Configuration */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Rainforest API</Label>
              <p className="text-sm text-gray-600">
                Enhanced Amazon product data extraction with rich metadata
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={isRainforestEnabled}
                onCheckedChange={setIsRainforestEnabled}
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
                <Label htmlFor="rainforest-api-key">API Key</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="rainforest-api-key"
                      type="password"
                      placeholder="Enter your Rainforest API key"
                      value={rainforestApiKey}
                      onChange={(e) => setRainforestApiKey(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleTestApi}
                    disabled={isTestingApi || !rainforestApiKey.trim()}
                  >
                    {isTestingApi ? 'Testing...' : 'Test'}
                  </Button>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Get your API key from <a href="https://rainforestapi.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">rainforestapi.com</a></p>
                <p>• Enhanced data includes categories, specifications, ratings, and metadata</p>
                <p>• Falls back to web scraping if API fails or is unavailable</p>
              </div>
            </div>
          )}
        </div>

        {/* Save Configuration */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSaveConfiguration}>
            Save Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
