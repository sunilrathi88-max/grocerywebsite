import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { SAMPLE_PRODUCTS } from '../lib/sampleProductData';

const DatabaseSeeder: React.FC = () => {
  const [status, setStatus] = useState<string>('Idle');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const seedDatabase = async () => {
    setIsLoading(true);
    setStatus('Starting database seeding...');
    setError(null);

    try {
      let successCount = 0;

      // Get a category ID (you'll need to have categories in your DB first)
      // For demo purposes, we'll use a placeholder UUID
      const defaultCategoryId = '00000000-0000-0000-0000-000000000001';

      for (const product of SAMPLE_PRODUCTS) {
        setStatus(`Seeding product: ${product.name}...`);

        // Prepare product data with all new fields
        const productData = {
          // Core fields
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          stock: product.stock,
          status: product.status || 'active',
          images: product.images,
          category_id: defaultCategoryId, // Update with actual category

          // Existing custom fields
          weight: product.weight_value,
          sku: product.sku,
          origin: product.origin_country,
          grade: product.grade,
          certification: product.certifications?.join(', '),
          spicelevel: product.spicelevel,

          // New e-commerce fields
          tags: product.tags,
          brand: product.brand,
          barcode: product.barcode,
          featured: product.featured || false,
          bestseller: product.bestseller || false,
          new_arrival: product.new_arrival || false,
          discount_percent: product.discount_percent,
          compare_price: product.compare_price,
          min_order_qty: product.min_order_qty || 1,
          max_order_qty: product.max_order_qty,
          rating: product.rating || 0,
          review_count: product.review_count || 0,
          meta_title: product.meta_title,
          meta_description: product.meta_description,

          // Weight & dimensions
          weight_value: product.weight_value,
          weight_unit: product.weight_unit,
          dimensions: product.dimensions,

          // Product specifics
          origin_country: product.origin_country,
          certifications: product.certifications,
          allergen_info: product.allergen_info,
          nutritional_info: product.nutritional_info,

          // Timestamps
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Insert product
        const { error: productError } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single();

        if (productError) {
          throw new Error(`Product "${product.name}" error: ${productError.message}`);
        }

        successCount++;
      }

      setStatus(
        `✅ Seeding Complete! Successfully seeded ${successCount}/${SAMPLE_PRODUCTS.length} products.`
      );
    } catch (err) {
      console.error('Seeding error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setStatus('❌ Seeding Failed');
    } finally {
      setIsLoading(false);
    }
  };

  const clearProducts = async () => {
    if (
      !window.confirm('⚠️ Are you sure you want to delete ALL products? This cannot be undone!')
    ) {
      return;
    }

    setIsLoading(true);
    setStatus('Clearing products...');
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all except fake ID

      if (deleteError) throw deleteError;

      setStatus('✅ All products cleared successfully');
    } catch (err) {
      console.error('Clear error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setStatus('❌ Clear Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-6 rounded-lg shadow-xl border border-gray-200 z-50 max-w-md">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
        <span className="text-2xl">🌱</span>
        Database Seeder
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Seed your Supabase database with {SAMPLE_PRODUCTS.length} sample products.
        <br />
        <span className="text-xs text-gray-500">
          Ensure all database columns exist before seeding.
        </span>
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-sm mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="mb-4 p-3 bg-gray-50 rounded">
        <p className="text-sm font-medium text-gray-800">
          Status: <span className="font-normal text-gray-600">{status}</span>
        </p>
      </div>

      <div className="space-y-2">
        <button
          onClick={seedDatabase}
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isLoading ? '⏳ Seeding...' : '🚀 Seed Database'}
        </button>

        <button
          onClick={clearProducts}
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {isLoading ? '⏳ Clearing...' : '🗑️ Clear All Products'}
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>📦 Products to seed:</p>
        <ul className="list-disc list-inside mt-1 space-y-0.5">
          {SAMPLE_PRODUCTS.map((p, i) => (
            <li key={i}>{p.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DatabaseSeeder;
