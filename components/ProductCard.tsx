import React from 'react';
import { Product, Variant } from '../types';
import { OptimizedImage } from './OptimizedImage';
import { PLACEHOLDER_URLS, imageErrorHandlers } from '../utils/imageHelpers';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { PlusIcon } from './icons/PlusIcon';
import { HeartIcon } from './icons/HeartIcon';
import { StarIcon } from './icons/StarIcon';
import { EyeIcon } from './icons/EyeIcon';
import { CompareIcon } from './icons/CompareIcon';
import { MailIcon } from './icons/MailIcon';
import { formatPrice } from '../utils/formatPrice';
import { Badge } from './ui/Badge';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, variant: Variant) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onSelectProduct: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  isCompared: boolean;
  onNotifyMe: (productName: string) => void;
  priority?: 'high' | 'low' | 'auto';
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
  priority = 'auto',
}) => {
  const placeholderImage = PLACEHOLDER_URLS.product;
  const handleImageError = imageErrorHandlers.product;

  const defaultVariant = product.variants[0];
  const displayPrice = defaultVariant.salePrice ?? defaultVariant.price;
  const onSale = defaultVariant.salePrice && defaultVariant.salePrice < defaultVariant.price;
  const isLowStock = defaultVariant.stock <= 5 && defaultVariant.stock > 0;
  const isOutOfStock = defaultVariant.stock === 0;

  const [isAdding, setIsAdding] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdding || isSuccess) return;

    setIsAdding(true);
    onAddToCart(product, defaultVariant);

    setTimeout(() => {
      setIsAdding(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 1500);
    }, 600);
  };

  return (
    <div
      className="group bg-white rounded-xl border border-neutral-200 overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:border-brand-primary/20 flex flex-col h-full relative"
      onClick={() => onSelectProduct(product)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-50 cursor-pointer">
        <OptimizedImage
          src={product.images?.[0] || placeholderImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          fallbackSrc={placeholderImage}
          onError={handleImageError}
          priority={priority}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
          {isOutOfStock ? (
            <Badge
              variant="neutral"
              className="bg-neutral-900 text-white border-none uppercase tracking-wider"
            >
              Out of Stock
            </Badge>
          ) : (
            <>
              {onSale && (
                <Badge
                  variant="error"
                  className="bg-brand-secondary text-white border-none uppercase tracking-wider"
                >
                  Sale
                </Badge>
              )}
              {isLowStock && (
                <Badge
                  variant="warning"
                  className="bg-orange-500 text-white border-none uppercase tracking-wider"
                >
                  Low Stock
                </Badge>
              )}
              {product.grade && (
                <Badge
                  variant="neutral"
                  className="bg-white/90 backdrop-blur-sm text-neutral-900 border-neutral-200 uppercase tracking-wider"
                >
                  {product.grade}
                </Badge>
              )}
            </>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300 transition-all z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white hover:text-brand-secondary transition-colors shadow-sm"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <HeartIcon
              className={`w-5 h-5 ${isWishlisted ? 'fill-brand-secondary text-brand-secondary' : 'fill-transparent'}`}
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(product);
            }}
            className={`p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-sm ${
              isCompared
                ? 'text-brand-primary bg-brand-primary/10'
                : 'text-neutral-600 hover:text-brand-primary'
            }`}
            aria-label={isCompared ? 'Remove from comparison' : 'Add to comparison'}
          >
            <CompareIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/50 to-transparent flex gap-2 justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="bg-white text-neutral-900 p-3 rounded-full hover:bg-neutral-100 transition-colors shadow-lg"
            title={`Quick view ${product.name}`}
            aria-label={`Quick view ${product.name}`}
          >
            <EyeIcon className="w-5 h-5" />
          </button>
          {isOutOfStock ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNotifyMe(product.name);
              }}
              className="bg-neutral-800 text-white p-3 rounded-full hover:bg-neutral-900 transition-colors shadow-lg px-4 flex items-center gap-2"
              title="Notify Me"
              aria-label={`Notify me when ${product.name} is back in stock`}
            >
              <MailIcon className="w-5 h-5" />
              <span className="text-sm font-bold whitespace-nowrap">Notify</span>
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isAdding || isSuccess}
              className={`p-3 rounded-full shadow-lg transition-colors flex items-center gap-2 px-4
                  ${isSuccess ? 'bg-success-green text-white' : 'bg-brand-primary text-white hover:bg-brand-primary/90'}
                `}
              title={`Add ${product.name} to cart`}
              aria-label={`Add ${product.name} to cart`}
            >
              {isAdding ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isSuccess ? (
                <CheckCircleIcon className="w-5 h-5" />
              ) : (
                <PlusIcon className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-2 flex-grow">
        <div className="text-xs text-neutral-500 font-medium uppercase tracking-wide">
          {product.category}
        </div>
        <h3
          className="text-lg font-serif font-bold text-neutral-900 leading-tight group-hover:text-brand-primary transition-colors line-clamp-1 cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label={`View details for ${product.name}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelectProduct(product);
          }}
          onKeyDown={(e) => e.key === 'Enter' && onSelectProduct(product)}
        >
          {product.name}
        </h3>

        {/* Outcome Description (PEACE Framework) */}
        <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          {product.rating || (product.reviews?.length || 0) > 0 ? (
            <>
              <StarIcon className="w-4 h-4 text-warning-yellow fill-warning-yellow" />
              <span className="text-sm text-neutral-600 font-medium">
                {product.rating || '4.8'}
              </span>
              <span className="text-xs text-neutral-400">
                ({product.review_count || product.reviews?.length || 120})
              </span>
            </>
          ) : (
            <span className="text-sm text-neutral-500 italic">No reviews yet</span>
          )}
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            {onSale && (
              <span className="text-sm text-neutral-400 line-through">
                {formatPrice(defaultVariant.price)}
              </span>
            )}
            <span
              className={`text-xl font-bold ${onSale ? 'text-brand-secondary' : 'text-neutral-900'}`}
            >
              {formatPrice(displayPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);
