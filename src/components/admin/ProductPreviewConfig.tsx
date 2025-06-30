
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, ExternalLink, Plus } from 'lucide-react';

interface ProductSettings {
  threshold: number;
  tags: string;
}

interface ProductPreviewConfigProps {
  extractedData: any;
  productUrl: string;
  productSettings: ProductSettings;
  onSettingsChange: (settings: ProductSettings) => void;
  onSave: () => void;
  onReset: () => void;
}

export const ProductPreviewConfig: React.FC<ProductPreviewConfigProps> = ({
  extractedData,
  productUrl,
  productSettings,
  onSettingsChange,
  onSave,
  onReset
}) => {
  return (
    <div className="space-y-4">
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Product data extracted successfully! Review the details below and configure your settings.
        </AlertDescription>
      </Alert>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Extracted Product Data</h3>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
            <p><strong>Title:</strong> {extractedData.title}</p>
            <p><strong>Price:</strong> {extractedData.currentPrice}</p>
            <p><strong>Rating:</strong> {extractedData.rating}/5</p>
            <p><strong>Category:</strong> {extractedData.category}</p>
            <a 
              href={productUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:underline text-sm"
            >
              View Product <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-semibold">Product Settings</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="threshold">Price Alert Threshold ($)</Label>
              <Input
                id="threshold"
                type="number"
                placeholder="50"
                value={productSettings.threshold}
                onChange={(e) => onSettingsChange({...productSettings, threshold: Number(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                placeholder="electronics, wireless, headphones"
                value={productSettings.tags}
                onChange={(e) => onSettingsChange({...productSettings, tags: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onReset}>
          Start Over
        </Button>
        <Button onClick={onSave} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>
    </div>
  );
};
