
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText, Calendar, TrendingUp, Package } from 'lucide-react';
import { mockProducts } from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';

export const ReportingDashboard = () => {
  const [reportType, setReportType] = useState('overview');
  const { toast } = useToast();

  const categoryData = mockProducts.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryData).map(([category, count]) => ({
    category,
    count,
    products: count
  }));

  const priceRangeData = [
    { range: '$0-100', count: mockProducts.filter(p => parseFloat(p.currentPrice.replace('$', '')) <= 100).length },
    { range: '$101-300', count: mockProducts.filter(p => {
      const price = parseFloat(p.currentPrice.replace('$', ''));
      return price > 100 && price <= 300;
    }).length },
    { range: '$301-500', count: mockProducts.filter(p => {
      const price = parseFloat(p.currentPrice.replace('$', ''));
      return price > 300 && price <= 500;
    }).length },
    { range: '$500+', count: mockProducts.filter(p => parseFloat(p.currentPrice.replace('$', '')) > 500).length }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const generateReport = (format: 'csv' | 'json' | 'pdf') => {
    const reportData = {
      generated: new Date().toISOString(),
      summary: {
        totalProducts: mockProducts.length,
        averageRating: (mockProducts.reduce((sum, p) => sum + p.rating, 0) / mockProducts.length).toFixed(2),
        totalReviews: mockProducts.reduce((sum, p) => sum + p.reviews, 0),
        categoriesCount: Object.keys(categoryData).length
      },
      products: mockProducts.map(product => ({
        id: product.id,
        title: product.title,
        currentPrice: product.currentPrice,
        originalPrice: product.originalPrice,
        rating: product.rating,
        reviews: product.reviews,
        category: product.category,
        lastUpdated: new Date().toISOString()
      })),
      analytics: {
        categoryBreakdown: categoryData,
        priceRangeDistribution: priceRangeData
      }
    };

    if (format === 'csv') {
      const headers = ['Title', 'Current Price', 'Original Price', 'Rating', 'Reviews', 'Category'];
      const rows = reportData.products.map(p => [
        p.title, p.currentPrice, p.originalPrice, p.rating, p.reviews, p.category
      ]);
      const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sunbeam-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'json') {
      const json = JSON.stringify(reportData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sunbeam-report-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }

    toast({
      title: "Report Generated",
      description: `${format.toUpperCase()} report has been downloaded successfully.`,
    });
  };

  const scheduledReports = [
    { id: 1, name: 'Weekly Product Summary', frequency: 'Weekly', lastRun: '2025-06-22', status: 'Active' },
    { id: 2, name: 'Monthly Analytics', frequency: 'Monthly', lastRun: '2025-06-01', status: 'Active' },
    { id: 3, name: 'Price Change Alerts', frequency: 'Daily', lastRun: '2025-06-29', status: 'Active' }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
                <p className="text-2xl font-bold dark:text-gray-100">{mockProducts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Rating</p>
                <p className="text-2xl font-bold dark:text-gray-100">
                  {(mockProducts.reduce((sum, p) => sum + p.rating, 0) / mockProducts.length).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reviews</p>
                <p className="text-2xl font-bold dark:text-gray-100">
                  {mockProducts.reduce((sum, p) => sum + p.reviews, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
                <p className="text-2xl font-bold dark:text-gray-100">{Object.keys(categoryData).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-gray-100">Products by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" className="dark:text-gray-300" />
                  <YAxis className="dark:text-gray-300" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-gray-100">Price Range Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priceRangeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ range, count }) => `${range}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {priceRangeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export & Scheduled Reports */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
              <Download className="w-5 h-5" />
              <span>Export Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="flex-1 dark:bg-gray-700 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectItem value="overview">Overview Report</SelectItem>
                  <SelectItem value="detailed">Detailed Analysis</SelectItem>
                  <SelectItem value="price">Price Tracking</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={() => generateReport('csv')} 
                variant="outline" 
                className="flex-1 dark:border-gray-600 dark:text-gray-300"
              >
                Export CSV
              </Button>
              <Button 
                onClick={() => generateReport('json')} 
                variant="outline" 
                className="flex-1 dark:border-gray-600 dark:text-gray-300"
              >
                Export JSON
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-gray-100">Scheduled Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scheduledReports.map(report => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded dark:border-gray-600">
                  <div>
                    <p className="font-medium dark:text-gray-100">{report.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {report.frequency} • Last run: {report.lastRun}
                    </p>
                  </div>
                  <Badge variant={report.status === 'Active' ? 'default' : 'secondary'}>
                    {report.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
