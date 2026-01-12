import React from 'react';
import { Product, Variant } from '../../types';
import { HeartIcon } from '../icons/HeartIcon';
import { StarIcon } from '../icons/StarIcon';
import { OptimizedImage } from '../OptimizedImage';

interface MobileProductGridProps {
  products: Product[];
  onAddToCart: (product: Product, variant: Variant) => void;
  onToggleWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  wishlistedIds: Set<number>;
  resultCount?: number;
  sortLabel?: string;
  onSortClick?: () => void;
}

const MobileProductGrid: React.FC<MobileProductGridProps> = ({
  products,
  onAddToCart,
  onToggleWishlist,
  onSelectProduct,
  wishlistedIds,
  resultCount,
  sortLabel = 'Popularity',
  onSortClick,
}) => {
  // Get spice level emoji from tags
  const getSpiceLevel = (product: Product): string => {
    const tags = product.tags || [];
    if (tags.includes('extra-spicy') || tags.includes('extra spicy')) return '🌶️🌶️🌶️🌶️';
    if (tags.includes('spicy') || tags.includes('hot')) return '🌶️🌶️🌶️';
    if (tags.includes('medium')) return '🌶️🌶️';
    if (tags.includes('mild')) return '🌶️';
    return '';
  };

  return (
    <main className="flex-1 px-4 py-4">
      {/* Results Header */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
          {resultCount !== undefined
            ? `${resultCount} results found`
            : `${products.length} products`}
        </p>
        {onSortClick && (
          <button
            onClick={onSortClick}
            className="flex items-center gap-1 text-sm font-medium text-amber-600"
          >
            <span>{sortLabel}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-4 pb-20">
        {products.map((product) => {
          const variant = product.variants[0];
          const price = variant?.salePrice || variant?.price || 0;
          const originalPrice = variant?.salePrice ? variant?.price : null;
          const rating = product.rating || 4.5;
          const reviewCount = product.reviews?.length || 0;
          const isWishlisted = wishlistedIds.has(product.id);
          const isBestseller = product.tags?.includes('bestseller');

          return (
            <div
              key={product.id}
              className="group flex flex-col gap-3 rounded-xl bg-white dark:bg-stone-800 p-3 shadow-sm border border-transparent dark:border-stone-700 transition-all hover:shadow-md"
            >
              {/* Product Image */}
              <div
                className="relative w-full aspect-[4/5] overflow-hidden rounded-lg bg-amber-50 dark:bg-stone-700 cursor-pointer"
                onClick={() => onSelectProduct(product)}
              >
                {/* Wishlist Button */}
                <div className="absolute right-2 top-2 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm text-stone-500 hover:text-red-500 transition-colors"
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <HeartIcon
                      className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
                    />
                  </button>
                </div>

                {/* Product Image */}
                <OptimizedImage
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  width={200}
                  height={250}
                />

                {/* Bestseller Badge */}
                {isBestseller && (
                  <div className="absolute left-2 bottom-2 rounded-md bg-yellow-100 px-2 py-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-yellow-800">
                      Bestseller
                    </p>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col gap-1">
                {/* Rating */}
                <div className="flex items-center gap-1">
                  <StarIcon className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold text-stone-900 dark:text-white">
                    {rating.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400">
                    ({reviewCount > 1000 ? `${(reviewCount / 1000).toFixed(1)}k` : reviewCount})
                  </span>
                </div>

                {/* Product Name */}
                <h3
                  className="text-base font-bold leading-tight text-stone-900 dark:text-white line-clamp-2 cursor-pointer"
                  onClick={() => onSelectProduct(product)}
                >
                  {product.name}
                </h3>

                {/* Description with Spice Level */}
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {product.origin || product.category} • {getSpiceLevel(product)}
                </p>

                {/* Price & Add Button */}
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex flex-col">
                    {originalPrice && (
                      <span className="text-xs text-stone-400 line-through dark:text-stone-500">
                        ₹{originalPrice}
                      </span>
                    )}
                    <span className="text-lg font-bold text-stone-900 dark:text-white">
                      ₹{price}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (variant) onAddToCart(product, variant);
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600 text-white shadow-md active:scale-95 transition-transform hover:bg-amber-700"
                    aria-label="Add to cart"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default MobileProductGrid;
