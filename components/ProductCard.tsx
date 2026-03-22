import React, { useState } from 'react';
import { OptimizedImage } from './OptimizedImage';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import StockBadge from './StockBadge';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  heatLevel: number | 'mild' | 'medium' | 'hot';
  useCase: string | string[];
  sizes?: Array<{ size: string; price: number; stock?: number }>;
  badge?: 'new' | 'discount';
  badgeValue?: string;
  category?: string;
  origin?: string;
  stock?: number;
  onAddToCart: (productId: string) => void;
  onWishlist: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  reviewCount,
  heatLevel,
  useCase,
  sizes,
  badge,
  category,
  origin,
  stock,
  onAddToCart,
  onWishlist,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const heatLevelEmoji = {
    mild: '🌶️',
    medium: '🌶️🌶️',
    hot: '🌶️🌶️🌶️',
  };

  const computedStock =
    stock !== undefined ? stock : sizes ? sizes.reduce((sum, s) => sum + (s.stock || 20), 0) : 20;

  // Default to 0 based on user logic, though usually it's calculated
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  // CSS fallback styling mapping
  const getGradientClass = (cat?: string, productName?: string) => {
    const search = ((cat || '') + ' ' + (productName || '')).toLowerCase();
    if (search.includes('turmeric') || search.includes('haldi'))
      return 'bg-gradient-to-br from-amber-400 to-amber-600';
    if (search.includes('chilli') || search.includes('mirch'))
      return 'bg-gradient-to-br from-red-600 to-red-900';
    if (
      search.includes('coriander') ||
      search.includes('green') ||
      search.includes('mint') ||
      search.includes('cardamom')
    )
      return 'bg-gradient-to-br from-emerald-600 to-emerald-900';
    if (cat?.toLowerCase().includes('whole')) return 'bg-gradient-to-br from-gray-800 to-black';
    if (
      search.includes('nut') ||
      search.includes('almond') ||
      search.includes('cashew') ||
      search.includes('fruit')
    )
      return 'bg-gradient-to-br from-[#D2B48C] to-[#8B4513]';
    if (search.includes('chai') || search.includes('tea') || search.includes('masala'))
      return 'bg-gradient-to-br from-amber-900 to-neutral-900';
    return 'bg-gradient-to-br from-neutral-600 to-neutral-800';
  };

  // Helper for visual spice level
  const renderSpiceLevel = () => {
    // If numeric level provided
    if (typeof heatLevel === 'number') {
      const level = heatLevel as number;
      const getColor = () => {
        if (level <= 2) return 'text-green-500';
        if (level <= 4) return 'text-yellow-500';
        if (level <= 6) return 'text-orange-500';
        if (level <= 8) return 'text-red-500';
        return 'text-red-700';
      };
      return (
        <div
          className={`flex items-center gap-0.5 ${getColor()}`}
          title={`Heat Level: ${level}/10`}
        >
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-[10px] ${i < Math.ceil(level / 2) ? 'opacity-100' : 'opacity-30 grayscale'}`}
            >
              🌶️
            </span>
          ))}
        </div>
      );
    }

    // Fallback for string legacy prop
    if (typeof heatLevel === 'string' && name.toLowerCase().includes('chilli')) {
      return (
        <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-neutral-600 bg-neutral-100 px-2 py-1 rounded-full">
          {heatLevelEmoji[heatLevel as keyof typeof heatLevelEmoji]} {heatLevel}
        </span>
      );
    }
    return null;
  };

  return (
    <Link to={`/product/${id}`} className="h-full block">
      <div
        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full border border-neutral-100 flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative w-full aspect-[4/5] bg-neutral-50 overflow-hidden">
          {image.includes('fallback') ? (
            <div
              className={`w-full h-full flex flex-col items-center justify-center p-6 ${getGradientClass(category, name)} relative overflow-hidden group-hover:scale-105 transition-transform duration-700`}
            >
              <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMODg4TTggMEwwIDgiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+Cjwvc3ZnPg==')] animate-[slide_10s_linear_infinite]" />
              <div className="relative z-10 text-center flex flex-col items-center gap-3">
                <span className="font-serif italic text-3xl md:text-3xl text-white drop-shadow-md leading-tight">
                  {name}
                </span>
                {origin && (
                  <span className="font-sans uppercase tracking-[0.2em] text-[10px] pb-0.5 text-white/90 border-b border-white/50 inline-block px-1">
                    {origin}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <OptimizedImage
              src={image}
              alt={name}
              type="card"
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
              width={300}
              height={375}
            />
          )}

          <div className="absolute top-3 left-3 z-20 pointer-events-none scale-90 origin-top-left">
            <StockBadge stock={computedStock} lowStockThreshold={10} isPopular={reviewCount > 40} />
          </div>

          {/* Badges - Enhanced */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {badge === 'new' && (
              <span className="bg-blue-600 text-white px-2 py-1 rounded-lg text-[10px] font-bold shadow-md uppercase tracking-wider backdrop-blur-md">
                New Arrival
              </span>
            )}
            {badge === 'discount' && discount > 0 && (
              <span className="bg-red-600 text-white px-2 py-1 rounded-lg text-[10px] font-bold shadow-md backdrop-blur-md">
                Save {discount}%
              </span>
            )}
            {/* Dynamic badges from props if added later */}
          </div>

          {/* Wishlist Button */}
          <button
            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white text-neutral-400 hover:text-red-500 transition-all transform hover:scale-110 z-20"
            onClick={(e) => {
              e.preventDefault();
              setIsWishlisted(!isWishlisted);
              onWishlist(id);
            }}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg
              className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-current fill-none'}`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {/* Quick View Button - Desktop Only */}
          <div
            className={`absolute inset-x-4 bottom-4 transition-all duration-300 transform ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} hidden md:block`}
          >
            <Button
              variant="primary"
              size="sm"
              fullWidth
              disabled={isLoading}
              className={`shadow-lg border-0 ${isSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-brand-primary text-brand-dark hover:bg-brand-dark hover:text-white'}`}
              onClick={(e) => {
                e.preventDefault();
                setIsLoading(true);
                setTimeout(() => {
                  onAddToCart(id);
                  setIsLoading(false);
                  setIsSuccess(true);
                  setTimeout(() => setIsSuccess(false), 2000);
                }, 600);
              }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : isSuccess ? (
                <span className="flex items-center gap-1">✓ Added</span>
              ) : (
                <span className="font-bold">Quick Add +</span>
              )}
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Tags / Use Case */}
          <div className="flex flex-wrap gap-2 mb-2 items-center min-h-[24px]">
            {renderSpiceLevel()}

            {/* If useCase is an array, map it, else show string. Also support Use Cases prop */}
            {Array.isArray(useCase) ? (
              useCase.slice(0, 2).map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-1 rounded-md"
                >
                  {tag}
                </span>
              ))
            ) : useCase ? (
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-1 rounded-md break-all line-clamp-1">
                {useCase}
              </span>
            ) : null}
          </div>

          {/* Name */}
          <h3 className="text-base font-bold text-neutral-900 mb-1 line-clamp-2 group-hover:text-brand-primary transition-colors h-[44px]">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex text-yellow-400 text-xs">
              {'★★★★★'.split('').map((star, i) => (
                <span
                  key={i}
                  className={i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-neutral-400">({reviewCount})</span>
          </div>

          <div className="mt-auto pt-3 border-t border-neutral-50 flex items-center justify-between">
            <div className="flex flex-col">
              {originalPrice && originalPrice > price && (
                <span className="text-xs text-neutral-400 line-through">₹{originalPrice}</span>
              )}
              <span className="text-lg font-bold text-brand-dark">₹{price}</span>
            </div>

            {/* Mobile Add Button */}
            <button
              className="md:hidden bg-brand-primary/10 text-brand-dark p-2 rounded-full hover:bg-brand-primary transition-colors"
              onClick={(e) => {
                e.preventDefault();
                onAddToCart(id);
              }}
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

            {sizes && sizes.length > 0 && (
              <div className="text-xs font-medium text-neutral-500 hidden md:block">
                {sizes[0].size}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
