import React from 'react';
import { Product } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { HeartIcon } from './icons/HeartIcon';

interface WishlistProps {
  items: Product[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ items, onToggleWishlist, onAddToCart }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Your wishlist is empty.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between border-b pb-4 last:border-b-0 last:pb-0 gap-4">
            <div className="flex items-center gap-4 flex-grow">
              <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
              <div className="flex-grow">
                <p className="font-bold text-brand-dark text-lg">{item.name}</p>
                <p className="text-xl font-bold text-brand-primary font-sans">${item.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <button 
                onClick={() => onAddToCart(item)}
                className="flex items-center gap-2 bg-brand-primary text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-brand-primary/90 transform hover:scale-105 transition-all duration-300"
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
    </div>
  );
};

export default React.memo(Wishlist);