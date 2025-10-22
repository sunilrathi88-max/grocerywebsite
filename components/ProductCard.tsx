import React from 'react';
import { motion } from 'framer-motion';
import { Product, Variant } from '../types';
import { OptimizedImage } from './OptimizedImage';
import { PLACEHOLDER_URLS, imageErrorHandlers } from '../utils/imageHelpers';
import { PlusIcon } from './icons/PlusIcon';
import { HeartIcon } from './icons/HeartIcon';
import { StarIcon } from './icons/StarIcon';
import { EyeIcon } from './icons/EyeIcon';
import { CompareIcon } from './icons/CompareIcon';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, variant: Variant) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onSelectProduct: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  isCompared: boolean;
  onNotifyMe: (productName: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onSelectProduct,
  onToggleCompare,
  isCompared,
  onNotifyMe,
}) => {
  // Debugging logs as requested
  console.log('ProductCard props:', product);
  console.log('Product images array:', product.images);

  const placeholderImage = PLACEHOLDER_URLS.product;
  // Use shared image error handler to swap to local fallback
  const handleImageError = imageErrorHandlers.product;

  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
      : null;

  const roundedRating = averageRating ? Math.round(averageRating) : 0;
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  const isOutOfStock = totalStock === 0;
  const isLowStock = totalStock > 0 && totalStock <= 5;

  const defaultVariant = product.variants[0];
  const onSale = defaultVariant.salePrice && defaultVariant.salePrice < defaultVariant.price;
  const hasMultiplePrices = product.variants.length > 1;

  const displayPrice = defaultVariant.salePrice ?? defaultVariant.price;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group transform hover:-translate-y-3 transition-all duration-500 border border-gray-100 hover:border-brand-primary/40 hover:shadow-2xl flex flex-col relative">
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/0 via-transparent to-amber-500/0 group-hover:from-brand-primary/5 group-hover:to-amber-500/5 transition-all duration-500 rounded-2xl pointer-events-none"></div>

      <div className="relative">
        <div className="h-72 w-full bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden rounded-t-2xl">
          <OptimizedImage
            className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-2"
            src={product.images?.[0] || placeholderImage}
            alt={product.name}
            type="card"
            priority="auto"
            fallbackSrc={placeholderImage}
            onError={handleImageError}
            width={400}
            height={300}
          />
          {/* Dark Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Action Buttons - Slide Up on Hover */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <button
              onClick={() => onSelectProduct(product)}
              className="flex items-center gap-2 bg-white text-gray-900 font-bold py-3 px-6 rounded-xl shadow-xl hover:shadow-2xl hover:bg-gradient-to-r hover:from-brand-primary hover:to-amber-500 hover:text-white transform hover:scale-110 transition-all duration-300"
              aria-label={`Quick view ${product.name}`}
            >
              <EyeIcon className="h-5 w-5" />
              <span className="text-sm">Quick View</span>
            </button>
            {isOutOfStock ? (
              <button
                onClick={() => onNotifyMe(product.name)}
                className="bg-gray-900 text-white font-bold py-3 px-6 rounded-xl shadow-xl hover:shadow-2xl hover:bg-gray-800 transform hover:scale-110 transition-all duration-300"
              >
                <span className="text-sm">Notify Me</span>
              </button>
            ) : (
              <button
                onClick={() => onAddToCart(product, defaultVariant)}
                className="flex items-center gap-2 bg-gradient-to-r from-brand-primary to-amber-500 text-white font-bold py-3 px-6 rounded-xl shadow-xl hover:shadow-2xl hover:from-amber-500 hover:to-brand-primary transform hover:scale-110 transition-all duration-300"
                aria-label={`Add ${product.name} to cart`}
              >
                <PlusIcon />
                <span className="text-sm">Add</span>
              </button>
            )}
          </div>

          {/* Out of Stock Badge */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center group-hover:hidden transition-opacity duration-300">
              <span className="bg-gray-900 text-white font-bold py-3 px-6 rounded-xl shadow-lg">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Wishlist Button - Enhanced */}
        <motion.button
          {...({
            whileTap: { scale: 1.2 },
            onClick: () => onToggleWishlist(product),
            className:
              'absolute top-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-full text-gray-700 hover:text-red-500 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 z-10 group/heart',
            'aria-label': isWishlisted ? 'Remove from wishlist' : 'Add to wishlist',
          } as any)}
        >
          <HeartIcon
            className={`h-6 w-6 transition-all duration-300 ${isWishlisted ? 'text-red-500 fill-current scale-110' : 'fill-transparent stroke-current group-hover/heart:scale-110'}`}
          />
        </motion.button>

        {/* Compare Button - Enhanced */}
        <button
          onClick={() => onToggleCompare(product)}
          className={`absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-10 ${isCompared ? 'text-brand-primary bg-brand-primary/10' : 'text-gray-700 hover:text-brand-primary'}`}
          aria-label={isCompared ? 'Remove from comparison' : 'Add to comparison'}
        >
          <CompareIcon className="transition-transform duration-300 hover:scale-110" />
        </button>

        {/* Badges - Enhanced */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {onSale && (
            <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold text-xs py-2 px-4 rounded-full shadow-lg backdrop-blur-sm animate-pulse-slow">
              SALE
            </span>
          )}
          {isLowStock && (
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-xs py-2 px-4 rounded-full shadow-lg backdrop-blur-sm">
              LOW STOCK
            </span>
          )}
        </div>
      </div>

      {/* Product Info - Enhanced */}
      <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-white to-gray-50/50">
        <button
          onClick={() => onSelectProduct(product)}
          className="w-full text-left group/title"
          aria-label={`View details for ${product.name}`}
        >
          <h3 className="text-xl font-serif font-bold text-gray-900 truncate group-hover/title:text-brand-primary transition-colors duration-300">
            {product.name}
          </h3>
        </button>

        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold font-sans transition-all duration-300 ${onSale ? 'text-red-600' : 'text-gray-900 group-hover:text-brand-primary'}`}
            >
              {hasMultiplePrices && (
                <span className="text-sm font-normal text-gray-500">From </span>
              )}
              ${displayPrice.toFixed(2)}
            </span>
            {onSale && (
              <span className="text-lg font-sans text-gray-400 line-through">
                ${defaultVariant.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center h-[24px]">
            {averageRating ? (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <StarIcon
                      key={index}
                      className={`w-5 h-5 transition-all duration-300 ${index < roundedRating ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  ({product.reviews.length})
                </span>
              </div>
            ) : (
              <span className="text-sm text-gray-400 italic">No reviews yet</span>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default React.memo(ProductCard);
