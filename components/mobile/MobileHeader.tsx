import React from 'react';
import { ShoppingCartIcon } from '../icons/ShoppingCartIcon';
import { SearchIcon } from '../icons/SearchIcon';

interface MobileHeaderProps {
  brandName?: string;
  cartItemCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCartClick: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  brandName = 'Rathi Naturals',
  cartItemCount,
  searchQuery,
  onSearchChange,
  onCartClick,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-amber-50/95 dark:bg-stone-900/95 backdrop-blur-sm border-b border-amber-100 dark:border-stone-800 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Brand Name - Centered */}
        <h1 className="font-serif font-bold text-xl tracking-tight text-stone-900 dark:text-stone-100">
          {brandName}
        </h1>

        {/* Cart Button */}
        <button
          onClick={onCartClick}
          className="p-2 text-stone-900 dark:text-stone-100 rounded-full hover:bg-amber-100 dark:hover:bg-stone-800 transition relative"
          aria-label="View cart"
        >
          <ShoppingCartIcon className="w-6 h-6" />
          {cartItemCount > 0 && (
            <span className="absolute top-1 right-1 bg-amber-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
              {cartItemCount > 9 ? '9+' : cartItemCount}
            </span>
          )}
        </button>
      </div>

      {/* Search Bar */}
      <div className="mt-3 relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search for spices, masalas..."
          className="w-full bg-white dark:bg-stone-800 border-none rounded-full py-2.5 pl-10 pr-4 text-sm shadow-sm focus:ring-2 focus:ring-amber-500/50 text-stone-900 dark:text-stone-100 placeholder-stone-500 dark:placeholder-stone-400"
        />
        <SearchIcon className="absolute left-3 top-2.5 text-stone-500 dark:text-stone-400 w-5 h-5" />
      </div>
    </header>
  );
};

export default MobileHeader;
