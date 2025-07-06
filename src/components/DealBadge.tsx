import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Zap, Clock } from 'lucide-react';

interface Deal {
  id: string;
  discount_percentage: number | null;
  deal_price: number | null;
  original_price: number | null;
  deal_type: string | null;
  deal_end_date: string | null;
  is_active: boolean;
}

interface DealBadgeProps {
  deal?: Deal | null;
  className?: string;
}

export const DealBadge: React.FC<DealBadgeProps> = ({ deal, className = '' }) => {
  if (!deal || !deal.is_active) {
    return null;
  }

  const discountPercentage = deal.discount_percentage;
  const savings = deal.original_price && deal.deal_price 
    ? deal.original_price - deal.deal_price 
    : null;

  const isExpiringSoon = deal.deal_end_date 
    ? new Date(deal.deal_end_date).getTime() - Date.now() < 24 * 60 * 60 * 1000 // 24 hours
    : false;

  const dealTypeDisplay = deal.deal_type 
    ? deal.deal_type.replace(/[_-]/g, ' ').toUpperCase()
    : 'DEAL';

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {/* Main Deal Badge */}
      <Badge 
        variant="destructive" 
        className="flex items-center gap-1 animate-pulse"
      >
        <Zap className="w-3 h-3" />
        {discountPercentage ? `${Math.round(discountPercentage)}% OFF` : dealTypeDisplay}
      </Badge>

      {/* Savings Amount */}
      {savings && savings > 0 && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <DollarSign className="w-3 h-3" />
          Save ${savings.toFixed(2)}
        </Badge>
      )}

      {/* Expiring Soon Warning */}
      {isExpiringSoon && (
        <Badge variant="outline" className="flex items-center gap-1 text-orange-600">
          <Clock className="w-3 h-3" />
          Ends Soon
        </Badge>
      )}
    </div>
  );
};