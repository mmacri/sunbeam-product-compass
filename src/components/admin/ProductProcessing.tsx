
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface ProductProcessingProps {
  progress: number;
}

export const ProductProcessing: React.FC<ProductProcessingProps> = ({
  progress
}) => {
  return (
    <div className="space-y-4 text-center">
      <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
      <p className="text-sm text-gray-600 dark:text-gray-400">Extracting product data...</p>
      <Progress value={progress} className="w-full" />
    </div>
  );
};
