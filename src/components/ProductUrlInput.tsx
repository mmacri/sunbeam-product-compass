
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link2, AlertCircle } from 'lucide-react';
import { ProductPreview } from '@/components/ProductPreview';

interface ProductUrlInputProps {
  productUrl: string;
  setProductUrl: (url: string) => void;
  isLoading: boolean;
  extractedData: any;
  onSubmit: (e: React.FormEvent) => void;
}

export const ProductUrlInput: React.FC<ProductUrlInputProps> = ({
  productUrl,
  setProductUrl,
  isLoading,
  extractedData,
  onSubmit
}) => {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* URL Input Panel */}
      <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardTitle className="flex items-center space-x-2">
            <Link2 className="w-5 h-5" />
            <span>Product URL Input</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="product-url" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Product URL (Amazon, Walmart, eBay, etc.)
              </label>
              <Input
                id="product-url"
                type="url"
                placeholder="https://amazon.com/product/..."
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Extract Product Data'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Preview Panel */}
      <div>
        {extractedData ? (
          <ProductPreview productData={extractedData} extractedData={extractedData} />
        ) : (
          <Card className="shadow-lg h-96 flex items-center justify-center dark:bg-gray-800 dark:border-gray-700">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Link2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Preview will appear here</p>
              <p className="text-sm">Enter a product URL to get started</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
