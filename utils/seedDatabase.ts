/* eslint-disable no-console */
import { MOCK_PRODUCTS } from '../data';
import { productAPI } from './apiService';

/**
 * Seeds the database with mock products.
 * This is a one-time utility to populate Supabase.
 */
export const seedDatabase = async () => {
  console.log('🌱 Starting Database Seeding...');
  let successCount = 0;
  let failCount = 0;

  for (const product of MOCK_PRODUCTS) {
    try {
      console.log(`Processing: ${product.name}...`);

      // 1. Create Product
      // Note: We strip ID because Supabase generates SERIAL IDs,
      // or we can force insert if we adjust the API, but let's let DB handle IDs.
      // We also need to map our Frontend `Product` type to what `productAPI.create` expects.

      const productData = {
        ...product,
        id: undefined, // Remove ID to let DB generate one
        // Ensure arrays are initialized
        images: product.images || [],
        videos: product.videos || [],
        tags: product.tags || [],
        // Reviews and QnA are handled separately via their own tables/API calls usually,
        // but our `productAPI.create` in apiService might be simple.
        // Let's check `apiService.ts` implementation:
        // It only inserts into `products` table.
        // Variants need to be inserted into `variants` table manually or if the API handles it.
        // Looking at previous `apiService.ts`, `create` only does `products` table insert.
        // We might need to extend this script to insert variants/reviews manually or update API.
      };

      // Create valid product object for API
      // Our MOCK_DATA has `variants` inside product, but API `create` might ignore them if not coded.
      // We will perform a basic insert first.

      // Since `productAPI.create` is currently simple (just products table),
      // we need to be careful. The `variants` table exists now.
      // We should probably allow the API to return the NEW ID.

      const newProduct = await productAPI.create(
        // @ts-expect-error - passing Omit<Product, 'id'> roughly
        productData
      );

      if (newProduct && newProduct.id) {
        console.log(`✅ Created Product: ${newProduct.name} (ID: ${newProduct.id})`);

        // 2. Insert Variants
        // We need a way to insert variants. `productAPI` might not have `addVariant`.
        // We might need to call supabase directly here or add `addVariant` to API.
        // For this seed script, let's assume we can use the `getSupabase` helper from apiService
        // if we export it, OR we just update the `seedDatabase` to import supabase client directly?
        // Better: Let's assume `productAPI` needs an update or we do it here.
        // Let's try to do it via a direct Supabase call in this file to avoid changing API just for seeding.

        const { supabase } = await import('../supabaseClient');

        if (product.variants && product.variants.length > 0) {
          const variantsToInsert = product.variants.map((v) => ({
            product_id: newProduct.id,
            name: v.name,
            price: v.price,
            stock: v.stock,
            // Add other fields if schema has them
          }));

          const { error: varError } = await supabase.from('variants').insert(variantsToInsert);
          if (varError)
            console.error(`   ❌ Failed to insert variants for ${product.name}:`, varError.message);
          else console.log(`   Detailed variants inserted.`);
        }

        // 3. Insert Reviews
        if (product.reviews && product.reviews.length > 0) {
          const reviewsToInsert = product.reviews.map((r) => ({
            product_id: newProduct.id,
            author: r.author,
            rating: r.rating,
            comment: r.comment,
            verified_purchase: r.verifiedPurchase,
            date: r.date,
            helpful: r.helpful || 0,
          }));
          const { error: revError } = await supabase.from('reviews').insert(reviewsToInsert);
          if (revError) console.error(`   ❌ Failed to insert reviews:`, revError.message);
        }

        successCount++;
      } else {
        console.error(`❌ Failed to create product: ${product.name} (No ID returned)`);
        failCount++;
      }
    } catch (error) {
      console.error(`❌ Error seeding ${product.name}:`, error);
      failCount++;
    }
  }

  console.log(`\n🏁 Seeding Complete. Success: ${successCount}, Failed: ${failCount}`);
  return { successCount, failCount };
};
