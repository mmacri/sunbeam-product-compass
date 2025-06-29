
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, TrendingDown, TrendingUp, Star } from 'lucide-react';
import { ProductSpecs } from '@/components/ProductSpecs';
import { PriceHistory } from '@/components/PriceHistory';
import { mockProducts } from '@/utils/mockData';

const Index = () => {
  const [products, setProducts] = useState(mockProducts);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">☀️</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                Sunbeam Reviews
              </h1>
            </div>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
              Product Reviews & Price Tracking
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Product Reviews & Price Tracking
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get detailed product comparisons, live price tracking, and expert reviews 
            all in one place. Make informed buying decisions with our comprehensive analysis.
          </p>
        </div>

        {/* Featured Products */}
        <div className="grid gap-8 md:gap-12">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{product.title}</CardTitle>
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-300 text-yellow-300' : 'text-yellow-300/50'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-yellow-100">{product.rating}/5</span>
                      <span className="text-yellow-100">({product.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{product.currentPrice}</div>
                    {product.originalPrice !== product.currentPrice && (
                      <div className="flex items-center text-yellow-200">
                        <span className="line-through text-sm mr-2">{product.originalPrice}</span>
                        <TrendingDown className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Product Description */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">Product Overview</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
                    
                    {/* Key Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3 text-gray-900">Key Features</h4>
                      <ul className="space-y-2">
                        {product.keyFeatures.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Purchase Links */}
                    <div className="flex flex-wrap gap-3">
                      {product.stores.map((store) => (
                        <Button 
                          key={store.name}
                          variant="outline" 
                          className="flex items-center space-x-2 hover:bg-orange-50 hover:border-orange-300"
                          onClick={() => window.open(store.url, '_blank')}
                        >
                          <span>Buy on {store.name}</span>
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Specs and Price History */}
                  <div className="space-y-6">
                    <ProductSpecs specs={product.specs} />
                    <PriceHistory priceHistory={product.priceHistory} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Want More Product Reviews?</h3>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            Our team continuously monitors prices and reviews new products. 
            Subscribe to get notified when we publish new reviews and price alerts.
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            className="bg-white text-orange-600 hover:bg-orange-50"
          >
            Subscribe for Updates
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">☀️</span>
              </div>
              <span className="text-xl font-bold">Sunbeam Reviews</span>
            </div>
            <p className="text-gray-400 mb-4">Smart Product Reviews & Price Tracking</p>
            <p className="text-sm text-gray-500">
              © 2025 Sunbeam Reviews. Internal tool for product analysis and review generation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
