import React, { useState } from 'react';
import { OptimizedImage } from './OptimizedImage';
import { Link } from 'react-router-dom';
import { Button } from './Button';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  heatLevel: 'mild' | 'medium' | 'hot';
  useCase: string;
  sizes?: Array<{ size: string; price: number }>;
  badge?: 'new' | 'discount';
  badgeValue?: string;
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
  onAddToCart,
  onWishlist,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const heatLevelEmoji = {
    mild: '🌶️',
    medium: '🌶️🌶️',
    hot: '🌶️🌶️🌶️',
  };

  // Default to 0 based on user logic, though usually it's calculated
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <Link to={`/product/${id}`}>
      <div
        className="group bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full border border-neutral-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative w-full aspect-[4/5] bg-neutral-100 overflow-hidden">
          <OptimizedImage
            src={image}
            alt={name}
            type="card"
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
            width={300}
            height={375}
          />

          {/* Badges */}
          {badge && (
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {badge === 'new' && (
                <span className="bg-brand-primary text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-sm uppercase tracking-wide">
                  New
                </span>
              )}
              {badge === 'discount' && discount > 0 && (
                <span className="bg-semantic-error text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-sm">
                  {discount}% OFF
                </span>
              )}
            </div>
          )}

          {/* Wishlist Button - Visible on Hover for Desktop, Always for Mobile */}
          <button
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white text-neutral-600 hover:text-accent-red transition-all transform hover:scale-110"
            onClick={(e) => {
              e.preventDefault();
              setIsWishlisted(!isWishlisted);
              onWishlist(id);
            }}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isWishlisted ? '❤️' : '♡'}
          </button>

          {/* Quick View Button */}
          <div
            className={`absolute inset-x-0 bottom-0 p-4 transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
          >
            <Button
              variant="primary"
              size="sm"
              fullWidth
              className="shadow-lg"
              onClick={(e) => {
                e.preventDefault();
                onAddToCart(id);
              }}
            >
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5">
          {/* Tags Row */}
          <div className="flex gap-2 mb-3 flex-wrap">
            <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-neutral-600 bg-neutral-100 px-2 py-1 rounded-full">
              {heatLevelEmoji[heatLevel]} {heatLevel}
            </span>
            <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-neutral-600 bg-neutral-100 px-2 py-1 rounded-full">
              {useCase}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-lg font-bold text-neutral-900 mb-1 line-clamp-1 group-hover:text-brand-primary transition-colors">
            {name}
          </h3>

          {/* Rating Row */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex text-brand-primary text-sm">
              {'★'.repeat(Math.round(rating))}
              <span className="text-neutral-300">{'★'.repeat(5 - Math.round(rating))}</span>
            </div>
            <span className="text-xs text-neutral-500 font-medium ml-1">
              {rating} ({reviewCount})
            </span>
          </div>

          {/* Pricing Row */}
          <div className="flex items-end justify-between mt-auto">
            <div>
              <div className="text-xl font-bold text-neutral-900">₹{price}</div>
              {originalPrice && (
                <div className="text-xs text-neutral-400 line-through">₹{originalPrice}</div>
              )}
            </div>
            <div className="text-right">
              <span className="text-xs font-medium text-neutral-500 block mb-1">
                {sizes?.[0]?.size || 'Pack'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
