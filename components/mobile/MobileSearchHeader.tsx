import React from 'react';
import { ShoppingCartIcon } from '../icons/ShoppingCartIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { XIcon } from '../icons/XIcon';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';

interface MobileSearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  onBack: () => void;
  onCartClick: () => void;
  cartItemCount: number;
  placeholder?: string;
}

const MobileSearchHeader: React.FC<MobileSearchHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  onBack,
  onCartClick,
  cartItemCount,
  placeholder = 'Search for spices, masalas...',
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-amber-50/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-amber-100 dark:border-stone-700">
      {/* Status Bar Spacer */}
      <div className="h-10 w-full" />

      <div className="px-4 pb-3 pt-1 flex items-center gap-3">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
          aria-label="Go back"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>

        {/* Search Input */}
        <div className="flex flex-1 items-center rounded-lg bg-white dark:bg-stone-800 shadow-sm border border-amber-100 dark:border-stone-700 h-12 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-amber-500/50">
          <div className="flex items-center justify-center pl-3 text-stone-500 dark:text-stone-400">
            <SearchIcon className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="flex h-full w-full bg-transparent px-3 text-base font-medium text-stone-900 dark:text-white placeholder:text-stone-500 focus:outline-none border-none focus:ring-0"
          />
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className="flex items-center justify-center pr-3 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
              aria-label="Clear search"
            >
              <XIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Cart Button */}
        <button
          onClick={onCartClick}
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
          aria-label="View cart"
        >
          <ShoppingCartIcon className="w-6 h-6" />
          {cartItemCount > 0 && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white">
              {cartItemCount > 9 ? '9+' : cartItemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default MobileSearchHeader;
