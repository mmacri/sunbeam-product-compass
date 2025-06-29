
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Link2, Loader2, CheckCircle, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProductPreview } from '@/components/ProductPreview';

const Admin = () => {
  const [productUrl, setProductUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [productData, setProductData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    features: '',
    specs: {}
  });
  const { toast } = useToast();

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid product URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Processing URL:", productUrl);

    // Simulate API call to extract product data
    setTimeout(() => {
      const mockExtractedData = {
        title: detectProductFromUrl(productUrl),
        price: "$" + (Math.floor(Math.random() * 500) + 50),
        description: "High-quality product with excellent features and customer satisfaction.",
        rating: (4 + Math.random()).toFixed(1),
        reviews: Math.floor(Math.random() * 5000) + 100,
        category: detectCategoryFromUrl(productUrl),
        features: [
          "Premium build quality",
          "Advanced functionality",
          "User-friendly design",
          "Excellent value for money"
        ],
        specs: {
          "Brand": "Premium Brand",
          "Model": "Pro Series",
          "Warranty": "2 Years",
          "Weight": "2.5 lbs"
        }
      };

      setExtractedData(mockExtractedData);
      setProductData({
        title: mockExtractedData.title,
        price: mockExtractedData.price,
        description: mockExtractedData.description,
        category: mockExtractedData.category,
        features: mockExtractedData.features.join('\n'),
        specs: mockExtractedData.specs
      });
      setIsLoading(false);

      toast({
        title: "Success!",
        description: "Product data extracted successfully. Review and edit below.",
      });
    }, 2000);
  };

  const detectProductFromUrl = (url: string) => {
    if (url.includes('theragun') || url.includes('massage')) return 'Theragun Pro 5 Massage Gun';
    if (url.includes('laptop') || url.includes('macbook')) return 'MacBook Pro 14" M3';
    if (url.includes('headphones') || url.includes('airpods')) return 'Sony WH-1000XM5 Headphones';
    if (url.includes('phone') || url.includes('iphone')) return 'iPhone 15 Pro Max';
    return 'Premium Product';
  };

  const detectCategoryFromUrl = (url: string) => {
    if (url.includes('electronics')) return 'electronics';
    if (url.includes('health') || url.includes('massage')) return 'health';
    if (url.includes('computers')) return 'computers';
    return 'general';
  };

  const handleGenerateReview = () => {
    if (!productData.title.trim()) {
      toast({
        title: "Error",
        description: "Please fill in the product title at minimum",
        variant: "destructive",
      });
      return;
    }

    console.log("Generated review data:", productData);
    toast({
      title: "Review Generated!",
      description: "Product review has been created and added to the public blog.",
    });

    // Reset form
    setProductUrl('');
    setExtractedData(null);
    setProductData({
      title: '',
      price: '',
      description: '',
      category: '',
      features: '',
      specs: {}
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Sunbeam Admin Panel
              </h1>
            </div>
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 border-indigo-200">
              Product Review Generator
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <CardTitle className="flex items-center space-x-2">
                  <Link2 className="w-5 h-5" />
                  <span>Product URL Input</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleUrlSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="product-url" className="text-sm font-medium text-gray-700">
                      Product URL (Amazon, Walmart, eBay)
                    </Label>
                    <Input
                      id="product-url"
                      type="url"
                      placeholder="https://amazon.com/product/..."
                      value={productUrl}
                      onChange={(e) => setProductUrl(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Extracting Data...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Extract Product Data
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Manual Edit Panel */}
            {extractedData && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Edit Product Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="title">Product Title</Label>
                    <Input
                      id="title"
                      value={productData.title}
                      onChange={(e) => setProductData({...productData, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        value={productData.price}
                        onChange={(e) => setProductData({...productData, price: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={productData.category} 
                        onValueChange={(value) => setProductData({...productData, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="health">Health & Wellness</SelectItem>
                          <SelectItem value="computers">Computers</SelectItem>
                          <SelectItem value="home">Home & Garden</SelectItem>
                          <SelectItem value="sports">Sports & Outdoors</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Product Description</Label>
                    <Textarea
                      id="description"
                      rows={3}
                      value={productData.description}
                      onChange={(e) => setProductData({...productData, description: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="features">Key Features (one per line)</Label>
                    <Textarea
                      id="features"
                      rows={4}
                      value={productData.features}
                      onChange={(e) => setProductData({...productData, features: e.target.value})}
                    />
                  </div>

                  <Button 
                    onClick={handleGenerateReview}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Generate & Publish Review
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview Panel */}
          <div>
            {extractedData ? (
              <ProductPreview productData={productData} extractedData={extractedData} />
            ) : (
              <Card className="shadow-lg h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Link2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Preview will appear here</p>
                  <p className="text-sm">Enter a product URL to get started</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
