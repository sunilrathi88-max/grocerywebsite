import React from 'react';
import { Product } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { HeartIcon } from './icons/HeartIcon';
import { StarIcon } from './icons/StarIcon';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onSelectProduct: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onToggleWishlist, isWishlisted, onSelectProduct }) => {
  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : null;
  
  const roundedRating = averageRating ? Math.round(averageRating) : 0;
  const isOutOfStock = product.stock === 0;
  const onSale = product.salePrice && product.salePrice < product.price;

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden group transform hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-brand-primary/50 hover:shadow-xl">
      <div className="relative">
        <div onClick={() => onSelectProduct(product)} className="cursor-pointer" role="button" tabIndex={0} onKeyPress={(e) => e.key === 'Enter' && onSelectProduct(product)}>
          <img className="h-56 w-full object-cover" src={product.imageUrl} alt={product.name} />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
           {isOutOfStock && (
            <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center">
                <span className="bg-brand-dark text-white font-bold py-2 px-4 rounded-full">Out of Stock</span>
            </div>
          )}
        </div>
        <button
          onClick={() => onToggleWishlist(product)}
          className="absolute top-3 right-3 bg-white/70 backdrop-blur-sm p-2 rounded-full text-brand-dark hover:text-red-500 transition-colors duration-300 z-10"
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <HeartIcon className={`h-6 w-6 ${isWishlisted ? 'text-red-500 fill-current' : 'fill-transparent stroke-current'}`} />
        </button>
      </div>
      <div className="p-5">
        <h3 onClick={() => onSelectProduct(product)} className="text-xl font-serif font-bold text-brand-dark cursor-pointer">{product.name}</h3>
        <p className="text-gray-600 mt-2 text-sm h-10">{product.description}</p>
        
        <div className="flex items-center mt-3 h-[20px]" role="group" aria-label={averageRating ? `Rating: ${averageRating.toFixed(1)} out of 5 stars` : 'No ratings yet'}>
          {averageRating ? (
            <>
              <div className="flex" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon 
                    key={index} 
                    className={`w-5 h-5 ${index < roundedRating ? 'text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">({product.reviews.length} reviews)</span>
            </>
          ) : (
            <span className="text-sm text-gray-400">No reviews yet</span>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div>
            {onSale ? (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-red-500 font-sans">${product.salePrice!.toFixed(2)}</span>
                <span className="text-lg font-sans text-gray-500 line-through" aria-label={`Original price $${product.price.toFixed(2)}`}>${product.price.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-brand-dark font-sans">${product.price.toFixed(2)}</span>
            )}
          </div>
          <button 
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className="flex items-center gap-2 bg-brand-primary text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-brand-primary/90 transform hover:scale-105 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            aria-label={isOutOfStock ? `${product.name} is out of stock` : `Add ${product.name} to cart`}
          >
            <PlusIcon />
            Add
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;