
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link2 } from 'lucide-react';

interface ProductUrlInputProps {
  productUrl: string;
  onUrlChange: (url: string) => void;
  onProcess: () => void;
}

export const ProductUrlInput: React.FC<ProductUrlInputProps> = ({
  productUrl,
  onUrlChange,
  onProcess
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="product-url">Product URL</Label>
        <div className="flex space-x-2">
          <Input
            id="product-url"
            placeholder="https://amazon.com/product/..."
            value={productUrl}
            onChange={(e) => onUrlChange(e.target.value)}
            className="flex-1"
          />
          <Button onClick={onProcess} disabled={!productUrl.trim()}>
            <Link2 className="w-4 h-4 mr-2" />
            Extract
          </Button>
        </div>
      </div>
    </div>
  );
};
