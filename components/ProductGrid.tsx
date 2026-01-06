import React, { useState, useMemo } from 'react';
import { Product, Variant } from '../types';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import { trackEvent } from '../utils/analytics';
import { CategorySEO } from './CategorySEO';

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
  onClearFilters?: () => void;
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
  onClearFilters,
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
                id={product.id.toString()}
                name={product.name}
                price={product.variants[0]?.salePrice || product.variants[0]?.price}
                originalPrice={
                  product.variants[0]?.salePrice ? product.variants[0]?.price : undefined
                }
                image={product.images[0]}
                rating={product.rating || 0}
                reviewCount={product.reviews.length}
                heatLevel="medium" // Default or derive from tags
                useCase={product.category}
                sizes={product.variants.map((v) => ({
                  size: v.name,
                  price: v.salePrice || v.price,
                }))}
                onAddToCart={(id) => {
                  const p = products.find((prod) => prod.id.toString() === id);
                  if (p && p.variants[0]) {
                    trackEvent({
                      name: 'add_to_cart',
                      data: {
                        id: p.id,
                        name: p.name,
                        price: p.variants[0].salePrice || p.variants[0].price,
                      },
                    });
                    onAddToCart(p, p.variants[0]);
                  }
                }}
                onWishlist={(id) => {
                  const p = products.find((prod) => prod.id.toString() === id);
                  if (p) onToggleWishlist(p);
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200 flex flex-col items-center">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <span className="text-4xl">🔍</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
          <p className="text-neutral-500 mb-6 max-w-md mx-auto">
            We couldn&apos;t find any products matching your filters. Try adjusting your search or
            filters.
          </p>
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="px-6 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition-all shadow-md active:transform active:scale-95"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}

      {/* Category SEO Content */}
      {enableFilters && <CategorySEO category={activeFilter} />}
    </div>
  );
};

export default ProductGrid;
