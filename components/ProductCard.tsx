import React from 'react';
import { Product, Variant } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { HeartIcon } from './icons/HeartIcon';
import { StarIcon } from './icons/StarIcon';
import { EyeIcon } from './icons/EyeIcon';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, variant: Variant) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onSelectProduct: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onToggleWishlist, isWishlisted, onSelectProduct }) => {
  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : null;
  
  const roundedRating = averageRating ? Math.round(averageRating) : 0;
  const isOutOfStock = product.variants.every(v => v.stock === 0);
  
  const defaultVariant = product.variants[0];
  const onSale = defaultVariant.salePrice && defaultVariant.salePrice < defaultVariant.price;
  const hasMultiplePrices = product.variants.length > 1;

  const displayPrice = defaultVariant.salePrice ?? defaultVariant.price;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group transform hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-brand-primary/50 hover:shadow-xl flex flex-col">
      <div className="relative">
        <div className="h-64 w-full bg-gray-200 relative overflow-hidden">
          <img 
            className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" 
            src={product.images[0]} 
            alt={product.name}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100">
             <button
                onClick={() => onSelectProduct(product)}
                className="flex items-center gap-2 bg-white text-brand-dark font-bold py-2 px-4 rounded-full shadow-md hover:bg-brand-secondary/80 transform hover:scale-105 transition-all duration-300"
                aria-label={`Quick view ${product.name}`}
              >
                <EyeIcon className="h-5 w-5" />
                Quick View
              </button>
              <button 
                onClick={() => onAddToCart(product, defaultVariant)}
                disabled={isOutOfStock}
                className="p-3 bg-white text-brand-dark rounded-full shadow-md hover:bg-brand-secondary/80 transform hover:scale-105 transition-all duration-300 disabled:bg-gray-400 disabled:text-white disabled:cursor-not-allowed disabled:transform-none"
                aria-label={`Add ${product.name} to cart`}
              >
                <PlusIcon />
              </button>
          </div>
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center">
                <span className="bg-brand-dark text-white font-bold py-2 px-4 rounded-full">Out of Stock</span>
            </div>
          )}
        </div>
        <button
          onClick={() => onToggleWishlist(product)}
          className="absolute top-3 right-3 bg-white/70 backdrop-blur-sm p-2 rounded-full text-brand-dark hover:text-red-500 transition-colors duration-300 z-10"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <HeartIcon className={`h-6 w-6 ${isWishlisted ? 'text-red-500 fill-current' : 'fill-transparent stroke-current'}`} />
        </button>
        {onSale && (
            <span className="absolute top-3 left-3 bg-red-500 text-white font-bold text-xs py-1 px-3 rounded-full z-10">SALE</span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <button onClick={() => onSelectProduct(product)} className="w-full text-left" aria-label={`View details for ${product.name}`}>
            <h3 className="text-xl font-serif font-bold text-brand-dark truncate">{product.name}</h3>
        </button>
        
        <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className={`text-xl font-bold font-sans ${onSale ? 'text-red-500' : 'text-brand-dark'}`}>
                {hasMultiplePrices && "From "}${displayPrice.toFixed(2)}
              </span>
              {onSale && (
                  <span className="text-md font-sans text-gray-500 line-through">${defaultVariant.price.toFixed(2)}</span>
              )}
            </div>
        </div>

        <div className="mt-auto pt-3">
            <div className="flex items-center h-[20px]">
              {averageRating ? (
                <>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <StarIcon 
                        key={index} 
                        className={`w-5 h-5 ${index < roundedRating ? 'text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">({product.reviews.length})</span>
                </>
              ) : (
                <span className="text-sm text-gray-400 italic">No reviews</span>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);
