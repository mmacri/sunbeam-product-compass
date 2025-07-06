import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, Save, Database, DollarSign, Trash2, RotateCcw } from 'lucide-react';
import { Merge } from 'lucide-react';

interface ProductBrowserActionsProps {
  filteredProductsCount: number;
  selectedAsinsCount: number;
  activeDealsCount?: number;
  onSelectAllFiltered: () => void;
  onClearSelection: () => void;
  onInvertSelection: () => void;
  onDeleteSelected: () => void;
  onExportSelected: () => void;
  onSaveSelectedForUsers: () => void;
  onUpdateDatabase: () => void;
  onMergeProducts: () => void;
  onSyncDeals?: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSyncingDeals?: boolean;
}

export const ProductBrowserActions: React.FC<ProductBrowserActionsProps> = ({
  filteredProductsCount,
  selectedAsinsCount,
  activeDealsCount = 0,
  onSelectAllFiltered,
  onClearSelection,
  onInvertSelection,
  onDeleteSelected,
  onExportSelected,
  onSaveSelectedForUsers,
  onUpdateDatabase,
  onMergeProducts,
  onSyncDeals,
  onImport,
  isSyncingDeals = false
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={onSelectAllFiltered}
        variant="outline"
        size="sm"
        disabled={filteredProductsCount === 0}
      >
        Select All ({filteredProductsCount})
      </Button>
      <Button
        onClick={onClearSelection}
        variant="outline"
        size="sm"
        disabled={selectedAsinsCount === 0}
      >
        Clear Selection
      </Button>
      <Button
        onClick={onInvertSelection}
        variant="outline"
        size="sm"
        disabled={filteredProductsCount === 0}
        className="flex items-center gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Invert Selection
      </Button>
      <Button
        onClick={onDeleteSelected}
        variant="outline"
        size="sm"
        disabled={selectedAsinsCount === 0}
        className="flex items-center gap-2 text-destructive hover:text-destructive"
      >
        <Trash2 className="w-4 h-4" />
        Delete Selected ({selectedAsinsCount})
      </Button>
      <Button
        onClick={onExportSelected}
        variant="outline"
        size="sm"
        disabled={selectedAsinsCount === 0}
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Export Selected ({selectedAsinsCount})
      </Button>
      <Button
        onClick={onSaveSelectedForUsers}
        size="sm"
        className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
        disabled={selectedAsinsCount === 0}
      >
        <Save className="w-4 h-4 mr-2" />
        Save for Users ({selectedAsinsCount})
      </Button>
      <Button
        onClick={onUpdateDatabase}
        size="sm"
        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        disabled={selectedAsinsCount === 0}
      >
        <Database className="w-4 h-4 mr-2" />
        Update Database ({selectedAsinsCount})
      </Button>
      <Button
        onClick={onMergeProducts}
        size="sm"
        className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
      >
        <Merge className="w-4 h-4 mr-2" />
        Merge Duplicates
      </Button>
      
      {onSyncDeals && (
        <Button
          onClick={onSyncDeals}
          size="sm"
          disabled={isSyncingDeals}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
        >
          <DollarSign className={`w-4 h-4 mr-2 ${isSyncingDeals ? 'animate-pulse' : ''}`} />
          {isSyncingDeals ? 'Syncing...' : `Sync Deals (${activeDealsCount})`}
        </Button>
      )}
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={onImport}
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
  );
};