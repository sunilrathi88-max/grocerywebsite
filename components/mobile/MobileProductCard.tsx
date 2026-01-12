import React from 'react';
import { Product, Variant } from '../../types';
import { HeartIcon } from '../icons/HeartIcon';
import { StarIcon } from '../icons/StarIcon';
import { OptimizedImage } from '../OptimizedImage';

interface MobileProductCardProps {
  product: Product;
  onAddToCart: (product: Product, variant: Variant) => void;
  onToggleWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  isWishlisted?: boolean;
}

const MobileProductCard: React.FC<MobileProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  onSelectProduct,
  isWishlisted = false,
}) => {
  const variant = product.variants[0];
  const price = variant?.salePrice || variant?.price || 0;
  const rating = product.rating || 4.5;
  const reviewCount = product.reviews?.length || 0;

  // Get category tag color
  const getCategoryColor = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('hot') || lower.includes('chilli')) {
      return 'text-red-600 bg-red-100 dark:bg-red-900/40 dark:text-red-400';
    }
    return 'text-amber-600 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-400';
  };

  return (
    <div
      className="snap-start flex-shrink-0 w-44 bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-stone-100 dark:border-stone-700 overflow-hidden group cursor-pointer active:scale-95 transition-transform"
      onClick={() => onSelectProduct(product)}
    >
      {/* Image */}
      <div className="relative h-44 bg-stone-100 dark:bg-stone-700">
        <OptimizedImage
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
          width={176}
          height={176}
        />
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className="absolute top-2 right-2 bg-white/90 dark:bg-black/60 backdrop-blur rounded-full p-1.5 text-stone-500 dark:text-stone-400 hover:text-red-500 transition"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <HeartIcon className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Category Tag */}
        <div className="flex items-center gap-1 mb-1">
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getCategoryColor(product.category)}`}
          >
            {product.category}
          </span>
        </div>

        {/* Name */}
        <h4 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 leading-tight mb-1 truncate">
          {product.name}
        </h4>

        {/* Rating */}
        {reviewCount > 0 ? (
          <div className="flex items-center text-xs text-stone-500 dark:text-stone-400 mb-3">
            <StarIcon className="text-amber-400 w-4 h-4 mr-0.5 fill-amber-400" />
            {rating.toFixed(1)} ({reviewCount})
          </div>
        ) : (
          <div className="text-xs text-stone-400 mb-3 italic">No reviews yet</div>
        )}

        {/* Price & Add Button */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg text-stone-900 dark:text-stone-100">₹{price}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (variant) onAddToCart(product, variant);
            }}
            className="bg-amber-600 text-white rounded-full p-1.5 shadow-md shadow-amber-600/20 active:scale-90 transition"
            aria-label="Add to cart"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
};

export default MobileProductCard;
