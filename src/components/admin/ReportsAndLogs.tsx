
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Eye, 
  BarChart3,
  Activity
} from 'lucide-react';

interface Product {
  id: string;
  title: string;
  url: string;
  threshold: number;
  tags: string[];
  price: string;
  lastUpdated: string;
}

interface LogEntry {
  timestamp: string;
  action: string;
  details: any;
}

interface ReportsAndLogsProps {
  products: Product[];
  onLogAction: (action: string, details: any) => void;
  onShowMessage: (message: string, type?: 'success' | 'error') => void;
}

export const ReportsAndLogs: React.FC<ReportsAndLogsProps> = ({
  products,
  onLogAction,
  onShowMessage
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    const saved = localStorage.getItem('sunbeam-logs');
    if (saved) {
      setLogs(JSON.parse(saved));
    }
  };

  const exportLogs = (format: 'csv' | 'json') => {
    let data: string;
    
    if (format === 'csv') {
      const csvRows = logs.map(l => `${l.timestamp},${l.action},"${JSON.stringify(l.details)}"`);
      data = ['timestamp,action,details', ...csvRows].join('\n');
    } else {
      data = JSON.stringify(logs, null, 2);
    }
    
    const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sunbeam-logs.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    
    onLogAction('logs_exported', { format });
    onShowMessage(`Logs exported as ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Reports Tab */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Total Products</h3>
              <p className="text-2xl font-bold text-blue-600">{products.length}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 dark:text-green-100">Active Alerts</h3>
              <p className="text-2xl font-bold text-green-600">
                {products.filter(p => p.threshold > 0).length}
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-900 dark:text-orange-100">Total Actions</h3>
              <p className="text-2xl font-bold text-orange-600">{logs.length}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportLogs('csv')}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => exportLogs('json')}>
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Tab */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Logs
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowLogs(!showLogs)}>
              <Eye className="w-4 h-4 mr-2" />
              {showLogs ? 'Hide' : 'View'} Logs
            </Button>
            <Button variant="outline" onClick={() => exportLogs('csv')}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => exportLogs('json')}>
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showLogs && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg max-h-64 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap">
                {logs.slice(0, 10).map((log, index) => (
                  `${log.timestamp} - ${log.action} - ${JSON.stringify(log.details)}\n`
                )).join('')}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
