import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExcelService } from '@/services/excelService';
import { RapidApiProduct } from '@/types/rapidApi';

// Sample RapidAPI data structure for testing
const sampleRapidApiProducts: RapidApiProduct[] = [
  {
    asin: "B08N5WRWNW",
    product_title: "Echo Dot (4th Gen) - Smart speaker with Alexa",
    product_price: "$49.99",
    product_original_price: "$59.99",
    unit_price: "$49.99",
    unit_count: 1,
    currency: "USD",
    product_star_rating: "4.7",
    product_num_ratings: 234567,
    product_url: "https://amazon.com/dp/B08N5WRWNW",
    product_photo: "https://m.media-amazon.com/images/I/614YRyQASmL._AC_SL1000_.jpg",
    product_num_offers: 15,
    product_minimum_offer_price: "$45.99",
    is_best_seller: true,
    is_amazon_choice: true,
    is_prime: true,
    climate_pledge_friendly: true,
    delivery: "FREE delivery Thu, Dec 14",
    has_variations: true,
    product_byline: "Electronics > Smart Home > Smart Speakers",
    coupon_text: "Save 5% with coupon",
    product_badge: "Best Seller",
    product_availability: "In Stock",
    product_description: "Meet Echo Dot - Our most popular smart speaker with Alexa. The sleek, compact design delivers crisp vocals and balanced bass for full sound.",
    about_product: [
      "Improved speaker quality - Better speaker quality than Echo Dot Gen 3 for richer and louder sound.",
      "Voice control your music - Stream songs from Amazon Music, Apple Music, Spotify, SiriusXM, and others.",
      "Ready to help - Ask Alexa to play music, answer questions, read the news, check the weather, set alarms, control compatible smart home devices, and more.",
      "Connect with others - Drop in on other rooms in your home or make announcements to every room with a compatible Echo device."
    ],
    customers_say: "Customers appreciate the improved sound quality and compact design. Many highlight the easy setup and seamless integration with smart home devices.",
    sales_volume: "10,000+ bought in past month",
    standing_screen_display_size: "N/A",
    memory_storage_capacity: "N/A",
    ram_memory_installed_size: "N/A"
  },
  {
    asin: "B09B8V8WLC",
    product_title: "Apple AirPods Pro (2nd Generation)",
    product_price: "$249.00",
    product_original_price: "$279.00",
    unit_price: "$249.00",
    unit_count: 1,
    currency: "USD",
    product_star_rating: "4.5",
    product_num_ratings: 89234,
    product_url: "https://amazon.com/dp/B09B8V8WLC",
    product_photo: "https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg",
    product_num_offers: 8,
    product_minimum_offer_price: "$239.00",
    is_best_seller: false,
    is_amazon_choice: true,
    is_prime: true,
    climate_pledge_friendly: false,
    delivery: "FREE delivery Wed, Dec 13",
    has_variations: false,
    product_byline: "Electronics > Headphones > Earbuds",
    coupon_text: "",
    product_badge: "Amazon's Choice",
    product_availability: "In Stock",
    product_description: "AirPods Pro feature Active Noise Cancellation for immersive sound. Transparency mode for hearing the world around you. All-day battery life and a more customizable fit.",
    about_product: [
      "Active Noise Cancellation blocks outside noise, so you can immerse yourself in music",
      "Transparency mode for hearing and interacting with the world around you",
      "Spatial audio with dynamic head tracking provides theater-like sound that surrounds you",
      "Customizable fit with three sizes of soft, tapered silicone tips",
      "Sweat and water resistant for Active Noise Cancellation and Transparency mode"
    ],
    customers_say: "Users love the active noise cancellation and sound quality. The improved fit and battery life are frequently mentioned as standout features.",
    sales_volume: "5,000+ bought in past month",
    standing_screen_display_size: "N/A",
    memory_storage_capacity: "N/A",
    ram_memory_installed_size: "N/A"
  }
];

export const ExcelExportTest: React.FC = () => {
  const testExport = () => {
    console.log('Testing Excel export with sample RapidAPI data:', sampleRapidApiProducts);
    ExcelService.exportToExcel(sampleRapidApiProducts);
  };

  const testSelectedColumns = () => {
    const testColumns = [
      'affiliate_link', 'title', 'image_url', 'description', 'price', 'sale_price', 
      'rating', 'review_1', 'review_2', 'category', 'tags', 'specifications'
    ];
    console.log('Testing Excel export with selected columns:', testColumns);
    ExcelService.exportToExcel(sampleRapidApiProducts, testColumns);
  };

  const testEnhancedExport = async () => {
    console.log('Testing export with reviews API:', sampleRapidApiProducts);
    try {
      await ExcelService.exportToExcel(sampleRapidApiProducts, undefined, (current, total) => {
        console.log(`Test progress: ${current}/${total} products processed`);
      });
    } catch (error) {
      console.error('Export test failed:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Excel Export Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={testExport} variant="outline">
            Test Full Export (All Columns)
          </Button>
          <Button onClick={testSelectedColumns} variant="outline">
            Test Selected Columns Export
          </Button>
          <Button onClick={testEnhancedExport} variant="default">
            Test Export (With Reviews)
          </Button>
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Sample Data Preview:</h3>
          <div className="text-sm space-y-2">
            <p><strong>Product 1:</strong> {sampleRapidApiProducts[0].product_title}</p>
            <p><strong>Review 1:</strong> {sampleRapidApiProducts[0].customers_say}</p>
            <p><strong>Review 2:</strong> {sampleRapidApiProducts[0].about_product?.[0]}</p>
            <p><strong>Category:</strong> {sampleRapidApiProducts[0].product_byline}</p>
            <p><strong>Price:</strong> {sampleRapidApiProducts[0].product_original_price || sampleRapidApiProducts[0].product_price}</p>
            <p><strong>Sale Price:</strong> {sampleRapidApiProducts[0].product_price}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};