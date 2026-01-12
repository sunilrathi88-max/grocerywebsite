import React from 'react';
import { Product, Variant } from '../../types';
import MobileProductCard from './MobileProductCard';

interface MobileFeaturedSectionProps {
  title: string;
  products: Product[];
  onAddToCart: (product: Product, variant: Variant) => void;
  onToggleWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  wishlistedIds: Set<number>;
  onViewAll?: () => void;
}

const MobileFeaturedSection: React.FC<MobileFeaturedSectionProps> = ({
  title,
  products,
  onAddToCart,
  onToggleWishlist,
  onSelectProduct,
  wishlistedIds,
  onViewAll,
}) => {
  return (
    <section className="mt-8">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-4">
        <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">{title}</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-amber-600 text-sm font-medium flex items-center"
          >
            View All
            <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Horizontal Scroll Container */}
      <div className="flex overflow-x-auto space-x-4 px-4 pb-6 no-scrollbar snap-x snap-mandatory">
        {products.map((product) => (
          <MobileProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
            onSelectProduct={onSelectProduct}
            isWishlisted={wishlistedIds.has(product.id)}
          />
        ))}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default MobileFeaturedSection;
