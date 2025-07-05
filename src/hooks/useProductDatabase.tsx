import { supabase } from '@/integrations/supabase/client';
import { RapidApiProduct } from '@/types/rapidApi';
import { RapidApiService } from '@/services/rapidApi';

export const useProductDatabase = () => {
  // Helper function to convert Amazon URL to affiliate URL
  const createAffiliateUrl = (originalUrl: string, asin: string) => {
    // Extract the base Amazon URL and add affiliate tag
    const baseUrl = originalUrl.split('?')[0]; // Remove existing query params
    return `${baseUrl}?tag=homefitrecove-20`; // Add your affiliate tag
  };

  const updateDatabase = async (selectedProducts: RapidApiProduct[]) => {
    if (selectedProducts.length === 0) {
      return { success: false, error: 'No products selected for database update' };
    }

    try {
      let savedCount = 0;
      let updatedCount = 0;

      // First, enhance all products with real review data
      console.log('Fetching real review data for', selectedProducts.length, 'products...');
      const enhancedProducts = await Promise.all(
        selectedProducts.map(async (product, index) => {
          try {
            console.log(`Fetching reviews for product ${index + 1}/${selectedProducts.length}: ${product.product_title}`);
            const reviewsResponse = await RapidApiService.getProductReviews(product.asin, 'US', 1);
            
            const topReviews = reviewsResponse.reviews?.slice(0, 2) || [];
            
            return {
              ...product,
              // Add fetched review data
              review_1_text: topReviews[0]?.review_comment || '',
              review_1_title: topReviews[0]?.review_title || '',
              review_1_rating: topReviews[0]?.review_star_rating || '',
              review_2_text: topReviews[1]?.review_comment || '',
              review_2_title: topReviews[1]?.review_title || '',
              review_2_rating: topReviews[1]?.review_star_rating || '',
              total_reviews_fetched: reviewsResponse.total_reviews || 0
            };
          } catch (error) {
            console.error(`Failed to fetch reviews for ${product.asin}:`, error);
            return {
              ...product,
              review_1_text: '',
              review_1_title: '',
              review_1_rating: '',
              review_2_text: '', 
              review_2_title: '',
              review_2_rating: '',
              total_reviews_fetched: 0
            };
          }
        })
      );

      for (const product of enhancedProducts) {
        // Transform RapidAPI product to database format
        const priceValue = parseFloat(product.product_price?.replace(/[^0-9.]/g, '') || '0');
        const salePriceValue = product.product_original_price ? parseFloat(product.product_original_price.replace(/[^0-9.]/g, '') || '0') : null;
        
        // Create affiliate URL with your tag
        const affiliateUrl = createAffiliateUrl(product.product_url, product.asin);

        // Check if product exists by ASIN
        const { data: existingProduct } = await supabase
          .from('products')
          .select('id, price, price_history')
          .eq('asin', product.asin)
          .maybeSingle();

        // Prepare price history
        let priceHistory = [];
        if (existingProduct?.price_history) {
          try {
            priceHistory = typeof existingProduct.price_history === 'string' 
              ? JSON.parse(existingProduct.price_history) 
              : existingProduct.price_history;
          } catch (e) {
            priceHistory = [];
          }
        }

        // Add new price entry if price has changed
        const lastPrice = priceHistory.length > 0 ? priceHistory[priceHistory.length - 1].price : null;
        if (lastPrice !== priceValue) {
          priceHistory.push({
            date: new Date().toISOString(),
            price: priceValue,
            source: 'rapidapi'
          });
        }

        const productData = {
          name: product.product_title,
          description: product.product_byline || product.product_title,
          price: priceValue || null,
          sale_price: salePriceValue && salePriceValue !== priceValue ? salePriceValue : null,
          rating: parseFloat(product.product_star_rating) || null,
          image_url: product.product_photo,
          slug: product.product_title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          asin: product.asin,
          api_source: 'rapidapi',
          api_last_updated: new Date().toISOString(),
          availability: product.product_availability !== 'Currently unavailable',
          in_stock: product.product_availability !== 'Currently unavailable',
          affiliate_url: affiliateUrl, // Use your affiliate URL
          specifications: {
            star_rating: product.product_star_rating,
            num_ratings: product.product_num_ratings,
            byline: product.product_byline,
            availability: product.product_availability,
            original_url: product.product_url, // Keep original for reference
            is_best_seller: product.is_best_seller,
            is_amazon_choice: product.is_amazon_choice,
            is_prime: product.is_prime,
            climate_pledge_friendly: product.climate_pledge_friendly,
            // Store real review data from API
            review_1_text: (product as any).review_1_text || '',
            review_1_title: (product as any).review_1_title || '',
            review_1_rating: (product as any).review_1_rating || '',
            review_2_text: (product as any).review_2_text || '',
            review_2_title: (product as any).review_2_title || '',
            review_2_rating: (product as any).review_2_rating || '',
            total_reviews_fetched: (product as any).total_reviews_fetched || 0
          },
          attributes: {
            bestseller: product.is_best_seller,
            amazonChoice: product.is_amazon_choice,
            prime: product.is_prime,
            climatePledge: product.climate_pledge_friendly
          },
          price_history: JSON.stringify(priceHistory)
        };

        if (existingProduct) {
          // Update existing product with latest data
          const { error } = await supabase
            .from('products')
            .update(productData)
            .eq('id', existingProduct.id);

          if (error) {
            console.error('Error updating product:', error);
            continue;
          }
          updatedCount++;

          // Save API snapshot for historical tracking
          await supabase.from('product_api_snapshots').insert({
            product_id: existingProduct.id,
            asin: product.asin,
            api_source: 'rapidapi',
            raw_data: JSON.parse(JSON.stringify(product)),
            price_at_time: priceValue,
            availability_at_time: productData.availability
          });
        } else {
          // Create new product
          const { data: newProduct, error } = await supabase
            .from('products')
            .insert(productData)
            .select('id')
            .single();

          if (error) {
            console.error('Error creating product:', error);
            continue;
          }
          savedCount++;

          // Save API snapshot for new product
          if (newProduct) {
            await supabase.from('product_api_snapshots').insert({
              product_id: newProduct.id,
              asin: product.asin,
              api_source: 'rapidapi',
              raw_data: JSON.parse(JSON.stringify(product)),
              price_at_time: priceValue,
              availability_at_time: productData.availability
            });
          }
        }
      }

      return { success: true, savedCount, updatedCount, total: selectedProducts.length };
    } catch (error) {
      console.error('Database update failed:', error);
      return { success: false, error: 'Failed to update database. Please try again.' };
    }
  };

  return {
    updateDatabase
  };
};