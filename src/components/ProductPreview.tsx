
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Eye } from 'lucide-react';

interface ProductPreviewProps {
  productData: {
    title: string;
    price: string;
    description: string;
    category: string;
    features: string;
    specs: Record<string, string>;
  };
  extractedData: any;
}

export const ProductPreview = ({ productData, extractedData }: ProductPreviewProps) => {
  const featuresArray = productData.features.split('\n').filter(f => f.trim());

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
        <CardTitle className="flex items-center space-x-2">
          <Eye className="w-5 h-5" />
          <span>Review Preview</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Title and Rating */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{productData.title}</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(extractedData.rating || 4) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-gray-600">{extractedData.rating}/5</span>
              <Badge variant="secondary">{productData.category}</Badge>
            </div>
          </div>

          {/* Price */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-3xl font-bold text-green-700">{productData.price}</div>
            <p className="text-sm text-green-600">Current best price</p>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600">{productData.description}</p>
          </div>

          {/* Features */}
          {featuresArray.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Key Features</h3>
              <ul className="space-y-1">
                {featuresArray.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specs Preview */}
          {Object.keys(productData.specs).length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Specifications</h3>
              <div className="space-y-2">
                {Object.entries(productData.specs).slice(0, 3).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-600">{key}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
