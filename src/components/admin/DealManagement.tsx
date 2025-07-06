import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDeals } from '@/hooks/useDeals';
import { DealBadge } from '@/components/DealBadge';
import { 
  DollarSign, 
  RefreshCw, 
  Search, 
  Filter, 
  TrendingDown, 
  Clock,
  Zap,
  ExternalLink
} from 'lucide-react';

interface DealManagementProps {
  onShowMessage: (message: string, type?: 'success' | 'error') => void;
}

export const DealManagement: React.FC<DealManagementProps> = ({ onShowMessage }) => {
  const { deals, loading, syncing, error, syncDeals, fetchActiveDeals } = useDeals();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('discount_percentage');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchActiveDeals();
  }, []);

  const handleSyncDeals = async () => {
    try {
      const result = await syncDeals();
      if (result.success) {
        onShowMessage(`Deal sync completed: ${result.dealsProcessed} processed, ${result.dealsAdded} added, ${result.dealsUpdated} updated`);
      } else {
        onShowMessage(`Deal sync failed: ${result.error}`, 'error');
      }
    } catch (err) {
      onShowMessage('Failed to sync deals', 'error');
    }
  };

  // Filter and sort deals
  const filteredDeals = deals
    .filter(deal => {
      if (!deal.is_active) return false;
      
      const matchesSearch = !searchTerm || 
        deal.deal_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.asin.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || 
        deal.deal_type === filterType;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'discount_percentage':
          return (b.discount_percentage || 0) - (a.discount_percentage || 0);
        case 'deal_price':
          return (a.deal_price || 0) - (b.deal_price || 0);
        case 'savings':
          const savingsA = (a.original_price || 0) - (a.deal_price || 0);
          const savingsB = (b.original_price || 0) - (b.deal_price || 0);
          return savingsB - savingsA;
        case 'end_date':
          return new Date(a.deal_end_date || '').getTime() - new Date(b.deal_end_date || '').getTime();
        default:
          return 0;
      }
    });

  // Deal statistics
  const stats = {
    totalDeals: deals.filter(d => d.is_active).length,
    avgDiscount: deals.reduce((acc, deal) => acc + (deal.discount_percentage || 0), 0) / deals.length,
    totalSavings: deals.reduce((acc, deal) => {
      const savings = (deal.original_price || 0) - (deal.deal_price || 0);
      return acc + savings;
    }, 0),
    expiringSoon: deals.filter(deal => {
      if (!deal.deal_end_date) return false;
      const endDate = new Date(deal.deal_end_date);
      const now = new Date();
      const hoursLeft = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      return hoursLeft > 0 && hoursLeft <= 24;
    }).length
  };

  const dealTypes = [...new Set(deals.map(d => d.deal_type).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Deal Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Deals</p>
                <p className="text-2xl font-bold">{stats.totalDeals}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Discount</p>
                <p className="text-2xl font-bold">{stats.avgDiscount.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Savings</p>
                <p className="text-2xl font-bold">${stats.totalSavings.toFixed(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold">{stats.expiringSoon}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deal Management Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Deal Management
              <Badge variant="secondary">{filteredDeals.length} deals</Badge>
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={fetchActiveDeals} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button 
                onClick={handleSyncDeals} 
                disabled={syncing}
                size="sm"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <DollarSign className={`w-4 h-4 mr-2 ${syncing ? 'animate-pulse' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync Deals'}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search Deals</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title or ASIN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discount_percentage">Discount %</SelectItem>
                  <SelectItem value="deal_price">Price</SelectItem>
                  <SelectItem value="savings">Savings Amount</SelectItem>
                  <SelectItem value="end_date">End Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Deal Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {dealTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Deals List */}
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p>Loading deals...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <p>Error loading deals: {error}</p>
            </div>
          ) : filteredDeals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No active deals found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDeals.map((deal) => (
                <Card key={deal.id} className="border-2 hover:border-green-200 transition-colors">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Deal Badge */}
                      <DealBadge deal={deal} />
                      
                      {/* Deal Title */}
                      <h3 className="font-medium text-sm line-clamp-2">
                        {deal.deal_title || 'Deal Title Not Available'}
                      </h3>
                      
                      {/* ASIN */}
                      <p className="text-xs text-muted-foreground">
                        ASIN: {deal.asin}
                      </p>
                      
                      {/* Price Information */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-green-600">
                            ${deal.deal_price?.toFixed(2) || 'N/A'}
                          </p>
                          {deal.original_price && (
                            <p className="text-sm text-muted-foreground line-through">
                              ${deal.original_price.toFixed(2)}
                            </p>
                          )}
                        </div>
                        
                        {deal.discount_percentage && (
                          <Badge variant="destructive">
                            {Math.round(deal.discount_percentage)}% OFF
                          </Badge>
                        )}
                      </div>
                      
                      {/* Savings */}
                      {deal.original_price && deal.deal_price && (
                        <p className="text-sm text-green-600 font-medium">
                          Save ${(deal.original_price - deal.deal_price).toFixed(2)}
                        </p>
                      )}
                      
                      {/* Deal Type & End Date */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        {deal.deal_type && (
                          <Badge variant="outline">{deal.deal_type}</Badge>
                        )}
                        {deal.deal_end_date && (
                          <span>Ends: {new Date(deal.deal_end_date).toLocaleDateString()}</span>
                        )}
                      </div>
                      
                      {/* Action Button */}
                      {deal.deal_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => window.open(deal.deal_url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Deal
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};