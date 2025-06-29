
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: string;
  category: string;
  categories?: string[];
  metaTags?: string[];
  searchTerms?: string[];
  tags: string[];
  lastUpdated: string;
}

interface ProductSearchProps {
  products: Product[];
  onProductSelect?: (product: Product) => void;
  onSearchResults?: (results: Product[]) => void;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
  products,
  onProductSelect,
  onSearchResults
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get unique categories and tags
  const { categories, tags } = useMemo(() => {
    const categorySet = new Set<string>();
    const tagSet = new Set<string>();

    products.forEach(product => {
      if (product.category) categorySet.add(product.category);
      if (product.categories) product.categories.forEach(cat => categorySet.add(cat));
      if (product.tags) product.tags.forEach(tag => tagSet.add(tag));
      if (product.metaTags) product.metaTags.forEach(tag => tagSet.add(tag));
    });

    return {
      categories: Array.from(categorySet).sort(),
      tags: Array.from(tagSet).sort()
    };
  }, [products]);

  // Filter products based on search criteria
  const filteredProducts = useMemo(() => {
    let results = products;

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(product => {
        const searchableText = [
          product.title,
          product.category,
          ...(product.categories || []),
          ...(product.tags || []),
          ...(product.metaTags || []),
          ...(product.searchTerms || [])
        ].join(' ').toLowerCase();

        return searchableText.includes(query);
      });
    }

    // Category filter
    if (selectedCategory) {
      results = results.filter(product => 
        product.category === selectedCategory || 
        (product.categories && product.categories.includes(selectedCategory))
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      results = results.filter(product => {
        const productTags = [
          ...(product.tags || []),
          ...(product.metaTags || [])
        ];
        return selectedTags.some(tag => productTags.includes(tag));
      });
    }

    return results;
  }, [products, searchQuery, selectedCategory, selectedTags]);

  // Notify parent of search results
  React.useEffect(() => {
    if (onSearchResults) {
      onSearchResults(filteredProducts);
    }
  }, [filteredProducts, onSearchResults]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTags([]);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Search Products
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products, categories, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('')}
            >
              All Categories
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Tag Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Tags</label>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {tags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
                {selectedTags.includes(tag) && (
                  <X className="w-3 h-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        {/* Active Filters */}
        {(searchQuery || selectedCategory || selectedTags.length > 0) && (
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-sm text-gray-600">
              Found {filteredProducts.length} products
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4 mr-1" />
              Clear Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
