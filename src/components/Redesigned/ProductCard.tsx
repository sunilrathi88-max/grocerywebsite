import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { Product, Variant } from '../../../types';
import { useCart } from '../../../hooks/useCart';
import StarRating from './StarRating';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  // Get rating and review count
  const hasReviews = product.reviews && product.reviews.length > 0;
  const rating = product.rating || (hasReviews ? 4.8 : null);
  const reviewCount = product.reviews?.length || 0;

  // Get primary variant (usually the first one)
  const primaryVariant = product.variants[0];
  const currentPrice = primaryVariant.salePrice || primaryVariant.price;
  const originalPrice = primaryVariant.salePrice ? primaryVariant.price : null;
  const discount = originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : null;

  return (
    <div className="group border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-white overflow-hidden flex flex-col h-full rounded-2xl relative">
      {/* Badge/Tag */}
      {product.badge && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-[#B38B59] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg">
            {product.badge}
          </span>
        </div>
      )}

      {/* Image Section */}
      <Link
        to={`/product/${product.id}`}
        className="relative aspect-square overflow-hidden bg-[#F8F7F3] block"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
      </Link>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold text-[#B38B59] uppercase tracking-widest bg-[#B38B59]/5 px-2 py-0.5 rounded">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-[#B38B59]">
            <Star size={12} className="fill-current" />
            <span className="text-xs font-bold">{rating}</span>
          </div>
        </div>

        <Link to={`/product/${product.id}`} className="block group/title">
          <h3 className="font-display text-lg text-stone-900 group-hover/title:text-[#B38B59] transition-colors line-clamp-1 mb-1">
            {product.shortName || product.name} {product.emoji}
          </h3>
        </Link>

        <p className="text-xs text-stone-500 line-clamp-2 mb-4 leading-relaxed font-medium">
          {product.usp}
        </p>

        {/* Pricing & Actions */}
        <div className="mt-auto pt-4 border-t border-stone-100">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-[#42210B]">₹{currentPrice}</span>
                {originalPrice && (
                  <span className="text-sm text-stone-400 line-through font-medium">
                    ₹{originalPrice}
                  </span>
                )}
              </div>
              {discount && (
                <span className="text-[10px] text-green-600 font-bold uppercase">
                  Save {discount}%
                </span>
              )}
            </div>
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">
              {primaryVariant.name} Pouch
            </div>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, primaryVariant, 1);
            }}
            className="w-full bg-[#42210B] hover:bg-[#5D3D28] text-white rounded-xl py-4 h-auto flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98] border-none"
          >
            <ShoppingCart size={18} />
            <span className="font-bold tracking-wide">ADD TO CART</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
