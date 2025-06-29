
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Send, Star, Heart } from 'lucide-react';

export const ProductRequestForm = () => {
  const [requestData, setRequestData] = useState({
    productUrl: '',
    category: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!requestData.productUrl.trim()) {
      toast({
        title: "Error",
        description: "Please provide a product URL",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Store the request
      const requests = JSON.parse(localStorage.getItem('sunbeam-user-requests') || '[]');
      const newRequest = {
        id: Date.now().toString(),
        ...requestData,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };
      
      requests.unshift(newRequest);
      localStorage.setItem('sunbeam-user-requests', JSON.stringify(requests.slice(0, 100)));

      toast({
        title: "Request Submitted!",
        description: "We'll review your product request and create a detailed review soon.",
      });

      // Reset form
      setRequestData({
        productUrl: '',
        category: '',
        notes: ''
      });

    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const popularCategories = [
    'Electronics', 'Home & Garden', 'Fashion', 'Health & Beauty', 
    'Sports & Outdoors', 'Books & Media', 'Automotive', 'Baby & Kids'
  ];

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center space-x-2">
          <Star className="w-5 h-5" />
          <span>Request a Product Review</span>
        </CardTitle>
        <p className="text-orange-100 text-sm">
          Can't find a review for a product you're interested in? Let us know and we'll create one!
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="product-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Product URL *
            </label>
            <Input
              id="product-url"
              type="url"
              placeholder="https://amazon.com/product/..."
              value={requestData.productUrl}
              onChange={(e) => setRequestData({...requestData, productUrl: e.target.value})}
              className="dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category (Optional)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {popularCategories.map((cat) => (
                <Badge
                  key={cat}
                  variant={requestData.category === cat ? "default" : "outline"}
                  className="cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900"
                  onClick={() => setRequestData({...requestData, category: requestData.category === cat ? '' : cat})}
                >
                  {cat}
                </Badge>
              ))}
            </div>
            <Input
              id="category"
              placeholder="Or type a custom category..."
              value={requestData.category}
              onChange={(e) => setRequestData({...requestData, category: e.target.value})}
              className="dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Additional Notes (Optional)
            </label>
            <Textarea
              id="notes"
              placeholder="What specific aspects would you like us to focus on in the review?"
              value={requestData.notes}
              onChange={(e) => setRequestData({...requestData, notes: e.target.value})}
              className="dark:bg-gray-700 dark:border-gray-600"
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Submitting...'
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Request
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">Why request reviews?</span>
          </div>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
            Our expert team researches products thoroughly, tracks price history, and provides unbiased reviews to help you make informed purchasing decisions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
