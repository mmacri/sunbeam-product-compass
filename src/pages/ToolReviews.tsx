import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AppHeader } from '@/components/AppHeader';
import { AppFooter } from '@/components/AppFooter';
import { useTheme } from '@/contexts/ThemeContext';
import { useProductData } from '@/hooks/useProductData';
import { Search, Star, TrendingUp, Award } from 'lucide-react';

const ToolReviews = () => {
  const { theme, toggleTheme } = useTheme();
  const { selectedRapidApiProducts, isLoadingRapidApi } = useProductData();
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { name: 'All Reviews', count: 24, color: 'bg-recovery-primary' },
    { name: 'Massage Tools', count: 8, color: 'bg-Recovery-accent' },
    { name: 'Recovery Devices', count: 6, color: 'bg-recovery-wellness' },
    { name: 'Compression Therapy', count: 5, color: 'bg-recovery-athlete' },
    { name: 'Heat & Cold Therapy', count: 5, color: 'bg-recovery-guide' }
  ];

  const featuredReviews = [
    {
      title: 'Theragun Pro vs Elite: Complete Comparison',
      rating: 4.8,
      reviewCount: 156,
      category: 'Massage Tools',
      featured: true,
      summary: 'In-depth comparison of Theragun\'s flagship models with real-world testing.'
    },
    {
      title: 'Best Compression Boots Under $500',
      rating: 4.6,
      reviewCount: 89,
      category: 'Compression Therapy',
      featured: false,
      summary: 'Comprehensive review of budget-friendly compression therapy options.'
    },
    {
      title: 'NormaTec vs Hyperice: Recovery Showdown',
      rating: 4.9,
      reviewCount: 203,
      category: 'Recovery Devices',
      featured: true,
      summary: 'Head-to-head comparison of premium pneumatic compression systems.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AppHeader 
        theme={theme}
        toggleTheme={toggleTheme}
        realProductsCount={selectedRapidApiProducts.length}
        isLoadingRapidApi={isLoadingRapidApi}
      />

      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Professional Tool Reviews
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Expert reviews and comprehensive comparisons of recovery tools, backed by real-world testing and professional insights.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant="outline"
              className="flex items-center gap-2"
            >
              <div className={`w-3 h-3 rounded-full ${category.color}`} />
              {category.name}
              <Badge variant="secondary" className="ml-1">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Featured Reviews */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {featuredReviews.map((review, index) => (
            <Card key={index} className="hover-lift">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge 
                    variant={review.featured ? "default" : "secondary"}
                    className="mb-2"
                  >
                    {review.featured && <Award className="w-3 h-3 mr-1" />}
                    {review.category}
                  </Badge>
                  {review.featured && <TrendingUp className="w-4 h-4 text-recovery-primary" />}
                </div>
                <CardTitle className="text-lg">{review.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-semibold">{review.rating}</span>
                  </div>
                  <span className="text-muted-foreground">
                    ({review.reviewCount} reviews)
                  </span>
                </div>
                <p className="text-muted-foreground mb-4">{review.summary}</p>
                <Button className="w-full">Read Full Review</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-recovery-primary to-recovery-secondary text-white text-center p-8">
          <CardContent className="p-0">
            <h3 className="text-2xl font-bold mb-4">Get Personalized Recommendations</h3>
            <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
              Not sure which tool is right for you? Take our quick assessment to get personalized recommendations based on your recovery needs.
            </p>
            <Button variant="secondary" size="lg" className="bg-white text-recovery-primary hover:bg-orange-50">
              Take Assessment
            </Button>
          </CardContent>
        </Card>
      </main>

      <AppFooter />
    </div>
  );
};

export default ToolReviews;