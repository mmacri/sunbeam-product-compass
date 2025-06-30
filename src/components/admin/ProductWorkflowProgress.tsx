
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Loader2 } from 'lucide-react';

interface ProductWorkflowProgressProps {
  currentStep: 'input' | 'processing' | 'preview' | 'save';
}

export const ProductWorkflowProgress: React.FC<ProductWorkflowProgressProps> = ({
  currentStep
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-2">
        <span>Add New Product</span>
        <Badge variant="outline">
          Step {currentStep === 'input' ? '1' : currentStep === 'processing' ? '2' : currentStep === 'preview' ? '3' : '4'} of 4
        </Badge>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className={`flex items-center space-x-2 ${currentStep !== 'input' ? 'text-green-600' : 'text-blue-600'}`}>
          {currentStep !== 'input' ? <CheckCircle className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border-2 border-current" />}
          <span className="text-sm font-medium">Enter URL</span>
        </div>
        <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700">
          <div className={`h-full bg-blue-500 transition-all duration-300 ${currentStep === 'input' ? 'w-0' : 'w-full'}`} />
        </div>
        <div className={`flex items-center space-x-2 ${currentStep === 'processing' ? 'text-blue-600' : currentStep === 'preview' || currentStep === 'save' ? 'text-green-600' : 'text-gray-400'}`}>
          {currentStep === 'processing' ? <Loader2 className="w-5 h-5 animate-spin" /> : 
           currentStep === 'preview' || currentStep === 'save' ? <CheckCircle className="w-5 h-5" /> : 
           <div className="w-5 h-5 rounded-full border-2 border-current" />}
          <span className="text-sm font-medium">Extract Data</span>
        </div>
        <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700">
          <div className={`h-full bg-blue-500 transition-all duration-300 ${currentStep === 'input' || currentStep === 'processing' ? 'w-0' : 'w-full'}`} />
        </div>
        <div className={`flex items-center space-x-2 ${currentStep === 'save' ? 'text-green-600' : currentStep === 'preview' ? 'text-blue-600' : 'text-gray-400'}`}>
          {currentStep === 'save' ? <CheckCircle className="w-5 h-5" /> : 
           <div className="w-5 h-5 rounded-full border-2 border-current" />}
          <span className="text-sm font-medium">Configure & Save</span>
        </div>
      </div>
    </div>
  );
};
