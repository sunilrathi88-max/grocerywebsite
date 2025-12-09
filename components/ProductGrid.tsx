import React, { useState, useMemo } from 'react';
import { Product, Variant } from '../types';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import { trackEvent } from '../utils/analytics';

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
  enableFilters?: boolean; // New prop to enable homepage-style filtering
  title?: string; // Optional title
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
  enableFilters = false,
  title,
}) => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Spices', 'Nuts', 'Gift Boxes'];

  const filteredProducts = useMemo(() => {
    if (!enableFilters || activeFilter === 'All') return products;
    return products.filter((p) => p.category === activeFilter || p.category.includes(activeFilter));
  }, [products, activeFilter, enableFilters]);

  const displayProducts = enableFilters ? filteredProducts : products;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-10">
      {/* Header & Filters (Conditional) */}
      {(title || enableFilters) && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {title && (
            <h2 className="text-4xl font-serif font-bold text-neutral-900 text-center md:text-left">
              {title}
            </h2>
          )}

          {enableFilters && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar max-w-full">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                    ${
                      activeFilter === filter
                        ? 'bg-brand-dark text-white shadow-lg'
                        : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
                    }
                  `}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Grid */}
      {displayProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {displayProducts.map((product) => (
            <div key={product.id} className="w-full">
              <ProductCard
                product={product}
                onAddToCart={(p, v) => {
                  trackEvent({
                    name: 'add_to_cart',
                    data: { id: p.id, name: p.name, price: v.salePrice || v.price },
                  });
                  onAddToCart(p, v);
                }}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistedIds.has(product.id)}
                onSelectProduct={(p) => {
                  trackEvent({ name: 'product_click', data: { id: p.id, name: p.name } });
                  onSelectProduct(p);
                }}
                onToggleCompare={onToggleCompare}
                isCompared={comparisonIds.has(product.id)}
                onNotifyMe={onNotifyMe}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
          <p className="text-neutral-500">No products found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
