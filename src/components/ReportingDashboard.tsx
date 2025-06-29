
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, Package, Star } from 'lucide-react';
import { mockProducts } from '@/utils/mockData';

export const ReportingDashboard = () => {
  const categoryData = mockProducts.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryData).map(([category, count]) => ({
    category,
    count,
  }));

  const pieColors = ['#f97316', '#3b82f6', '#ef4444', '#10b981', '#8b5cf6'];

  const totalProducts = mockProducts.length;
  const avgRating = (mockProducts.reduce((sum, p) => sum + p.rating, 0) / totalProducts).toFixed(1);
  const totalReviews = mockProducts.reduce((sum, p) => sum + p.reviews, 0);

  const generateReport = (format: 'csv' | 'json' | 'summary') => {
    const reportData = {
      generated: new Date().toISOString(),
      summary: {
        totalProducts,
        averageRating: parseFloat(avgRating),
        totalReviews,
        categories: categoryData
      },
      products: mockProducts.map(product => ({
        id: product.id,
        title: product.title,
        currentPrice: product.currentPrice,
        rating: product.rating,
        reviews: product.reviews,
        category: product.category,
      }))
    };

    if (format === 'csv') {
      const headers = ['ID', 'Title', 'Price', 'Rating', 'Reviews', 'Category'];
      const rows = reportData.products.map(p => [
        p.id, p.title, p.currentPrice, p.rating, p.reviews, p.category
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
    } else {
      const summary = `Sunbeam Product Report - ${new Date().toLocaleDateString()}

Summary:
- Total Products: ${totalProducts}
- Average Rating: ${avgRating}/5.0
- Total Reviews: ${totalReviews.toLocaleString()}

Category Breakdown:
${Object.entries(categoryData).map(([cat, count]) => `- ${cat}: ${count} products`).join('\n')}

Generated: ${new Date().toLocaleString()}`;
      
      const blob = new Blob([summary], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sunbeam-summary-${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
                <p className="text-2xl font-bold dark:text-gray-100">{totalProducts}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
                <p className="text-2xl font-bold dark:text-gray-100">{avgRating}/5.0</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reviews</p>
                <p className="text-2xl font-bold dark:text-gray-100">{totalReviews.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
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
                  <CartesianGrid strokeDasharray="3 3" className="dark:opacity-30" />
                  <XAxis dataKey="category" className="dark:text-gray-300" fontSize={12} />
                  <YAxis className="dark:text-gray-300" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: '6px'
                    }}
                  />
                  <Bar dataKey="count" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-gray-100">Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ category, count }) => `${category}: ${count}`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Actions */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">Export Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => generateReport('csv')} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => generateReport('json')} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            <Button onClick={() => generateReport('summary')} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Summary
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
