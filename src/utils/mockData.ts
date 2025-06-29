
export const mockProducts = [
  {
    id: 1,
    title: "Theragun Pro 5 Percussive Therapy Device",
    currentPrice: "$399",
    originalPrice: "$449",
    rating: 4.7,
    reviews: 2847,
    description: "The Theragun Pro 5 delivers professional-grade percussive therapy with advanced features for deep muscle treatment. Featuring a powerful motor, customizable speed settings, and ergonomic design for optimal user experience.",
    keyFeatures: [
      "2,400 percussions per minute with QuietForce Technology",
      "60-minute battery life with wireless charging",
      "5 built-in speed settings and customizable routines",
      "Professional-grade build with 2-year warranty",
      "Smart app integration with guided therapy sessions"
    ],
    specs: {
      "Speed Range": "1,750 - 2,400 PPM",
      "Battery Life": "60 minutes",
      "Noise Level": "55dB",
      "Weight": "2.9 lbs",
      "Warranty": "2 years"
    },
    stores: [
      { name: "Amazon", url: "https://amazon.com/theragun-pro" },
      { name: "Best Buy", url: "https://bestbuy.com/theragun" },
      { name: "Theragun Direct", url: "https://theragun.com" }
    ],
    priceHistory: [
      { date: "Today", price: "$399", store: "Amazon" },
      { date: "1 week ago", price: "$419", store: "Amazon" },
      { date: "2 weeks ago", price: "$449", store: "Amazon" },
      { date: "1 month ago", price: "$399", store: "Best Buy" }
    ]
  },
  {
    id: 2,
    title: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    currentPrice: "$348",
    originalPrice: "$399",
    rating: 4.6,
    reviews: 5234,
    description: "Industry-leading noise cancellation meets exceptional sound quality in Sony's flagship wireless headphones. Perfect for travel, work, or daily listening with premium comfort and smart features.",
    keyFeatures: [
      "Industry-leading Active Noise Cancellation",
      "30-hour battery life with quick charge",
      "Crystal-clear hands-free calling with precise voice pickup",
      "Touch sensor controls for easy operation",
      "Compatible with Alexa and Google Assistant"
    ],
    specs: {
      "Driver Size": "30mm",
      "Frequency Response": "4Hz - 40kHz",
      "Battery Life": "30 hours",
      "Charging": "USB-C Quick Charge",
      "Weight": "8.8 oz"
    },
    stores: [
      { name: "Amazon", url: "https://amazon.com/sony-wh1000xm5" },
      { name: "Sony Direct", url: "https://sony.com/headphones" },
      { name: "Target", url: "https://target.com/sony" }
    ],
    priceHistory: [
      { date: "Today", price: "$348", store: "Amazon" },
      { date: "3 days ago", price: "$365", store: "Amazon" },
      { date: "1 week ago", price: "$379", store: "Sony Direct" },
      { date: "2 weeks ago", price: "$399", store: "Target" }
    ]
  }
];
