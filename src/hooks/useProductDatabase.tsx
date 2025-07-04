import { supabase } from '@/integrations/supabase/client';
import { RapidApiProduct } from '@/types/rapidApi';

export const useProductDatabase = () => {
  const updateDatabase = async (selectedProducts: RapidApiProduct[]) => {
    if (selectedProducts.length === 0) {
      return { success: false, error: 'No products selected for database update' };
    }

    try {
      let savedCount = 0;
      let updatedCount = 0;

      for (const product of selectedProducts) {
        // Transform RapidAPI product to database format
        const priceValue = parseFloat(product.product_price?.replace(/[^0-9.]/g, '') || '0');
        const salePriceValue = product.product_original_price ? parseFloat(product.product_original_price.replace(/[^0-9.]/g, '') || '0') : null;
        
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
          specifications: {
            star_rating: product.product_star_rating,
            num_ratings: product.product_num_ratings,
            byline: product.product_byline,
            availability: product.product_availability,
            url: product.product_url,
            is_best_seller: product.is_best_seller,
            is_amazon_choice: product.is_amazon_choice,
            is_prime: product.is_prime,
            climate_pledge_friendly: product.climate_pledge_friendly
          },
          attributes: {
            bestseller: product.is_best_seller,
            amazonChoice: product.is_amazon_choice,
            prime: product.is_prime,
            climatePledge: product.climate_pledge_friendly
          },
          price_history: JSON.stringify([{
            date: new Date().toISOString(),
            price: priceValue,
            source: 'rapidapi'
          }])
        };

        // Check if product exists by ASIN
        const { data: existingProduct } = await supabase
          .from('products')
          .select('id, price')
          .eq('asin', product.asin)
          .maybeSingle();

        if (existingProduct) {
          // Update existing product
          const { error } = await supabase
            .from('products')
            .update(productData)
            .eq('id', existingProduct.id);

          if (error) {
            console.error('Error updating product:', error);
            continue;
          }
          updatedCount++;

          // Save API snapshot
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

          // Save API snapshot
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