import React, { useMemo } from 'react';
import { Product, Variant } from '../types';
import ProductSlider from './ProductSlider';
import { useViewingHistory } from '../hooks/useViewingHistory';
import { getPersonalizedSuggestions } from '../utils/recommendations';

interface RecommendedProductsProps {
  allProducts: Product[];
  onAddToCart: (product: Product, variant: Variant, quantity?: number) => void;
  onSelectProduct: (product: Product) => void;
  onNotifyMe: (productName: string) => void;
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({
  allProducts,
  onAddToCart,
  onSelectProduct,
  onNotifyMe,
}) => {
  const { viewedProducts } = useViewingHistory();

  const recommendations = useMemo(() => {
    // Use the unified recommendation logic
    return getPersonalizedSuggestions(viewedProducts, allProducts, 8);
  }, [viewedProducts, allProducts]);

  if (recommendations.length === 0 && viewedProducts.length === 0) return null;

  // Fallback: If we have history but no specific recommendations (rare), show history?
  // Or just show nothing. For now, let's show "Recently Viewed" if we can't find similar.
  // Actually usually we want recommendations.

  const displayProducts = recommendations.length > 0 ? recommendations : viewedProducts;
  const title = recommendations.length > 0 ? 'Recommended for You' : 'Recently Viewed';

  return (
    <section className="py-16 bg-gradient-to-b from-white to-brand-accent/20">
      <div className="container mx-auto px-4">
        <ProductSlider
          title={title}
          products={displayProducts}
          onAddToCart={onAddToCart}
          onToggleWishlist={() => {}} // Optional here
          wishlistedIds={new Set()}
          onSelectProduct={onSelectProduct}
          onNotifyMe={onNotifyMe}
        />
      </div>
    </section>
  );
};

export default RecommendedProducts;
