export interface RapidApiProduct {
  asin: string;
  product_title: string;
  product_price: string;
  unit_price: string;
  unit_count: number;
  product_original_price?: string;
  product_price_max?: string;
  currency: string;
  country?: string;
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
  product_description?: string;
  about_product?: string[];
  customers_say?: string;
  product_slug?: string;
  standing_screen_display_size?: string;
  memory_storage_capacity?: string;
  ram_memory_installed_size?: string;
}

export interface RapidApiSearchResponse {
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

export interface RapidApiProductDetails {
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

export interface RapidApiReview {
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

export interface RapidApiReviewsResponse {
  status: string;
  request_id: string;
  asin: string;
  product_title: string;
  country: string;
  total_reviews: number;
  reviews: RapidApiReview[];
}

export interface RapidApiOffer {
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

export interface RapidApiOffersResponse {
  status: string;
  request_id: string;
  asin: string;
  product_title: string;
  country: string;
  total_offers: number;
  offers: RapidApiOffer[];
}

export interface RapidApiCategoryResponse {
  status: string;
  request_id: string;
  category: string;
  country: string;
  total_products: number;
  products: RapidApiProduct[];
}

export interface RapidApiDeal {
  deal_id: string;
  deal_type: string;
  deal_title: string;
  deal_photo: string;
  deal_state: string;
  deal_url: string;
  canonical_deal_url: string;
  deal_starts_at: string;
  deal_ends_at: string;
  deal_price: {
    amount: string;
    currency: string;
  };
  list_price: {
    amount: string;
    currency: string;
  };
  savings_percentage: number;
  savings_amount: {
    amount: string;
    currency: string;
  };
  deal_badge: string;
  type: string;
  product_asin: string;
}

export interface RapidApiDealsResponse {
  status: string;
  request_id: string;
  country: string;
  total_deals: number;
  deals: RapidApiDeal[];
}

export interface ProductData {
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
