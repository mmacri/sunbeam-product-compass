
interface RapidApiProduct {
  asin: string;
  product_title: string;
  product_price: string;
  unit_price: string;
  unit_count: number;
  product_original_price?: string;
  currency: string;
  product_star_rating: string;
  product_num_ratings: number;
  product_url: string;
  product_photo: string;
  product_num_offers: number;
  product_minimum_offer_price: string;
  is_best_seller: boolean;
  is_amazon_choice: boolean;
  is_prime: boolean;
  climate_pledge_friendly: boolean;
  sales_volume?: string;
  delivery: string;
  has_variations: boolean;
  product_byline?: string;
  coupon_text?: string;
  product_badge?: string;
  product_availability?: string;
}

interface RapidApiSearchResponse {
  status: string;
  request_id: string;
  query: string;
  country: string;
  sort_by: string;
  product_condition: string;
  deals_and_discounts: string;
  page: number;
  is_prime: boolean;
  four_stars_and_up: boolean;
  total_products: number;
  domain: string;
  products: RapidApiProduct[];
}

interface RapidApiProductDetails {
  asin: string;
  product_title: string;
  product_price: string;
  product_original_price?: string;
  currency: string;
  country: string;
  product_star_rating: string;
  product_num_ratings: number;
  product_url: string;
  product_photo: string;
  product_photos: string[];
  product_details: Record<string, string>;
  customers_say: string;
  product_description: string;
  about_product: string[];
  product_information: Record<string, string>;
  category_path: Array<{ name: string; link: string }>;
  climate_pledge_friendly: boolean;
  sales_rank: Array<{ category: string; rank: number }>;
}

interface RapidApiReview {
  review_id: string;
  review_title: string;
  review_comment: string;
  review_star_rating: string;
  review_date: string;
  reviewer_name: string;
  helpful_vote_statement: string;
  vine_customer_review: string;
  verified_purchase: boolean;
}

interface RapidApiReviewsResponse {
  status: string;
  request_id: string;
  asin: string;
  product_title: string;
  country: string;
  total_reviews: number;
  reviews: RapidApiReview[];
}

interface RapidApiOffer {
  offer_id: string;
  offer_price: string;
  offer_shipping_price: string;
  offer_condition: string;
  offer_condition_details: string;
  seller_name: string;
  seller_rating: string;
  seller_num_ratings: number;
  is_prime: boolean;
  is_amazon_fresh: boolean;
  delivery_message: string;
}

interface RapidApiOffersResponse {
  status: string;
  request_id: string;
  asin: string;
  product_title: string;
  country: string;
  total_offers: number;
  offers: RapidApiOffer[];
}

interface RapidApiCategoryResponse {
  status: string;
  request_id: string;
  category: string;
  country: string;
  total_products: number;
  products: RapidApiProduct[];
}

interface ProductData {
  title: string;
  currentPrice: string;
  originalPrice?: string;
  description: string;
  rating?: number;
  reviews?: number;
  category: string;
  keyFeatures: string[];
  specs: Record<string, string>;
  priceHistory: Array<{
    date: string;
    price: string;
    store: string;
  }>;
  metaTags?: string[];
  searchTerms?: string[];
  categories?: string[];
  images?: string[];
  offers?: Array<{
    seller: string;
    price: string;
    condition: string;
    shipping: string;
    isPrime: boolean;
  }>;
  reviewExcerpts?: Array<{
    title: string;
    text: string;
    rating: number;
    date: string;
    verified: boolean;
  }>;
}

export class RapidApiService {
  private static apiKey: string = '';
  private static baseUrl = 'https://real-time-amazon-data.p.rapidapi.com';

