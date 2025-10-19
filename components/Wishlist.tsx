import React from 'react';
import { Product, Variant } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { HeartIcon } from './icons/HeartIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { PinterestIcon } from './icons/PinterestIcon';

interface WishlistProps {
  items: Product[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, variant: Variant) => void;
  onClose: () => void;
}

const Wishlist: React.FC<WishlistProps> = ({ items, onToggleWishlist, onAddToCart, onClose }) => {
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    if (!img.src.startsWith('data:image/svg+xml')) {
      img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjhFM0Q5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzMzMzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlRhdHR2YSBDby48L3RleHQ+PC9zdmc+';
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        <HeartIcon className="h-20 w-20 text-gray-300" />
        <h3 className="mt-4 text-xl font-serif font-bold text-brand-dark">Your Wishlist is Empty</h3>
        <p className="mt-2 text-gray-500">Explore our products and save your favorites!</p>
        <button 
          onClick={onClose}
          className="mt-6 bg-brand-primary text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300"
        >
          Discover Products
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
        <div className="flex-grow space-y-4 pr-2 -mr-2 overflow-y-auto">
        {items.map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between border-b pb-4 last:border-b-0 last:pb-0 gap-4">
            <div className="flex items-center gap-4 flex-grow">
                <img 
                src={item.images[0]} 
                alt={item.name} 
                className="w-20 h-20 object-cover rounded-md bg-gray-200" 
                loading="lazy"
                onError={handleImageError}
                />
                <div className="flex-grow">
                <p className="font-bold text-brand-dark text-lg">{item.name}</p>
                <p className="text-xl font-bold text-brand-primary font-sans">${(item.variants[0].salePrice ?? item.variants[0].price).toFixed(2)}</p>
                </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
                <button 
                onClick={() => onAddToCart(item, item.variants[0])}
                disabled={item.variants.every(v => v.stock === 0)}
                className="flex items-center gap-2 bg-brand-primary text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-brand-primary/90 transform hover:scale-105 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                aria-label={`Add ${item.name} to cart`}
                >
                <PlusIcon />
                Add to Cart
                </button>
                <button 
                onClick={() => onToggleWishlist(item)}
                className="p-2 rounded-full text-red-500 hover:bg-red-100 transition-colors"
                aria-label={`Remove ${item.name} from wishlist`}
                >
                <HeartIcon className="h-6 w-6 fill-current" />
                </button>
            </div>
            </div>
        ))}
        </div>
        
        <div className="mt-8 border-t pt-6 text-center">
            <h4 className="font-bold text-brand-dark mb-4">Share Your Wishlist</h4>
            <div className="flex justify-center items-center gap-4">
                <a href="#" aria-label="Share on Facebook" className="text-gray-500 hover:text-brand-dark transition-colors"><FacebookIcon /></a>
                <a href="#" aria-label="Share on Twitter" className="text-gray-500 hover:text-brand-dark transition-colors"><TwitterIcon /></a>
                <a href="#" aria-label="Share on Pinterest" className="text-gray-500 hover:text-brand-dark transition-colors"><PinterestIcon /></a>
            </div>
        </div>
    </div>
  );
};

export default Wishlist;