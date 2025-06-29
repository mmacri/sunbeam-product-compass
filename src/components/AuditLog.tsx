
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, User, Clock, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  type: 'create' | 'update' | 'delete' | 'export' | 'login';
}

export const AuditLog = () => {
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    // Load audit log from localStorage (in real app, this would be from API)
    const savedLog = localStorage.getItem('sunbeam-audit-log');
    if (savedLog) {
      setAuditEntries(JSON.parse(savedLog));
    } else {
      // Initialize with some sample entries
      const sampleEntries: AuditEntry[] = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          user: 'admin@sunbeam.com',
          action: 'Product Created',
          details: 'Added new product: Theragun Pro 5',
          type: 'create'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          user: 'admin@sunbeam.com',
          action: 'Template Updated',
          details: 'Modified blog template for product reviews',
          type: 'update'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          user: 'admin@sunbeam.com',
          action: 'Report Exported',
          details: 'Generated CSV report for all products',
          type: 'export'
        }
      ];
      setAuditEntries(sampleEntries);
      localStorage.setItem('sunbeam-audit-log', JSON.stringify(sampleEntries));
    }
  }, []);

  const addAuditEntry = (action: string, details: string, type: AuditEntry['type']) => {
    const newEntry: AuditEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      user: 'admin@sunbeam.com', // In real app, get from auth context
      action,
      details,
      type
    };

    const updatedEntries = [newEntry, ...auditEntries];
    setAuditEntries(updatedEntries);
    localStorage.setItem('sunbeam-audit-log', JSON.stringify(updatedEntries));
  };

  // Expose function globally for other components to use
  React.useEffect(() => {
    (window as any).addAuditEntry = addAuditEntry;
  }, [auditEntries]);

  const filteredEntries = filterType === 'all' 
    ? auditEntries 
    : auditEntries.filter(entry => entry.type === filterType);

  const getActionIcon = (type: AuditEntry['type']) => {
    switch (type) {
      case 'create': return '✅';
      case 'update': return '✏️';
      case 'delete': return '🗑️';
      case 'export': return '📊';
      case 'login': return '🔐';
      default: return '📝';
    }
  };

  const getActionColor = (type: AuditEntry['type']) => {
    switch (type) {
      case 'create': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'update': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'delete': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'export': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'login': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between dark:text-gray-100">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Audit Log</span>
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40 dark:bg-gray-700 dark:border-gray-600">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="create">Created</SelectItem>
              <SelectItem value="update">Updated</SelectItem>
              <SelectItem value="delete">Deleted</SelectItem>
              <SelectItem value="export">Exported</SelectItem>
              <SelectItem value="login">Login</SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="flex items-start space-x-4 p-3 border rounded-lg dark:border-gray-600">
                <div className="text-2xl">{getActionIcon(entry.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium dark:text-gray-100">{entry.action}</h4>
                    <Badge className={getActionColor(entry.type)}>
                      {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{entry.details}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{entry.user}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(entry.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredEntries.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No audit entries found for the selected filter.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
