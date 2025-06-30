
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';

interface ProductBrowserHeaderProps {
  onLoadFromRapidApi: () => void;
  isLoadingRapidApi: boolean;
  productCount: number;
}

export const ProductBrowserHeader: React.FC<ProductBrowserHeaderProps> = ({
  onLoadFromRapidApi,
  isLoadingRapidApi,
  productCount
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Load Products from RapidAPI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Button
            onClick={onLoadFromRapidApi}
            disabled={isLoadingRapidApi}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingRapidApi ? 'animate-spin' : ''}`} />
            {isLoadingRapidApi ? 'Loading...' : 'Load Products from API'}
          </Button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Current products: {productCount}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
