import React, { useState } from 'react';
import { OptimizedImage } from './OptimizedImage';
import { Link } from 'react-router-dom';
import StockBadge from './StockBadge';
import { ShieldCheck, Leaf, Star, Flame, Plus, Minus, FlaskConical } from 'lucide-react';
import { Product, Variant } from '../types';
import { useCart } from '../hooks/useCart';

interface UniversalProductCardProps {
  product?: Product;
  id?: string;
  name?: string;
  price?: number;
  originalPrice?: number;
  image?: string;
  rating?: number;
  reviewCount?: number;
  spiceLevel?: number;
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
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [selectedVariantId, setSelectedVariantId] = useState<Variant['id'] | null>(null);

  const { addToCart, updateQuantity, getCartItemQuantity } = useCart();

  const activeVariant =
    product?.variants?.find((v) => v.id === selectedVariantId) ||
    product?.variants?.find((v) => v.stock > 0) ||
    product?.variants?.[0];

  // When the card has a full product, price/weight follow the selected variant
  const displayPrice =
    product && activeVariant ? activeVariant.salePrice || activeVariant.price : price;
  const displayOriginalPrice =
    product && activeVariant
      ? activeVariant.salePrice
        ? activeVariant.price
        : undefined
      : originalPrice;
  const displayWeight = product && activeVariant ? activeVariant.name : weight;

  const cartQty = product && activeVariant ? getCartItemQuantity(product.id, activeVariant.id) : 0;

  const discountPercent =
    displayOriginalPrice && displayPrice
      ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)
      : 0;

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product && activeVariant) {
      if (cartQty === 0) {
        addToCart(product, activeVariant, 1);
      } else {
        updateQuantity(product.id, activeVariant.id, cartQty + 1);
      }
    } else if (onAddToCart && id) {
      onAddToCart(id);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product && activeVariant) {
      updateQuantity(product.id, activeVariant.id, cartQty - 1);
    }
  };

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

  const showNabl = !!product?.purityTest;
  const showSingleOrigin = !!product?.origin;

  return (
    <Link
      to={`/product/${id}`}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-stone-100 flex flex-col h-full"
    >
      {/* Badges Stack — top-left */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {isNew && (
          <span className="bg-[#B38B59] text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-xl uppercase tracking-[0.2em] backdrop-blur-md">
            New Arrival
          </span>
        )}
        {isBestseller && (
          <span className="bg-amber-400 text-amber-950 text-[9px] font-black px-3 py-1.5 rounded-full shadow-xl uppercase tracking-[0.2em] flex items-center gap-1.5">
            <Star size={10} fill="currentColor" /> Bestseller
          </span>
        )}
        {discountPercent > 0 && (
          <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-xl uppercase tracking-[0.1em]">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Stock Badge — top-right */}
      <div className="absolute top-4 right-4 z-20 transition-opacity duration-300 group-hover:opacity-0">
        <StockBadge stock={stock} lowStockThreshold={10} />
      </div>

      {/* Wishlist Button — top-right on hover */}
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
        ♥
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

        {/* Trust Badges — bottom-left of image */}
        <div className="absolute bottom-14 left-2 z-10 flex flex-col gap-1 pointer-events-none">
          {isPure && (
            <span className="bg-green-900/90 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 w-fit">
              <ShieldCheck size={8} /> 100% Pure
            </span>
          )}
          {showSingleOrigin && (
            <span className="bg-green-900/90 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 w-fit">
              <Leaf size={8} /> Single-Origin
            </span>
          )}
          {showNabl && (
            <span className="bg-green-900/90 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 w-fit">
              <FlaskConical size={8} /> NABL Tested
            </span>
          )}
        </div>

        {/* Quantity Counter — bottom-right of image, always visible */}
        <div className="absolute bottom-3 right-3 z-20">
          {cartQty === 0 ? (
            <button
              onClick={handleIncrement}
              className="w-10 h-10 bg-[#42210B] text-[#F5DEB3] rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all duration-150 hover:bg-[#6b3a1f]"
              aria-label="Add to cart"
            >
              <Plus size={20} strokeWidth={3} />
            </button>
          ) : (
            <div className="flex items-center bg-[#42210B] rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={handleDecrement}
                className="w-9 h-10 flex items-center justify-center text-[#F5DEB3] hover:bg-[#6b3a1f] active:scale-90 transition-all duration-150"
                aria-label="Decrease quantity"
              >
                <Minus size={14} strokeWidth={3} />
              </button>
              <span className="w-7 text-center text-sm font-black text-[#F5DEB3]">{cartQty}</span>
              <button
                onClick={handleIncrement}
                className="w-9 h-10 flex items-center justify-center text-[#F5DEB3] hover:bg-[#6b3a1f] active:scale-90 transition-all duration-150"
                aria-label="Increase quantity"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info Body */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 bg-stone-50 px-2 py-1 rounded-lg">
            <Star size={12} fill="#FACC15" className="text-yellow-400" />
            <span className="text-[11px] font-black text-stone-700">{rating}</span>
            <span className="text-[10px] font-bold text-stone-400">({reviewCount})</span>
          </div>

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

        <div className="flex flex-wrap gap-2 mb-4 min-h-[1.5rem]">
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

        {/* Price Footer */}
        <div className="mt-auto pt-6 border-t border-stone-50">
          {/* Variant quick-select */}
          {product && product.variants && product.variants.length > 1 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedVariantId(v.id);
                  }}
                  disabled={v.stock === 0}
                  aria-label={`Select ${v.name} pack`}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all ${
                    activeVariant?.id === v.id
                      ? 'bg-[#42210B] text-[#F5DEB3] border-[#42210B]'
                      : v.stock === 0
                        ? 'bg-stone-50 text-stone-300 border-stone-100 line-through cursor-not-allowed'
                        : 'bg-white text-stone-500 border-stone-200 hover:border-[#B38B59]'
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          )}
          <div className="space-y-1">
            {displayOriginalPrice && displayOriginalPrice > (displayPrice ?? 0) && (
              <div className="text-xs text-stone-400 line-through font-bold">
                ₹{displayOriginalPrice}
              </div>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#42210B]">₹{displayPrice}</span>
              {displayWeight && (
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                  / {displayWeight}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                  {discountPercent}% off
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default UniversalProductCard;
