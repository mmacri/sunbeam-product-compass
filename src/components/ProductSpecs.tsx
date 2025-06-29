
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';

interface ProductSpecsProps {
  specs: Record<string, string>;
}

export const ProductSpecs = ({ specs }: ProductSpecsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Zap className="w-5 h-5 text-orange-500" />
          <span>Technical Specifications</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(specs).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <span className="font-medium text-gray-700">{key}</span>
              <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">
                {value}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
