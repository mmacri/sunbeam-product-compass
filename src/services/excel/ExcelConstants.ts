// Excel export constants and configurations

export const USER_TEMPLATE_HEADERS = [
  'affiliate_link', 'title', 'image_url', 'gallery_image_urls', 'description', 'price', 'sale_price', 
  'rating', 'review_1', 'review_2', 'category', 'tags', 'sku', 'status', 'date_added', 'cta',
  'affiliate_network', 'commission_rate', 'availability', 'in_stock', 'specifications', 'custom_attributes', 'action',
  'brand', 'model', 'color', 'size', 'weight', 'dimensions', 'material', 'warranty', 'manufacturer',
  'upc', 'isbn', 'shipping_weight', 'package_dimensions', 'item_weight', 'product_dimensions',
  'batteries_required', 'batteries_included', 'assembly_required', 'country_of_origin', 'target_audience',
  'age_range', 'style', 'pattern', 'features', 'compatibility', 'certification', 'energy_efficiency'
];

export const ADDITIONAL_API_FIELDS = [
  'asin', 'product_title', 'unit_price', 'unit_count', 'currency', 'product_num_ratings', 'sales_volume',
  'product_url', 'product_photo', 'product_num_offers', 'product_minimum_offer_price', 'is_best_seller', 
  'is_amazon_choice', 'is_prime', 'climate_pledge_friendly', 'has_variations', 'delivery', 'product_byline', 
  'coupon_text', 'product_badge', 'product_original_price', 'standing_screen_display_size', 
  'memory_storage_capacity', 'ram_memory_installed_size'
];

export const ALL_HEADERS = [...USER_TEMPLATE_HEADERS, ...ADDITIONAL_API_FIELDS];