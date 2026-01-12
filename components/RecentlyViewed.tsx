import React, { useState } from 'react';
import { Product, Variant } from '../types';
import { OptimizedImage } from './OptimizedImage';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { useViewingHistory } from '../hooks/useViewingHistory';

interface RecentlyViewedProps {
  currentProductId?: number;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, variant: Variant) => void;
  className?: string;
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
  currentProductId,
  onSelectProduct,
  onAddToCart,
  className = '',
}) => {
  const { viewedProducts } = useViewingHistory();
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Filter out the current product
  const products = viewedProducts.filter((p) => p.id !== currentProductId);

  if (products.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = 280;
      const newPosition =
        direction === 'left'
          ? Math.max(0, scrollPosition - scrollAmount)
          : scrollPosition + scrollAmount;
      containerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  return (
    <section className={`py-12 bg-neutral-50 ${className}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-bold text-neutral-900">Recently Viewed</h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-white shadow hover:shadow-md transition-shadow"
              aria-label="Scroll left"
            >
              <ChevronLeftIcon className="w-5 h-5 text-neutral-600" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-white shadow hover:shadow-md transition-shadow"
              aria-label="Scroll right"
            >
              <ChevronRightIcon className="w-5 h-5 text-neutral-600" />
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-[200px] bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => onSelectProduct(product)}
            >
              <div className="aspect-square rounded-t-xl overflow-hidden bg-neutral-100">
                <OptimizedImage
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  type="thumbnail"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-neutral-800 text-sm line-clamp-2 mb-1">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-brand-primary">₹{product.variants[0]?.price}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (product.variants[0]) {
                        onAddToCart(product, product.variants[0]);
                      }
                    }}
                    className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium hover:bg-amber-200 transition-colors"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;
