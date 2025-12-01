import React from 'react';
import { Product, Variant } from '../types';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product, variant: Variant) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistedIds: Set<number>;
  onSelectProduct: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  comparisonIds: Set<number>;
  isLoading: boolean;
  onNotifyMe: (productName: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAddToCart,
  onToggleWishlist,
  wishlistedIds,
  onSelectProduct,
  onToggleCompare,
  comparisonIds,
  isLoading,
  onNotifyMe,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in-up">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-3xl font-serif font-bold text-gray-900 mb-2">No Products Found</h3>
          <p className="text-lg text-gray-500">Try adjusting your filters or search query.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
      {products.map((product, index) => (
        <div key={product.id} className="w-full">
          <ProductCard
            product={product}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
            isWishlisted={wishlistedIds.has(product.id)}
            onSelectProduct={onSelectProduct}
            onToggleCompare={onToggleCompare}
            isCompared={comparisonIds.has(product.id)}
            onNotifyMe={onNotifyMe}
            priority={index < 4 ? 'high' : 'auto'}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
