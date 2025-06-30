
import React from 'react';
import { Button } from '@/components/ui/button';

export const CallToAction: React.FC = () => {
  return (
    <div className="mt-16 text-center bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-8 text-white">
      <h3 className="text-2xl font-bold mb-4">Want More Product Reviews?</h3>
      <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
        Our team continuously monitors prices and reviews new products. 
        Use the request form above to suggest products you'd like us to review.
      </p>
      <Button 
        variant="secondary" 
        size="lg"
        className="bg-white text-orange-600 hover:bg-orange-50"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Request a Review
      </Button>
    </div>
  );
};
