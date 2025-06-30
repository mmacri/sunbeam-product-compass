
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, RefreshCw, Search } from 'lucide-react';

interface ProductBrowserHeaderProps {
  onLoadFromRapidApi: () => void;
  onSearchProducts: (query: string) => void;
  isLoadingRapidApi: boolean;
  isSearching: boolean;
  productCount: number;
}

export const ProductBrowserHeader: React.FC<ProductBrowserHeaderProps> = ({
  onLoadFromRapidApi,
  onSearchProducts,
  isLoadingRapidApi,
  isSearching,
  productCount
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearchProducts(searchQuery.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Load Products from RapidAPI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={onLoadFromRapidApi}
            disabled={isLoadingRapidApi || isSearching}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingRapidApi ? 'animate-spin' : ''}`} />
            {isLoadingRapidApi ? 'Loading...' : 'Load Best Sellers'}
          </Button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Current products: {productCount}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for products (e.g., 'wireless headphones', 'kitchen appliances')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
              disabled={isSearching || isLoadingRapidApi}
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={!searchQuery.trim() || isSearching || isLoadingRapidApi}
            className="flex items-center gap-2"
          >
            <Search className={`w-4 h-4 ${isSearching ? 'animate-spin' : ''}`} />
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
