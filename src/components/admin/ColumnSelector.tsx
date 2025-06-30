
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Columns, Save } from 'lucide-react';

interface ColumnSelectorProps {
  onSave: (selectedColumns: string[]) => void;
}

const availableColumns = [
  { key: 'asin', label: 'ASIN', required: true },
  { key: 'product_title', label: 'Title', required: true },
  { key: 'product_price', label: 'Price', required: true },
  { key: 'product_original_price', label: 'Original Price' },
  { key: 'unit_price', label: 'Unit Price' },
  { key: 'unit_count', label: 'Unit Count' },
  { key: 'currency', label: 'Currency' },
  { key: 'product_star_rating', label: 'Star Rating' },
  { key: 'product_num_ratings', label: 'Number of Ratings' },
  { key: 'sales_volume', label: 'Sales Volume' },
  { key: 'product_url', label: 'URL', required: true },
  { key: 'product_photo', label: 'Photo URL' },
  { key: 'product_num_offers', label: 'Number of Offers' },
  { key: 'product_minimum_offer_price', label: 'Minimum Offer Price' },
  { key: 'is_best_seller', label: 'Is Best Seller' },
  { key: 'is_amazon_choice', label: 'Is Amazon Choice' },
  { key: 'is_prime', label: 'Is Prime' },
  { key: 'climate_pledge_friendly', label: 'Climate Pledge Friendly' },
  { key: 'has_variations', label: 'Has Variations' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'product_byline', label: 'Byline' },
  { key: 'coupon_text', label: 'Coupon Text' },
  { key: 'product_badge', label: 'Product Badge' },
  { key: 'product_availability', label: 'Availability' }
];

export const ColumnSelector: React.FC<ColumnSelectorProps> = ({ onSave }) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(() => {
    const saved = localStorage.getItem('sunbeam-selected-columns');
    return saved ? JSON.parse(saved) : availableColumns.map(col => col.key);
  });

  const handleColumnToggle = (columnKey: string) => {
    const column = availableColumns.find(col => col.key === columnKey);
    if (column?.required) return; // Can't unselect required columns
    
    setSelectedColumns(prev => 
      prev.includes(columnKey)
        ? prev.filter(key => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  const handleSave = () => {
    localStorage.setItem('sunbeam-selected-columns', JSON.stringify(selectedColumns));
    onSave(selectedColumns);
  };

  const selectAll = () => {
    setSelectedColumns(availableColumns.map(col => col.key));
  };

  const selectEssentials = () => {
    const essentials = ['asin', 'product_title', 'product_price', 'product_star_rating', 'product_num_ratings', 'product_url', 'product_photo'];
    setSelectedColumns(essentials);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Columns className="w-5 h-5" />
          Column Selection
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose which product fields to include in exports and displays
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={selectAll}>
            Select All
          </Button>
          <Button size="sm" variant="outline" onClick={selectEssentials}>
            Essentials Only
          </Button>
          <Badge variant="secondary">
            {selectedColumns.length} of {availableColumns.length} selected
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
          {availableColumns.map((column) => (
            <div key={column.key} className="flex items-center space-x-2">
              <Checkbox
                id={column.key}
                checked={selectedColumns.includes(column.key)}
                onCheckedChange={() => handleColumnToggle(column.key)}
                disabled={column.required}
              />
              <label
                htmlFor={column.key}
                className={`text-sm cursor-pointer ${
                  column.required ? 'font-medium text-blue-600 dark:text-blue-400' : ''
                }`}
              >
                {column.label}
                {column.required && <span className="text-xs ml-1">(required)</span>}
              </label>
            </div>
          ))}
        </div>

        <Button onClick={handleSave} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Save Column Selection
        </Button>
      </CardContent>
    </Card>
  );
};
