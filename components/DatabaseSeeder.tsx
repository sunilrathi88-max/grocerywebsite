import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { MOCK_PRODUCTS } from '../data';

const DatabaseSeeder: React.FC = () => {
  const [status, setStatus] = useState<string>('Idle');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const seedDatabase = async () => {
    setIsLoading(true);
    setStatus('Starting migration...');
    setError(null);

    try {
      // 1. Clear existing data (optional, be careful!)
      // await supabase.from('qna').delete().neq('id', 0);
      // await supabase.from('reviews').delete().neq('id', 0);
      // await supabase.from('variants').delete().neq('id', 0);
      // await supabase.from('products').delete().neq('id', 0);

      let successCount = 0;

      for (const product of MOCK_PRODUCTS) {
        setStatus(`Migrating product: ${product.name}...`);

        // Insert Product
        const { error: productError } = await supabase.from('products').upsert({
          id: product.id,
          name: product.name,
          description: product.description,
          category: product.category,
          images: product.images,
          videos: product.videos,
          nutrition: product.nutrition,
          origin: product.origin,
          harvest_date: product.harvestDate,
          grade: product.grade,
          purity_test: product.purityTest,
          storage: product.storage,
          shelf_life: product.shelfLife,
          grind: product.grind,
          tags: product.tags,
        });

        if (productError) throw new Error(`Product error: ${productError.message}`);

        // Insert Variants
        if (product.variants) {
          for (const variant of product.variants) {
            const { error: variantError } = await supabase.from('variants').upsert({
              id: variant.id,
              product_id: product.id,
              name: variant.name,
              price: variant.price,
              sale_price: variant.salePrice,
              stock: variant.stock,
            });
            if (variantError) throw new Error(`Variant error: ${variantError.message}`);
          }
        }

        // Insert Reviews
        if (product.reviews) {
          for (const review of product.reviews) {
            const { error: reviewError } = await supabase.from('reviews').upsert({
              id: review.id,
              product_id: product.id,
              author: review.author,
              rating: review.rating,
              comment: review.comment,
              verified_purchase: review.verifiedPurchase,
              date: review.date,
              images: review.images,
              helpful: review.helpful,
            });
            if (reviewError) throw new Error(`Review error: ${reviewError.message}`);
          }
        }

        // Insert QnA
        if (product.qna) {
          for (const q of product.qna) {
            const { error: qnaError } = await supabase.from('qna').upsert({
              id: q.id,
              product_id: product.id,
              author: q.author,
              question: q.question,
              answer: q.answer,
              date: q.date,
            });
            if (qnaError) throw new Error(`QnA error: ${qnaError.message}`);
          }
        }

        successCount++;
      }

      setStatus(`Migration Complete! Successfully migrated ${successCount} products.`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setStatus('Migration Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-6 rounded-lg shadow-xl border border-gray-200 z-50 max-w-sm">
      <h3 className="font-bold text-lg mb-2">Database Seeder</h3>
      <p className="text-sm text-gray-600 mb-4">
        Migrate local mock data to Supabase. Ensure tables are created first.
      </p>

      {error && <div className="bg-red-50 text-red-600 p-2 rounded text-sm mb-4">{error}</div>}

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-800">
          Status: <span className="font-normal">{status}</span>
        </p>
      </div>

      <button
        onClick={seedDatabase}
        disabled={isLoading}
        className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
          isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-primary hover:bg-brand-dark'
        }`}
      >
        {isLoading ? 'Migrating...' : 'Start Migration'}
      </button>
    </div>
  );
};

export default DatabaseSeeder;
