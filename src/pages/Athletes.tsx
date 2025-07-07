import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AppHeader } from '@/components/AppHeader';
import { AppFooter } from '@/components/AppFooter';
import { useTheme } from '@/contexts/ThemeContext';
import { useProductData } from '@/hooks/useProductData';
import { Search, Trophy, Zap, Target, Timer } from 'lucide-react';

const Athletes = () => {
  const { theme, toggleTheme } = useTheme();
  const { selectedRapidApiProducts, isLoadingRapidApi } = useProductData();
  const [searchTerm, setSearchTerm] = useState('');

  const sportCategories = [
    { name: 'Running & Endurance', count: 15, icon: Timer },
    { name: 'Strength Training', count: 12, icon: Trophy },
    { name: 'Team Sports', count: 18, icon: Target },
    { name: 'Combat Sports', count: 8, icon: Zap }
  ];

  const athleteProducts = [
    {
      title: 'Elite Percussion Massager Pro',
      category: 'Strength Training',
      price: '$299',
      rating: 4.9,
      features: ['6 speed settings', 'Professional grade', '3-year warranty'],
      sportsUse: ['Powerlifting', 'Bodybuilding', 'CrossFit'],
      image: '/api/placeholder/300/200'
    },
    {
      title: 'Competition Recovery System',
      category: 'Running & Endurance',
      price: '$449',
      rating: 4.8,
      features: ['Full leg coverage', 'Rapid inflation', 'Travel case included'],
      sportsUse: ['Marathon', 'Cycling', 'Triathlon'],
      image: '/api/placeholder/300/200'
    },
    {
      title: 'Pro Cold Therapy Unit',
      category: 'Team Sports',
      price: '$199',
      rating: 4.7,
      features: ['Targeted cooling', 'Adjustable intensity', 'Quick setup'],
      sportsUse: ['Football', 'Soccer', 'Basketball'],
      image: '/api/placeholder/300/200'
    },
    {
      title: 'Combat Sports Recovery Kit',
      category: 'Combat Sports',
      price: '$159',
      rating: 4.6,
      features: ['Impact recovery', 'Bruise management', 'Portable design'],
      sportsUse: ['MMA', 'Boxing', 'Wrestling'],
      image: '/api/placeholder/300/200'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      sport: 'Marathon Runner',
      quote: 'These recovery tools cut my recovery time in half. I can train harder and more consistently.',
      image: '/api/placeholder/60/60'
    },
    {
      name: 'Mike Chen',
      sport: 'Powerlifter',
      quote: 'Game-changer for my training. The percussion therapy helps me hit PRs every week.',
      image: '/api/placeholder/60/60'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
            Recovery Tools for Athletes
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Professional-grade recovery equipment designed for peak performance. Train harder, recover faster, perform better.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by sport or equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Sport Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {sportCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.name} className="cursor-pointer hover-lift text-center">
                <CardContent className="p-6">
                  <Icon className="w-8 h-8 mx-auto mb-3 text-recovery-athlete" />
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <Badge variant="secondary">{category.count} products</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-recovery-athlete mb-2">95%</div>
            <div className="text-muted-foreground">Faster Recovery</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-recovery-athlete mb-2">2x</div>
            <div className="text-muted-foreground">Training Frequency</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-recovery-athlete mb-2">40%</div>
            <div className="text-muted-foreground">Less Soreness</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-recovery-athlete mb-2">1000+</div>
            <div className="text-muted-foreground">Pro Athletes</div>
          </div>
        </div>

        {/* Athlete Products */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {athleteProducts.map((product, index) => (
            <Card key={index} className="hover-lift">
              <div className="aspect-square bg-recovery-athlete/10 flex items-center justify-center">
                <Trophy className="w-16 h-16 text-recovery-athlete" />
              </div>
              <CardHeader>
                <Badge variant="outline" className="w-fit mb-2">{product.category}</Badge>
                <CardTitle className="text-lg">{product.title}</CardTitle>
                <div className="text-2xl font-bold text-recovery-athlete">{product.price}</div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">Key Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {product.features.map((feature, i) => (
                        <li key={i}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Perfect For:</h4>
                    <div className="flex flex-wrap gap-1">
                      {product.sportsUse.map((sport, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {sport}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">What Athletes Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-recovery-athlete/20 rounded-full flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-recovery-athlete" />
                    </div>
                    <div className="flex-1">
                      <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.sport}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Training Program CTA */}
        <Card className="bg-gradient-to-r from-recovery-athlete to-recovery-accent text-white text-center p-8">
          <CardContent className="p-0">
            <h3 className="text-2xl font-bold mb-4">Elite Training Program</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Get access to our exclusive training and recovery protocols used by professional athletes worldwide.
            </p>
            <Button variant="secondary" size="lg" className="bg-white text-recovery-athlete hover:bg-blue-50">
              Join Program
            </Button>
          </CardContent>
        </Card>
      </main>

      <AppFooter />
    </div>
  );
};

export default Athletes;