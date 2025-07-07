import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AppHeader } from '@/components/AppHeader';
import { AppFooter } from '@/components/AppFooter';
import { useTheme } from '@/contexts/ThemeContext';
import { useProductData } from '@/hooks/useProductData';
import { Search, Heart, Home, Coffee, Moon } from 'lucide-react';

const EverydayRecovery = () => {
  const { theme, toggleTheme } = useTheme();
  const { selectedRapidApiProducts, isLoadingRapidApi } = useProductData();
  const [searchTerm, setSearchTerm] = useState('');

  const lifestyleCategories = [
    { name: 'Work From Home', count: 12, icon: Home },
    { name: 'Stress Relief', count: 15, icon: Heart },
    { name: 'Sleep Enhancement', count: 8, icon: Moon },
    { name: 'Daily Wellness', count: 18, icon: Coffee }
  ];

  const everydayProducts = [
    {
      title: 'Desk Worker\'s Recovery Kit',
      category: 'Work From Home',
      price: '$89',
      rating: 4.7,
      benefits: ['Reduces neck tension', 'Improves posture', 'Portable design'],
      timeNeeded: '10-15 minutes',
      image: '/api/placeholder/300/200'
    },
    {
      title: 'Stress Relief Massage Ball Set',
      category: 'Stress Relief',
      price: '$29',
      rating: 4.5,
      benefits: ['Instant tension relief', 'Fits in purse/bag', 'Multiple sizes'],
      timeNeeded: '5-10 minutes',
      image: '/api/placeholder/300/200'
    },
    {
      title: 'Sleep Recovery System',
      category: 'Sleep Enhancement',
      price: '$149',
      rating: 4.8,
      benefits: ['Better sleep quality', 'Reduces anxiety', 'Quiet operation'],
      timeNeeded: '20-30 minutes',
      image: '/api/placeholder/300/200'
    },
    {
      title: 'Daily Wellness Bundle',
      category: 'Daily Wellness',
      price: '$199',
      rating: 4.6,
      benefits: ['Complete body care', 'Morning & evening use', 'Family friendly'],
      timeNeeded: '15-20 minutes',
      image: '/api/placeholder/300/200'
    }
  ];

  const dailyTips = [
    {
      time: 'Morning',
      tip: '5-minute activation routine to energize your day',
      icon: Coffee
    },
    {
      time: 'Lunch Break',
      tip: 'Quick desk stretches and targeted muscle relief',
      icon: Home
    },
    {
      time: 'Evening',
      tip: 'Wind-down routine for better sleep quality',
      icon: Moon
    }
  ];

  const budgetTiers = [
    {
      name: 'Starter Pack',
      price: '$25-75',
      description: 'Basic tools for everyday relief',
      products: ['Massage balls', 'Resistance bands', 'Heat pads']
    },
    {
      name: 'Complete Setup',
      price: '$100-200',
      description: 'Everything you need for home recovery',
      products: ['Massage gun', 'Foam roller', 'Compression gear']
    },
    {
      name: 'Premium Experience',
      price: '$250+',
      description: 'Professional-grade home spa experience',
      products: ['Premium massager', 'Recovery system', 'Smart features']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
            Everyday Recovery & Wellness
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Simple, effective recovery tools that fit seamlessly into your daily routine. Perfect for busy lifestyles and everyday wellness.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search wellness solutions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Lifestyle Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {lifestyleCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.name} className="cursor-pointer hover-lift text-center">
                <CardContent className="p-6">
                  <Icon className="w-8 h-8 mx-auto mb-3 text-recovery-wellness" />
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <Badge variant="secondary">{category.count} solutions</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Daily Recovery Tips */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Your Daily Recovery Schedule</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {dailyTips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <Card key={index} className="text-center p-6">
                  <CardContent className="p-0">
                    <Icon className="w-12 h-12 mx-auto mb-4 text-recovery-wellness" />
                    <h3 className="text-xl font-bold mb-2">{tip.time}</h3>
                    <p className="text-muted-foreground">{tip.tip}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Budget-Friendly Options */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Choose Your Investment Level</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {budgetTiers.map((tier, index) => (
              <Card key={index} className="text-center hover-lift">
                <CardHeader>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold text-recovery-wellness">{tier.price}</div>
                  <p className="text-muted-foreground">{tier.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {tier.products.map((product, i) => (
                      <li key={i} className="text-muted-foreground">• {product}</li>
                    ))}
                  </ul>
                  <Button className="w-full">Explore Options</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Everyday Products */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {everydayProducts.map((product, index) => (
            <Card key={index} className="hover-lift">
              <div className="aspect-square bg-recovery-wellness/10 flex items-center justify-center">
                <Heart className="w-16 h-16 text-recovery-wellness" />
              </div>
              <CardHeader>
                <Badge variant="outline" className="w-fit mb-2">{product.category}</Badge>
                <CardTitle className="text-lg">{product.title}</CardTitle>
                <div className="text-2xl font-bold text-recovery-wellness">{product.price}</div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">Benefits:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {product.benefits.map((benefit, i) => (
                        <li key={i}>• {benefit}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Time needed:</span>
                    <Badge variant="secondary">{product.timeNeeded}</Badge>
                  </div>
                  <Button className="w-full">Add to Cart</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Wellness Challenge CTA */}
        <Card className="bg-gradient-to-r from-recovery-wellness to-recovery-accent text-white text-center p-8">
          <CardContent className="p-0">
            <h3 className="text-2xl font-bold mb-4">30-Day Wellness Challenge</h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Transform your daily routine with our guided 30-day wellness challenge. Small steps, big results.
            </p>
            <Button variant="secondary" size="lg" className="bg-white text-recovery-wellness hover:bg-green-50">
              Start Challenge
            </Button>
          </CardContent>
        </Card>
      </main>

      <AppFooter />
    </div>
  );
};

export default EverydayRecovery;