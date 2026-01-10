import React from 'react';
import { OptimizedImage } from './OptimizedImage';

interface ProductVariant {
  id: number;
  weight: string;
  price: number;
  salePrice?: number;
}

interface EnhancedProductCardProps {
  id: number;
  name: string;
  image: string;
  price: number;
  salePrice?: number;
  weight?: string;
  rating?: number;
  reviewCount?: number;
  useCases?: string[];
  spiceLevel?: number; // 1-10
  isNew?: boolean;
  isBestseller?: boolean;
  isPure?: boolean;
  isOrganic?: boolean;
  onAddToCart?: () => void;
  onSaveForLater?: () => void;
  onClick?: () => void;
}

const SpiceLevelIndicator: React.FC<{ level: number }> = ({ level }) => {
  const getColor = () => {
    if (level <= 2) return 'text-green-500';
    if (level <= 4) return 'text-yellow-500';
    if (level <= 6) return 'text-orange-500';
    if (level <= 8) return 'text-red-500';
    return 'text-red-700';
  };

  const getLabel = () => {
    if (level <= 2) return 'Mild';
    if (level <= 4) return 'Light';
    if (level <= 6) return 'Medium';
    if (level <= 8) return 'Hot';
    return 'Very Hot';
  };

  return (
    <div className={`flex items-center gap-1 text-sm font-medium ${getColor()}`}>
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < Math.ceil(level / 2) ? 'opacity-100' : 'opacity-30'}>
            🌶️
          </span>
        ))}
      </div>
      <span className="text-xs text-neutral-500 ml-1">{getLabel()}</span>
    </div>
  );
};

const RatingStars: React.FC<{ rating: number; reviewCount?: number }> = ({
  rating,
  reviewCount,
}) => {
  return (
    <div className="flex items-center gap-1">
      <div className="flex text-amber-400">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-current' : 'fill-neutral-200'}`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
      {reviewCount && <span className="text-xs text-neutral-500">({reviewCount})</span>}
    </div>
  );
};

const EnhancedProductCard: React.FC<EnhancedProductCardProps> = ({
  id,
  name,
  image,
  price,
  salePrice,
  weight,
  rating,
  reviewCount,
  useCases = [],
  spiceLevel,
  isNew,
  isBestseller,
  isPure,
  isOrganic,
  onAddToCart,
  onSaveForLater,
  onClick,
}) => {
  const discountPercent = salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {isNew && (
          <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            NEW
          </span>
        )}
        {isBestseller && (
          <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            ⭐ Bestseller
          </span>
        )}
        {discountPercent > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSaveForLater?.();
        }}
        className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-white transition-all shadow-sm"
        aria-label="Save for later"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {/* Product Image */}
      <div className="aspect-square overflow-hidden bg-neutral-50">
        <OptimizedImage
          src={image}
          alt={name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          width={300}
          height={300}
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Rating */}
        {rating && (
          <div className="mb-2">
            <RatingStars rating={rating} reviewCount={reviewCount} />
          </div>
        )}

        {/* Name */}
        <h3 className="font-bold text-neutral-900 text-lg mb-1 line-clamp-2 group-hover:text-amber-700 transition-colors">
          {name}
        </h3>

        {/* Use Case Tags */}
        {useCases.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            <span className="text-xs text-neutral-500">Perfect for:</span>
            {useCases.slice(0, 3).map((useCase, i) => (
              <span key={i} className="text-xs text-amber-700 font-medium">
                {useCase}
                {i < Math.min(useCases.length, 3) - 1 ? ' • ' : ''}
              </span>
            ))}
          </div>
        )}

        {/* Spice Level */}
        {spiceLevel && (
          <div className="mb-3">
            <SpiceLevelIndicator level={spiceLevel} />
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-bold text-neutral-900">₹{salePrice || price}</span>
          {salePrice && <span className="text-sm text-neutral-400 line-through">₹{price}</span>}
          {weight && <span className="text-sm text-neutral-500">| {weight}</span>}
        </div>

        {/* Trust Signals */}
        <div className="flex flex-wrap gap-2 mb-4">
          {isPure && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
              ✓ 100% Pure
            </span>
          )}
          {isOrganic && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
              🌿 Organic
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.();
          }}
          className="w-full bg-brand-primary text-brand-dark font-bold py-3 px-4 rounded-xl hover:bg-amber-500 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Add to Cart
        </button>

        {/* Free Shipping Notice */}
        <p className="text-xs text-neutral-500 text-center mt-2">✓ Free shipping on orders ₹600+</p>
      </div>
    </div>
  );
};

export default EnhancedProductCard;
