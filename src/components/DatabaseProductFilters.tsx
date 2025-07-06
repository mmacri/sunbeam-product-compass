import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Search, SlidersHorizontal, Filter, Package, TrendingUp, Calendar, Target } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface DatabaseProductFiltersProps {
  // Basic filters
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  
  // Enhanced filters
  categories: Category[];
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  stockStatusFilter: string;
  setStockStatusFilter: (status: string) => void;
  dealStatusFilter: string;
  setDealStatusFilter: (status: string) => void;
  apiSourceFilter: string;
  setApiSourceFilter: (source: string) => void;
  priceStatusFilter: string;
  setPriceStatusFilter: (status: string) => void;
  recentUpdatesFilter: string;
  setRecentUpdatesFilter: (period: string) => void;
  commissionRange: [number, number];
  setCommissionRange: (range: [number, number]) => void;
  performanceFilter: string;
  setPerformanceFilter: (performance: string) => void;
  
  // Counts
  totalProducts: number;
  filteredCount: number;
}

export const DatabaseProductFilters: React.FC<DatabaseProductFiltersProps> = ({
  // Basic filters
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  
  // Enhanced filters
  categories,
  categoryFilter,
  setCategoryFilter,
  stockStatusFilter,
  setStockStatusFilter,
  dealStatusFilter,
  setDealStatusFilter,
  apiSourceFilter,
  setApiSourceFilter,
  priceStatusFilter,
  setPriceStatusFilter,
  recentUpdatesFilter,
  setRecentUpdatesFilter,
  commissionRange,
  setCommissionRange,
  performanceFilter,
  setPerformanceFilter,
  
  // Counts
  totalProducts,
  filteredCount
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" />
          Enhanced Product Filters
          <span className="text-sm font-normal text-muted-foreground ml-auto">
            Showing {filteredCount} of {totalProducts} products
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Basic Search and Sort */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 text-primary" />
            <span className="font-medium">Search & Sort</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Enhanced Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search Products</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, description, or ASIN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Enhanced Sort */}
            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                  <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                  <SelectItem value="rating-desc">Rating (High to Low)</SelectItem>
                  <SelectItem value="rating-asc">Rating (Low to High)</SelectItem>
                  <SelectItem value="created-desc">Newest First</SelectItem>
                  <SelectItem value="created-asc">Oldest First</SelectItem>
                  <SelectItem value="updated-desc">Recently Updated</SelectItem>
                  <SelectItem value="clicks-desc">Most Clicks</SelectItem>
                  <SelectItem value="conversions-desc">Most Conversions</SelectItem>
                  <SelectItem value="revenue-desc">Top Revenue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Status Filters */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-4 h-4 text-primary" />
            <span className="font-medium">Product Status</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stock Status */}
            <div className="space-y-2">
              <Label>Stock Status</Label>
              <Select value={stockStatusFilter} onValueChange={setStockStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="in-stock">In Stock Only</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Deal Status */}
            <div className="space-y-2">
              <Label>Deal Status</Label>
              <Select value={dealStatusFilter} onValueChange={setDealStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="deals-only">Active Deals Only</SelectItem>
                  <SelectItem value="no-deals">No Deals</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* API Source */}
            <div className="space-y-2">
              <Label>Source</Label>
              <Select value={apiSourceFilter} onValueChange={setApiSourceFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="rapidapi">RapidAPI</SelectItem>
                  <SelectItem value="manual">Manual Entry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Status */}
            <div className="space-y-2">
              <Label>Price Status</Label>
              <Select value={priceStatusFilter} onValueChange={setPriceStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="on-sale">On Sale</SelectItem>
                  <SelectItem value="regular">Regular Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Performance Filters */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="font-medium">Performance & Analytics</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Performance Filter */}
            <div className="space-y-2">
              <Label>Performance</Label>
              <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Performance</SelectItem>
                  <SelectItem value="high-traffic">High Traffic (100+ clicks)</SelectItem>
                  <SelectItem value="high-converting">High Converting (10+ conversions)</SelectItem>
                  <SelectItem value="top-revenue">Top Revenue ($500+)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Recent Updates */}
            <div className="space-y-2">
              <Label>Recent Updates</Label>
              <Select value={recentUpdatesFilter} onValueChange={setRecentUpdatesFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Commission Range */}
            <div className="space-y-2">
              <Label>Commission Rate: {commissionRange[0]}% - {commissionRange[1]}%</Label>
              <Slider
                value={commissionRange}
                onValueChange={(value) => setCommissionRange(value as [number, number])}
                max={50}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Price and Rating Filters */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-primary" />
            <span className="font-medium">Price & Quality</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price Range */}
            <div className="space-y-2">
              <Label>Price Range: ${priceRange[0]} - ${priceRange[1]}</Label>
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                max={1000}
                min={0}
                step={10}
                className="w-full"
              />
            </div>

            {/* Minimum Rating */}
            <div className="space-y-2">
              <Label>Minimum Rating: {minRating > 0 ? `${minRating}+ stars` : 'Any'}</Label>
              <Slider
                value={[minRating]}
                onValueChange={(value) => setMinRating(value[0])}
                max={5}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};