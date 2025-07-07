import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Star, TrendingUp, Gift } from 'lucide-react';

export const EnhancedHeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredProducts = [
    {
      id: 1,
      title: 'Winter Recovery Sale',
      subtitle: 'Premium Massage Guns',
      description: 'Professional-grade percussion therapy for deep muscle relief',
      price: '$299',
      originalPrice: '$399',
      discount: '25% OFF',
      badge: 'Limited Time',
      cta: 'Shop Now',
      highlight: 'Best Seller'
    },
    {
      id: 2,
      title: 'New Year, New Recovery',
      subtitle: 'Complete Recovery System',
      description: 'Everything you need for a comprehensive recovery routine',
      price: '$199',
      originalPrice: '$299',
      discount: '33% OFF',
      badge: 'New Arrival',
      cta: 'Learn More',
      highlight: "Editor's Choice"
    },
    {
      id: 3,
      title: "Athlete's Choice",
      subtitle: 'Pro Compression Boots',
      description: 'Used by professional athletes for rapid recovery',
      price: '$599',
      originalPrice: '$799',
      discount: '25% OFF',
      badge: 'Pro Grade',
      cta: 'View Details',
      highlight: 'Professional Approved'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  const currentProduct = featuredProducts[currentSlide];

  return (
    <div className="relative mb-16">
      {/* Main Hero Banner */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-recovery-primary via-recovery-secondary to-recovery-accent text-white">
        <CardContent className="p-0">
          <div className="relative min-h-[500px] md:min-h-[600px]">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-white/5"></div>
            </div>

            {/* Content */}
            <div className="relative container mx-auto px-6 py-16 md:py-24">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      <Gift className="w-3 h-3 mr-1" />
                      {currentProduct.badge}
                    </Badge>
                    <Badge variant="secondary" className="bg-recovery-wellness text-white">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {currentProduct.highlight}
                    </Badge>
                  </div>

                  <div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                      {currentProduct.title}
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-orange-100">
                      {currentProduct.subtitle}
                    </h2>
                    <p className="text-xl text-orange-100 mb-6 max-w-lg">
                      {currentProduct.description}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="text-4xl font-bold">{currentProduct.price}</div>
                    <div className="text-lg text-orange-200 line-through">
                      {currentProduct.originalPrice}
                    </div>
                    <Badge variant="destructive" className="text-lg px-3 py-1">
                      {currentProduct.discount}
                    </Badge>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      size="lg" 
                      variant="secondary"
                      className="bg-white text-recovery-primary hover:bg-orange-50 text-lg px-8 py-3"
                    >
                      {currentProduct.cta}
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="border-white text-white hover:bg-white/10 text-lg px-8 py-3"
                    >
                      Compare Products
                    </Button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex items-center gap-6 pt-6 border-t border-white/20">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">4.8/5</span>
                      <span className="text-orange-100">(2,480 reviews)</span>
                    </div>
                    <div className="text-orange-100">
                      Free shipping • 30-day returns
                    </div>
                  </div>
                </div>

                {/* Right Content - Product Image */}
                <div className="relative">
                  <div className="aspect-square bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                      <div className="text-6xl opacity-50">🔧</div>
                    </div>
                  </div>
                  
                  {/* Floating feature callouts */}
                  <div className="absolute -top-4 -right-4 bg-recovery-wellness text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Editor's Pick
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-white text-recovery-primary px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Free Shipping
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Category Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {[
          { name: 'Tool Reviews', color: 'bg-recovery-primary', link: '/tool-reviews' },
          { name: 'Guides', color: 'bg-recovery-guide', link: '/guides' },
          { name: 'For Athletes', color: 'bg-recovery-athlete', link: '/athletes' },
          { name: 'Everyday Recovery', color: 'bg-recovery-wellness', link: '/everyday-recovery' }
        ].map((category) => (
          <Card key={category.name} className="cursor-pointer hover-lift">
            <CardContent className="p-6 text-center">
              <div className={`w-12 h-12 ${category.color} rounded-full mx-auto mb-3 flex items-center justify-center`}>
                <div className="w-6 h-6 bg-white rounded-full opacity-80"></div>
              </div>
              <h3 className="font-semibold text-foreground">{category.name}</h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};