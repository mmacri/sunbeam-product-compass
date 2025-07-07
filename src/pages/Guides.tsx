import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AppHeader } from '@/components/AppHeader';
import { AppFooter } from '@/components/AppFooter';
import { useTheme } from '@/contexts/ThemeContext';
import { useProductData } from '@/hooks/useProductData';
import { Search, BookOpen, Clock, Users, PlayCircle } from 'lucide-react';

const Guides = () => {
  const { theme, toggleTheme } = useTheme();
  const { selectedRapidApiProducts, isLoadingRapidApi } = useProductData();
  const [searchTerm, setSearchTerm] = useState('');

  const guideCategories = [
    { name: 'Beginner Guides', count: 12, icon: BookOpen },
    { name: 'Technique Tutorials', count: 18, icon: PlayCircle },
    { name: 'Recovery Protocols', count: 8, icon: Clock },
    { name: 'Equipment Setup', count: 15, icon: Users }
  ];

  const featuredGuides = [
    {
      title: 'Complete Beginner\'s Guide to Recovery',
      category: 'Beginner Guides',
      readTime: '15 min',
      difficulty: 'Beginner',
      views: '12.5K',
      summary: 'Everything you need to know to start your recovery journey, from basic principles to choosing your first tools.',
      image: '/api/placeholder/400/250'
    },
    {
      title: 'Percussion Massage: Proper Techniques',
      category: 'Technique Tutorials',
      readTime: '8 min',
      difficulty: 'Intermediate',
      views: '8.3K',
      summary: 'Master the art of percussion massage with step-by-step techniques for different muscle groups.',
      image: '/api/placeholder/400/250'
    },
    {
      title: 'Post-Workout Recovery Protocol',
      category: 'Recovery Protocols',
      readTime: '12 min',
      difficulty: 'All Levels',
      views: '15.2K',
      summary: 'A comprehensive 20-minute recovery routine that maximizes your post-workout recovery.',
      image: '/api/placeholder/400/250'
    },
    {
      title: 'Setting Up Your Home Recovery Station',
      category: 'Equipment Setup',
      readTime: '10 min',
      difficulty: 'Beginner',
      views: '6.8K',
      summary: 'Design and organize the perfect home recovery space on any budget.',
      image: '/api/placeholder/400/250'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-recovery-wellness';
      case 'Intermediate': return 'bg-recovery-secondary';
      case 'Advanced': return 'bg-recovery-athlete';
      default: return 'bg-recovery-guide';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
            Recovery Guides & Tutorials
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Step-by-step guides, expert tutorials, and proven recovery protocols to optimize your wellness journey.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search guides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {guideCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.name} className="cursor-pointer hover-lift text-center">
                <CardContent className="p-6">
                  <Icon className="w-8 h-8 mx-auto mb-3 text-recovery-guide" />
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <Badge variant="secondary">{category.count} guides</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Featured Guides */}
        <div className="grid gap-8 md:grid-cols-2 mb-12">
          {featuredGuides.map((guide, index) => (
            <Card key={index} className="hover-lift overflow-hidden">
              <div className="aspect-video bg-recovery-guide/10 flex items-center justify-center">
                <PlayCircle className="w-16 h-16 text-recovery-guide" />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{guide.category}</Badge>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {guide.readTime}
                    </span>
                    <span>{guide.views} views</span>
                  </div>
                </div>
                <CardTitle className="text-xl">{guide.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getDifficultyColor(guide.difficulty)}>
                    {guide.difficulty}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">{guide.summary}</p>
                <Button className="w-full">Read Guide</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <Card className="bg-gradient-to-r from-recovery-guide to-recovery-accent text-white text-center p-8">
          <CardContent className="p-0">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Get the latest guides, tutorials, and recovery tips delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input placeholder="Enter your email" className="bg-white text-gray-900" />
              <Button variant="secondary" className="bg-white text-recovery-guide hover:bg-purple-50">
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <AppFooter />
    </div>
  );
};

export default Guides;