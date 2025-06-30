import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, Upload, Columns, Save } from 'lucide-react';
import { ExcelService } from '@/services/excelService';
import { RapidApiProduct } from '@/types/rapidApi';
import { ProductSelectionService } from '@/services/productSelection';
import { ColumnSelector } from './ColumnSelector';

interface ProductBrowserProps {
  onShowMessage: (message: string, type?: 'success' | 'error') => void;
  onLogAction: (action: string, details: any) => void;
}

export const ProductBrowser: React.FC<ProductBrowserProps> = ({
  onShowMessage,
  onLogAction
}) => {
  const [products, setProducts] = useState<RapidApiProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating-desc');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedAsins, setSelectedAsins] = useState<string[]>([]);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  useEffect(() => {
    loadProducts();
    loadSelectedAsins();
  }, []);

  useEffect(() => {
    const savedColumns = localStorage.getItem('sunbeam-selected-columns');
    if (savedColumns) {
      setSelectedColumns(JSON.parse(savedColumns));
    }
  }, []);

  const loadProducts = () => {
    const storedProducts = localStorage.getItem('sunbeam-products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  };

  const loadSelectedAsins = () => {
    const selected = ProductSelectionService.getSelectedAsins();
    setSelectedAsins(selected);
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.product_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.product_byline && product.product_byline.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => {
        switch (categoryFilter) {
          case 'best-sellers':
            return product.is_best_seller;
          case 'amazon-choice':
            return product.is_amazon_choice;
          case 'prime':
            return product.is_prime;
          case 'eco-friendly':
            return product.climate_pledge_friendly;
          default:
            return true;
        }
      });
    }

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => parseFloat(a.product_price.replace(/[^0-9.]/g, '')) - parseFloat(b.product_price.replace(/[^0-9.]/g, '')));
        break;
      case 'price-desc':
        filtered.sort((a, b) => parseFloat(b.product_price.replace(/[^0-9.]/g, '')) - parseFloat(a.product_price.replace(/[^0-9.]/g, '')));
        break;
      case 'rating-desc':
        filtered.sort((a, b) => parseFloat(b.product_star_rating || '0') - parseFloat(a.product_star_rating || '0'));
        break;
      case 'rating-asc':
        filtered.sort((a, b) => parseFloat(a.product_star_rating || '0') - parseFloat(b.product_star_rating || '0'));
        break;
      case 'reviews-desc':
        filtered.sort((a, b) => (b.product_num_ratings || 0) - (a.product_num_ratings || 0));
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.product_title.localeCompare(b.product_title));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, searchTerm, sortBy, categoryFilter]);

  const handleColumnSave = (columns: string[]) => {
    setSelectedColumns(columns);
    setShowColumnSelector(false);
    onShowMessage('Column selection saved successfully');
  };

  const exportSelectedProducts = () => {
    const selectedProducts = products.filter(p => selectedAsins.includes(p.asin));
    if (selectedProducts.length === 0) {
      onShowMessage('No products selected for export', 'error');
      return;
    }

    // Filter products based on selected columns
    const filteredProducts = selectedProducts.map(product => {
      const filtered: any = {};
      selectedColumns.forEach(column => {
        if (product.hasOwnProperty(column)) {
          filtered[column] = (product as any)[column];
        }
      });
      return filtered;
    });

    ExcelService.exportToExcel(filteredProducts.length > 0 ? filteredProducts : selectedProducts, selectedColumns);
    onShowMessage(`Exported ${selectedProducts.length} products to Excel`);
    onLogAction('export_products', { count: selectedProducts.length, columns: selectedColumns });
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      onShowMessage('No file selected', 'error');
      return;
    }

    try {
      const importedProducts = await ExcelService.importFromExcel(file);
      setProducts(importedProducts);
      localStorage.setItem('sunbeam-products', JSON.stringify(importedProducts));
      onShowMessage(`Imported ${importedProducts.length} products`);
      onLogAction('import_products', { count: importedProducts.length });
    } catch (error) {
      onShowMessage(`Import failed: ${error.message}`, 'error');
    }
  };

  const toggleSelection = (asin: string) => {
    ProductSelectionService.toggleProduct(asin);
    setSelectedAsins(ProductSelectionService.getSelectedAsins());
  };

  const isSelected = (asin: string): boolean => {
    return selectedAsins.includes(asin);
  };

  const selectAllFiltered = () => {
    const asins = filteredProducts.map(p => p.asin);
    ProductSelectionService.selectAll(asins);
    setSelectedAsins(ProductSelectionService.getSelectedAsins());
    onShowMessage(`Selected all ${filteredProducts.length} filtered products`);
    onLogAction('select_all_filtered', { count: filteredProducts.length });
  };

  const clearSelection = () => {
    ProductSelectionService.clearAll();
    setSelectedAsins([]);
    onShowMessage('Cleared all selections');
    onLogAction('clear_selection', {});
  };

  const saveSelectedForUsers = () => {
    const selectedProducts = products.filter(p => selectedAsins.includes(p.asin));
    localStorage.setItem('sunbeam-selected-rapidapi-products', JSON.stringify(selectedProducts));
    onShowMessage(`Saved ${selectedProducts.length} selected products for users`);
    onLogAction('save_selected_for_users', { count: selectedProducts.length });
  };

  return (
    <div className="space-y-6">
      {/* Search and Controls */}
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
              <ColumnSelector onSave={handleColumnSave} />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={selectAllFiltered}
              variant="outline"
              size="sm"
              disabled={filteredProducts.length === 0}
            >
              Select All ({filteredProducts.length})
            </Button>
            <Button
              onClick={clearSelection}
              variant="outline"
              size="sm"
              disabled={selectedAsins.length === 0}
            >
              Clear Selection
            </Button>
            <Button
              onClick={exportSelectedProducts}
              variant="outline"
              size="sm"
              disabled={selectedAsins.length === 0}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Selected ({selectedAsins.length})
            </Button>
            <Button
              onClick={saveSelectedForUsers}
              size="sm"
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
              disabled={selectedAsins.length === 0}
            >
              <Save className="w-4 h-4 mr-2" />
              Save for Users ({selectedAsins.length})
            </Button>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleImport}
                className="hidden"
                id="import-file"
              />
              <Button
                onClick={() => document.getElementById('import-file')?.click()}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Import Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.asin} className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-4">
              <div className="flex items-start">
                <div className="mr-4">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded text-orange-500 focus:ring-orange-500"
                    checked={isSelected(product.asin)}
                    onChange={() => toggleSelection(product.asin)}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{product.product_title}</h3>
                  <p className="text-gray-600">{product.product_price}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
