
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, Eye, Edit, Trash2 } from 'lucide-react';
import { mockProducts } from '@/utils/mockData';

interface AdminDashboardProps {
  onViewProduct: (productId: string) => void;
  onEditProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
}

export const AdminDashboard = ({ onViewProduct, onEditProduct, onDeleteProduct }: AdminDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredAndSortedProducts = useMemo(() => {
    let products = [...mockProducts];

    // Filter by search term
    if (searchTerm) {
      products = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (filterCategory !== 'all') {
      products = products.filter(product => product.category === filterCategory);
    }

    // Sort products
    products.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'price':
          return parseFloat(a.currentPrice.replace('$', '')) - parseFloat(b.currentPrice.replace('$', ''));
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });

    return products;
  }, [searchTerm, sortBy, filterCategory]);

  const categories = [...new Set(mockProducts.map(p => p.category))];

  const exportData = (format: 'csv' | 'json') => {
    const data = filteredAndSortedProducts.map(product => ({
      title: product.title,
      price: product.currentPrice,
      rating: product.rating,
      reviews: product.reviews,
      category: product.category,
      lastUpdated: new Date().toISOString()
    }));

    if (format === 'csv') {
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row => Object.values(row).join(','));
      const csv = [headers, ...rows].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sunbeam-products.csv';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sunbeam-products.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-gray-100">Product Management Dashboard</CardTitle>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2 flex-1 min-w-64">
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </div>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 dark:bg-gray-700 dark:border-gray-600">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="reviews">Reviews</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40 dark:bg-gray-700 dark:border-gray-600">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={() => exportData('csv')} variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300">
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          
          <Button onClick={() => exportData('json')} variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300">
            <Download className="w-4 h-4 mr-2" />
            JSON
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredAndSortedProducts.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 dark:border-gray-600 dark:bg-gray-750">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg dark:text-gray-100">{product.title}</h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="secondary" className="dark:bg-gray-600 dark:text-gray-200">
                      {product.currentPrice}
                    </Badge>
                    <Badge variant="outline" className="dark:border-gray-500 dark:text-gray-300">
                      ⭐ {product.rating}
                    </Badge>
                    <Badge variant="outline" className="dark:border-gray-500 dark:text-gray-300">
                      {product.reviews} reviews
                    </Badge>
                    <Badge className="dark:bg-blue-600">{product.category}</Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewProduct(product.id.toString())}
                    className="dark:border-gray-600 dark:text-gray-300"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEditProduct(product.id.toString())}
                    className="dark:border-gray-600 dark:text-gray-300"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDeleteProduct(product.id.toString())}
                    className="dark:border-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No products found matching your criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
