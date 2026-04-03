import React, { useState } from 'react';
import { OptimizedImage } from './OptimizedImage';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import StockBadge from './StockBadge';
import { ShieldCheck, Leaf, Star, Flame, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types';

interface UniversalProductCardProps {
  product?: Product;
  id?: string;
  name?: string;
  price?: number;
  originalPrice?: number;
  image?: string;
  rating?: number;
  reviewCount?: number;
  spiceLevel?: number; // 1-10
  useCases?: string[];
  isNew?: boolean;
  isBestseller?: boolean;
  isPure?: boolean;
  isOrganic?: boolean;
  stock?: number;
  category?: string;
  origin?: string;
  weight?: string;
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
}

export const UniversalProductCard: React.FC<UniversalProductCardProps> = ({
  product,
  id = product?.id.toString(),
  name = product?.name,
  price = product?.variants?.[0]?.salePrice || product?.variants?.[0]?.price,
  originalPrice = product?.variants?.[0]?.salePrice ? product?.variants?.[0]?.price : undefined,
  image = product?.images?.[0] || '',
  rating = product?.rating ||
    (product?.reviews?.length
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : 4.8),
  reviewCount = product?.reviews?.length || 0,
  spiceLevel = product?.tags?.includes('Hot')
    ? 9
    : product?.tags?.includes('Medium')
      ? 6
      : product?.tags?.includes('Mild')
        ? 3
        : undefined,
  useCases = product?.tags?.filter((t) => ['Curries', 'Rice', 'Tea'].includes(t)) || [],
  isNew = product?.isNew,
  isBestseller = (product?.reviews?.length || 0) > 40 || product?.badge === 'Bestseller',
  isPure = true,
  isOrganic = product?.tags?.includes('Organic'),
  stock = product?.variants?.[0]?.stock || 20,
  category = product?.category,
  origin = product?.origin || 'Rajasthan, India',
  weight = product?.variants?.[0]?.name,
  onAddToCart,
  onToggleWishlist,
  isWishlisted: initialWishlisted = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const discountPercent =
    originalPrice && price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const getGradientClass = (cat?: string, productName?: string) => {
    const search = ((cat || '') + ' ' + (productName || '')).toLowerCase();
    if (search.includes('turmeric')) return 'bg-gradient-to-br from-amber-400 to-amber-600';
    if (search.includes('chilli')) return 'bg-gradient-to-br from-red-600 to-red-900';
    if (search.includes('coriander') || search.includes('cardamom'))
      return 'bg-gradient-to-br from-emerald-600 to-emerald-900';
    if (search.includes('nut') || search.includes('almond'))
      return 'bg-gradient-to-br from-[#D2B48C] to-[#8B4513]';
    return 'bg-gradient-to-br from-neutral-600 to-neutral-800';
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onAddToCart || !id) return;
    setIsAdding(true);
    setTimeout(() => {
      onAddToCart(id);
      setIsAdding(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 600);
  };

  return (
    <Link
      to={`/product/${id}`}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-stone-100 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges Stack */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {isNew && (
          <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-widest">
            New
          </span>
        )}
        {isBestseller && (
          <span className="bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-widest flex items-center gap-1">
            <Star size={10} fill="currentColor" /> Bestseller
          </span>
        )}
        {discountPercent > 0 && (
          <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Stock Status */}
      <div className="absolute top-4 right-4 z-20 transition-opacity duration-300 group-hover:opacity-0">
        <StockBadge stock={stock} lowStockThreshold={10} />
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsWishlisted(!isWishlisted);
          if (onToggleWishlist && id) onToggleWishlist(id);
        }}
        className={`absolute top-4 right-4 z-30 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 ${
          isWishlisted
            ? 'bg-red-50 text-red-500 animate-pulse'
            : 'bg-white/80 text-stone-400 hover:text-red-500'
        }`}
      >
        <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} strokeWidth={2.5} />
      </button>

      {/* Image Media Area */}
      <div className="aspect-[4/5] overflow-hidden bg-stone-50 relative">
        {image.includes('fallback') ? (
          <div
            className={`w-full h-full flex flex-col items-center justify-center p-8 ${getGradientClass(category, name)} relative overflow-hidden`}
          >
            <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMODg4TTggMEwwIDgiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+Cjwvc3ZnPg==')] animate-pulse" />
            <span className="font-serif italic text-3xl text-white text-center leading-tight drop-shadow-lg z-10">
              {name}
            </span>
            {origin && (
              <span className="text-[10px] uppercase font-black tracking-[0.3em] text-white/80 mt-4 border-t border-white/30 pt-2 z-10">
                {origin}
              </span>
            )}
          </div>
        ) : (
          <OptimizedImage
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            width={400}
            height={500}
          />
        )}

        {/* Quick Add Overlay (Desktop) */}
        <div
          className={`absolute inset-x-6 bottom-6 transition-all duration-500 transform hidden md:block ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <Button
            variant="primary"
            fullWidth
            onClick={handleAdd}
            className={`shadow-2xl border-none h-12 rounded-2xl font-black tracking-widest text-xs uppercase transition-all active:scale-95 ${
              showSuccess ? 'bg-green-600' : 'bg-brand-primary text-brand-dark'
            }`}
          >
            {isAdding ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : showSuccess ? (
              '✓ Added to Cart'
            ) : (
              <span className="flex items-center gap-2">
                <ShoppingCart size={16} /> Quick Add
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          {/* Rating */}
          <div className="flex items-center gap-1.5 bg-stone-50 px-2 py-1 rounded-lg">
            <Star size={12} fill="#FACC15" className="text-yellow-400" />
            <span className="text-[11px] font-black text-stone-700">{rating}</span>
            <span className="text-[10px] font-bold text-stone-400">({reviewCount})</span>
          </div>

          {/* Spice Level Indicator */}
          {spiceLevel && (
            <div className="flex items-center gap-0.5" title={`Spice Level: ${spiceLevel}/10`}>
              {[...Array(3)].map((_, i) => (
                <Flame
                  key={i}
                  size={12}
                  className={
                    i < Math.ceil(spiceLevel / 3.3) ? 'text-red-500 fill-red-500' : 'text-stone-200'
                  }
                />
              ))}
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold text-[#42210B] leading-tight mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors min-h-[3rem]">
          {name}
        </h3>

        {/* Dynamic Tags */}
        <div className="flex flex-wrap gap-2 mb-4 min-h-[1.5rem]">
          {isPure && (
            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-green-700 bg-green-50 px-2 py-1 rounded-md">
              <ShieldCheck size={10} /> 100% Pure
            </span>
          )}
          {isOrganic && (
            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
              <Leaf size={10} /> Organic
            </span>
          )}
          {useCases.slice(0, 1).map((tag, i) => (
            <span
              key={i}
              className="text-[9px] font-black uppercase tracking-widest text-stone-400 bg-stone-50 px-2 py-1 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price & Action Footer */}
        <div className="mt-auto pt-6 border-t border-stone-50 flex items-end justify-between">
          <div className="space-y-1">
            {originalPrice && originalPrice > price && (
              <div className="text-xs text-stone-400 line-through font-bold">₹{originalPrice}</div>
            )}
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#42210B]">₹{price}</span>
              {weight && (
                <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">
                  / {weight}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="md:hidden w-12 h-12 bg-brand-primary text-brand-dark rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          >
            <ShoppingCart size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default UniversalProductCard;
