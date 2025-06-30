
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface StaleDataWarningProps {
  show: boolean;
  onRefresh: () => void;
}

export const StaleDataWarning: React.FC<StaleDataWarningProps> = ({ show, onRefresh }) => {
  if (!show) return null;

  return (
    <div className="bg-yellow-100 dark:bg-yellow-900 border-b border-yellow-200 dark:border-yellow-800 px-6 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-yellow-800 dark:text-yellow-200">⚠️</span>
          <span className="text-yellow-800 dark:text-yellow-200 text-sm">
            Product data is over 24 hours old. Consider refreshing for latest information.
          </span>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onRefresh}
          className="border-yellow-300 text-yellow-800 hover:bg-yellow-200 dark:border-yellow-700 dark:text-yellow-200 dark:hover:bg-yellow-800"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>
    </div>
  );
};