  static setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  private static async makeRequest(endpoint: string, params: Record<string, string>): Promise<any> {
    if (!this.apiKey) {
      throw new Error('RapidAPI key not configured');
    }

    const queryString = new URLSearchParams(params).toString();
    const url = `${this.baseUrl}${endpoint}?${queryString}`;

    console.log('Making RapidAPI request to:', endpoint, 'with params:', params);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error(`RapidAPI request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('RapidAPI response:', data);
      
      return data;
    } catch (error) {
      console.error('RapidAPI request error:', error);
      throw error;
    }
  }

  // Product Search
  static async searchProducts(query: string, options: {
    country?: string;
    sortBy?: string;
    condition?: string;
    page?: number;
    isPrime?: boolean;
    fourStarsAndUp?: boolean;
  } = {}): Promise<RapidApiSearchResponse> {
    const params = {
      query,
      country: options.country || 'US',
      sort_by: options.sortBy || 'BEST_SELLERS',
      product_condition: options.condition || 'NEW',
      deals_and_discounts: 'ALL_DISCOUNTS',
      page: (options.page || 1).toString(),
      is_prime: (options.isPrime || false).toString(),
      four_stars_and_up: (options.fourStarsAndUp || true).toString()
    };

    return await this.makeRequest('/search', params);
  }

  // Product Details
  static async getProductDetails(asin: string, country: string = 'US'): Promise<RapidApiProductDetails> {
    const params = {
      asin,
      country
    };

    return await this.makeRequest('/product-details', params);
  }

  // Product Reviews
  static async getProductReviews(asin: string, country: string = 'US', page: number = 1): Promise<RapidApiReviewsResponse> {
    const params = {
      asin,
      country,
      page: page.toString()
    };

    return await this.makeRequest('/product-reviews', params);
  }

  // Product Offers
  static async getProductOffers(asin: string, country: string = 'US'): Promise<RapidApiOffersResponse> {
    const params = {
      asin,
      country
    };

    return await this.makeRequest('/product-offers', params);
  }

  // Products by Category
  static async getProductsByCategory(category: string, country: string = 'US', page: number = 1): Promise<RapidApiCategoryResponse> {
    const params = {
      category,
      country,
      page: page.toString()
    };

    return await this.makeRequest('/products-by-category', params);
  }

  // Enhanced Product Data Extraction
  static async extractProductData(url: string): Promise<ProductData> {
    // Extract ASIN from Amazon URL
    const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/i) || url.match(/\/gp\/product\/([A-Z0-9]{10})/i);
    if (!asinMatch) {
      throw new Error('Could not extract ASIN from Amazon URL');
    }

    const asin = asinMatch[1];
    console.log('Extracted ASIN:', asin);

    try {
      // Fetch comprehensive product data
      const [productDetails, reviews, offers] = await Promise.allSettled([
        this.getProductDetails(asin),
        this.getProductReviews(asin),
        this.getProductOffers(asin)
      ]);

      // Handle product details
      if (productDetails.status !== 'fulfilled') {
        throw new Error('Failed to fetch product details');
      }

      const details = productDetails.value;
      const reviewsData = reviews.status === 'fulfilled' ? reviews.value : null;
      const offersData = offers.status === 'fulfilled' ? offers.value : null;

      return this.transformProductData(details, reviewsData, offersData);
    } catch (error) {
      console.error('Failed to extract comprehensive product data:', error);
      
      // Fallback to search-based extraction
      try {
        const searchResults = await this.searchProducts(asin);
        const product = searchResults.products?.find(p => p.asin === asin) || searchResults.products?.[0];
        
        if (!product) {
          throw new Error('Product not found in search results');
        }

        return this.transformBasicProductData(product);
      } catch (fallbackError) {
        console.error('Fallback extraction also failed:', fallbackError);
        throw new Error('Failed to extract product data from URL');
      }
    }
  }

  private static transformProductData(
    details: RapidApiProductDetails, 
    reviewsData: RapidApiReviewsResponse | null, 
    offersData: RapidApiOffersResponse | null
  ): ProductData {
    const title = details.product_title;
    const currentPrice = details.product_price;
    const originalPrice = details.product_original_price;
    const rating = parseFloat(details.product_star_rating) || undefined;
    const reviews = details.product_num_ratings;

    // Enhanced description from multiple sources
    const description = this.generateEnhancedDescription(details);
    
    // Category from category path
    const category = details.category_path?.length > 0 
      ? details.category_path[details.category_path.length - 1].name 
      : this.detectCategory(title, description);
    
    // Key features from about_product
    const keyFeatures = details.about_product?.slice(0, 5) || this.generateKeyFeatures(details);
    
    // Specs from product details and information
    const specs = this.generateEnhancedSpecs(details);
    
    // Price history (simulated for now)
    const priceHistory = this.generatePriceHistory(currentPrice);
    
    // Meta tags and search terms
    const metaTags = this.generateMetaTags(title, description, category);
    const searchTerms = this.generateSearchTerms(title, description);
    
    // Images
    const images = [details.product_photo, ...(details.product_photos || [])].filter(Boolean);
    
    // Offers
    const offers = offersData?.offers?.map(offer => ({
      seller: offer.seller_name,
      price: offer.offer_price,
      condition: offer.offer_condition,
      shipping: offer.offer_shipping_price,
      isPrime: offer.is_prime
    })) || [];

    // Review excerpts
    const reviewExcerpts = reviewsData?.reviews?.slice(0, 5).map(review => ({
      title: review.review_title,
      text: review.review_comment.substring(0, 200) + '...',
      rating: parseFloat(review.review_star_rating),
      date: review.review_date,
      verified: review.verified_purchase
    })) || [];
    
    return {
      title,
      currentPrice,
      originalPrice,
      description,
      rating,
      reviews,
      category,
      keyFeatures,
      specs,
      priceHistory,
      metaTags,
      searchTerms,
      categories: details.category_path?.map(cat => cat.name) || [category],
      images,
      offers,
      reviewExcerpts
    };
  }

  private static transformBasicProductData(product: RapidApiProduct): ProductData {
    const title = product.product_title;
    const currentPrice = product.product_price;
    const originalPrice = product.product_original_price;
    const rating = parseFloat(product.product_star_rating) || undefined;
    const reviews = product.product_num_ratings;

    // Generate description from available data
    const description = this.generateDescription(product);
    
    // Detect category from title
    const category = this.detectCategory(title, description);
    
    // Generate key features
    const keyFeatures = this.generateKeyFeatures(product);
    
    // Generate specs
    const specs = this.generateSpecs(product);
    
    // Generate price history
    const priceHistory = this.generatePriceHistory(currentPrice);
    
    // Generate meta tags and search terms
    const metaTags = this.generateMetaTags(title, description, category);
    const searchTerms = this.generateSearchTerms(title, description);
    
    return {
      title,
      currentPrice,
      originalPrice,
      description,
      rating,
      reviews,
      category,
      keyFeatures,
      specs,
      priceHistory,
      metaTags,
      searchTerms,
      categories: [category],
      images: [product.product_photo]
    };
  }

  private static generateEnhancedDescription(details: RapidApiProductDetails): string {
    const parts = [];
    
    if (details.product_description) {
      parts.push(details.product_description);
    }
    
    if (details.customers_say) {
      parts.push(`Customers say: ${details.customers_say}`);
    }
    
    if (details.about_product?.length > 0) {
      parts.push(details.about_product.slice(0, 3).join(' '));
    }
    
    return parts.join(' ') || `High-quality ${details.product_title.toLowerCase()} with excellent customer reviews.`;
  }

  private static generateEnhancedSpecs(details: RapidApiProductDetails): Record<string, string> {
    const specs: Record<string, string> = {
      'ASIN': details.asin,
      'Rating': `${details.product_star_rating}/5`,
      'Reviews': details.product_num_ratings.toLocaleString(),
      'Price': details.product_price,
      'Currency': details.currency
    };

    // Add product details
    if (details.product_details) {
      Object.assign(specs, details.product_details);
    }

    // Add product information
    if (details.product_information) {
      Object.assign(specs, details.product_information);
    }

    // Add sales rank
    if (details.sales_rank?.length > 0) {
      details.sales_rank.forEach((rank, index) => {
        specs[`Sales Rank ${index + 1}`] = `#${rank.rank} in ${rank.category}`;
      });
    }

    return specs;
  }

  private static generateDescription(product: RapidApiProduct): string {
    const features = [];
    
    if (product.is_best_seller) features.push('Amazon Best Seller');
    if (product.is_amazon_choice) features.push('Amazon\'s Choice');
    if (product.is_prime) features.push('Prime eligible');
    if (product.climate_pledge_friendly) features.push('Climate Pledge Friendly');
    if (product.sales_volume) features.push(`Popular item: ${product.sales_volume}`);
    if (product.coupon_text) features.push(product.coupon_text);
    if (product.product_badge) features.push(product.product_badge);

    const baseDescription = `High-quality ${product.product_title.toLowerCase()} with excellent customer reviews.`;
    const featuresText = features.length > 0 ? ` Special features: ${features.join(', ')}.` : '';
    const deliveryInfo = product.delivery ? ` ${product.delivery}` : '';

    return baseDescription + featuresText + deliveryInfo;
  }

  private static generateKeyFeatures(product: RapidApiProduct | RapidApiProductDetails): string[] {
    const features = [];

    if ('is_best_seller' in product && product.is_best_seller) features.push('Amazon Best Seller');
    if ('is_amazon_choice' in product && product.is_amazon_choice) features.push('Amazon\'s Choice product');
    if ('climate_pledge_friendly' in product && product.climate_pledge_friendly) features.push('Climate Pledge Friendly certified');
    if ('product_num_ratings' in product && product.product_num_ratings > 1000) features.push(`Highly rated with ${product.product_num_ratings.toLocaleString()} reviews`);
    if ('coupon_text' in product && product.coupon_text) features.push(product.coupon_text);
    if ('sales_volume' in product && product.sales_volume) features.push(`Popular: ${product.sales_volume}`);

    // Add generic features to fill up to 5
    const genericFeatures = [
      'Fast and reliable shipping',
      'Customer satisfaction guaranteed',
      'Quality construction and materials'
    ];

    features.push(...genericFeatures);
    return features.slice(0, 5);
  }

  private static generateSpecs(product: RapidApiProduct): Record<string, string> {
    const specs: Record<string, string> = {
      'ASIN': product.asin,
      'Rating': `${product.product_star_rating}/5`,
      'Reviews': product.product_num_ratings.toLocaleString(),
      'Price': product.product_price,
      'Currency': product.currency
    };

    if (product.product_original_price && product.product_original_price !== product.product_price) {
      specs['Original Price'] = product.product_original_price;
    }

    if (product.unit_count > 1) {
      specs['Unit Count'] = product.unit_count.toString();
      specs['Unit Price'] = product.unit_price;
    }

    if (product.product_byline) {
      specs['Product Details'] = product.product_byline;
    }

    if (product.product_num_offers > 1) {
      specs['Available Offers'] = product.product_num_offers.toString();
      specs['Minimum Offer Price'] = product.product_minimum_offer_price;
    }

    return specs;
  }

  private static generatePriceHistory(currentPrice: string): Array<{date: string; price: string; store: string}> {
    const price = parseFloat(currentPrice.replace(/[^0-9.]/g, ''));
    const variations = [0.95, 1.05, 0.98, 1.02, 0.92];
    
    return variations.map((multiplier, index) => ({
      date: new Date(Date.now() - (index + 1) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      price: `$${(price * multiplier).toFixed(2)}`,
      store: 'Amazon'
    }));
  }

  private static detectCategory(title: string, description: string): string {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('massage') || text.includes('massager')) return 'Health & Personal Care';
    if (text.includes('phone') || text.includes('mobile')) return 'Electronics';
    if (text.includes('laptop') || text.includes('computer')) return 'Computers';
    if (text.includes('headphone') || text.includes('audio')) return 'Audio';
    if (text.includes('camera') || text.includes('photo')) return 'Photography';
    if (text.includes('watch') || text.includes('fitness')) return 'Wearables';
    if (text.includes('home') || text.includes('kitchen')) return 'Home & Garden';
    if (text.includes('clothes') || text.includes('fashion')) return 'Clothing';
    if (text.includes('book') || text.includes('read')) return 'Books';
    if (text.includes('game') || text.includes('toy')) return 'Games & Toys';
    if (text.includes('health') || text.includes('beauty')) return 'Health & Beauty';
    
    return 'General';
  }

  private static generateMetaTags(title: string, description: string, category: string): string[] {
    const text = (title + ' ' + description + ' ' + category).toLowerCase();
    const tags = [];
    
    // Technology tags
    if (text.includes('wireless') || text.includes('bluetooth')) tags.push('wireless');
    if (text.includes('smart') || text.includes('ai')) tags.push('smart');
    if (text.includes('pro') || text.includes('professional')) tags.push('professional');
    if (text.includes('portable') || text.includes('handheld')) tags.push('portable');
    if (text.includes('electric') || text.includes('battery')) tags.push('electric');
    
    // Quality tags
    if (text.includes('premium') || text.includes('luxury')) tags.push('premium');
    if (text.includes('budget') || text.includes('affordable')) tags.push('budget');
    if (text.includes('best seller')) tags.push('popular');
    if (text.includes('climate pledge')) tags.push('eco-friendly');
    
    // Health & wellness specific
    if (text.includes('massage') || text.includes('therapy')) tags.push('wellness');
    if (text.includes('pain relief') || text.includes('muscle')) tags.push('therapeutic');
    
    return [...new Set(tags)]; // Remove duplicates
  }

  private static generateSearchTerms(title: string, description: string): string[] {
    const text = (title + ' ' + description).toLowerCase();
    const words = text.split(/\s+/).filter(word => 
      word.length > 2 && 
      !['the', 'and', 'for', 'with', 'this', 'that', 'from', 'are', 'you', 'all', 'can', 'her', 'him'].includes(word)
    );
    
    return [...new Set(words)]; // Remove duplicates
  }
}
