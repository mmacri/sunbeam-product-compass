
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Columns } from 'lucide-react';
import { ColumnSelector } from './ColumnSelector';

interface ProductBrowserControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  showColumnSelector: boolean;
  setShowColumnSelector: (show: boolean) => void;
  onColumnSave: (columns: string[]) => void;
}

export const ProductBrowserControls: React.FC<ProductBrowserControlsProps> = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  categoryFilter,
  setCategoryFilter,
  showColumnSelector,
  setShowColumnSelector,
  onColumnSave
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Product Browser
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating-desc">Highest Rated</SelectItem>
              <SelectItem value="rating-asc">Lowest Rated</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="reviews-desc">Most Reviews</SelectItem>
              <SelectItem value="alphabetical">A-Z</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="best-sellers">Best Sellers</SelectItem>
              <SelectItem value="amazon-choice">Amazon's Choice</SelectItem>
              <SelectItem value="prime">Prime Eligible</SelectItem>
              <SelectItem value="eco-friendly">Eco-Friendly</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => setShowColumnSelector(!showColumnSelector)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Columns className="w-4 h-4" />
            Columns
          </Button>
        </div>

        {showColumnSelector && (
          <div className="mb-4">
            <ColumnSelector onSave={onColumnSave} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
