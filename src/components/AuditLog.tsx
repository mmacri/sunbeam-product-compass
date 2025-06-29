
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Download, Trash2, Eye, Edit } from 'lucide-react';

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  type: 'create' | 'update' | 'delete' | 'view';
}

export const AuditLog = () => {
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);

  useEffect(() => {
    // Load existing audit entries from localStorage
    const saved = localStorage.getItem('sunbeam-audit-log');
    if (saved) {
      try {
        setAuditEntries(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse audit log:', error);
      }
    }

    // Set up global function for adding audit entries
    (window as any).addAuditEntry = (action: string, details: string, type: AuditEntry['type']) => {
      const newEntry: AuditEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        action,
        details,
        type
      };

      setAuditEntries(prev => {
        const updated = [newEntry, ...prev].slice(0, 100); // Keep only last 100 entries
        localStorage.setItem('sunbeam-audit-log', JSON.stringify(updated));
        return updated;
      });
    };

    // Add initial entry
    if (auditEntries.length === 0) {
      (window as any).addAuditEntry('System Started', 'Audit logging initialized', 'create');
    }
  }, []);

  const getActionIcon = (type: AuditEntry['type']) => {
    switch (type) {
      case 'create': return <span className="text-green-500">➕</span>;
      case 'update': return <Edit className="w-4 h-4 text-blue-500" />;
      case 'delete': return <Trash2 className="w-4 h-4 text-red-500" />;
      case 'view': return <Eye className="w-4 h-4 text-gray-500" />;
      default: return <span>📝</span>;
    }
  };

  const getTypeColor = (type: AuditEntry['type']) => {
    switch (type) {
      case 'create': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300';
      case 'update': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300';
      case 'delete': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300';
      case 'view': return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const exportAuditLog = () => {
    const logData = {
      exported: new Date().toISOString(),
      totalEntries: auditEntries.length,
      entries: auditEntries
    };

    const json = JSON.stringify(logData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sunbeam-audit-log-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAuditLog = () => {
    if (confirm('Are you sure you want to clear the audit log? This action cannot be undone.')) {
      setAuditEntries([]);
      localStorage.removeItem('sunbeam-audit-log');
      
      // Add clear action to new log
      setTimeout(() => {
        (window as any).addAuditEntry('Audit Log Cleared', 'All previous audit entries were removed', 'delete');
      }, 100);
    }
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
            <FileText className="w-5 h-5 text-indigo-500" />
            <span>Audit Log</span>
            <Badge variant="secondary" className="dark:bg-gray-600 dark:text-gray-200">
              {auditEntries.length} entries
            </Badge>
          </CardTitle>
          <div className="flex space-x-2">
            <Button onClick={exportAuditLog} variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={clearAuditLog} variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {auditEntries.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No audit entries yet</p>
                <p className="text-sm">Actions will be logged here</p>
              </div>
            ) : (
              auditEntries.map((entry) => (
                <div key={entry.id} className="flex items-start space-x-3 p-3 border rounded-lg dark:border-gray-600 dark:bg-gray-750">
                  <div className="flex-shrink-0 mt-1">
                    {getActionIcon(entry.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium dark:text-gray-100">{entry.action}</h4>
                      <Badge className={`text-xs ${getTypeColor(entry.type)}`}>
                        {entry.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{entry.details}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
