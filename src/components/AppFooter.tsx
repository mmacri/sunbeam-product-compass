
import React from 'react';

export const AppFooter: React.FC = () => {
  return (
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
  );
};
