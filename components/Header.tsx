import React from 'react';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { HeartIcon } from './icons/HeartIcon';

interface HeaderProps {
    cartItemCount: number;
    wishlistItemCount: number;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemCount, wishlistItemCount, searchQuery, onSearchChange }) => {
  return (
    <header className="bg-brand-light/80 backdrop-blur-lg border-b border-gray-200 fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a href="#" className="text-3xl font-serif font-bold text-brand-dark">
              Tattva Co.
            </a>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-brand-dark hover:text-brand-primary transition-colors duration-300">Home</a>
            <a href="#" className="text-brand-dark hover:text-brand-primary transition-colors duration-300">Products</a>
            <a href="#" className="text-brand-dark hover:text-brand-primary transition-colors duration-300">About Us</a>
            <a href="#" className="text-brand-dark hover:text-brand-primary transition-colors duration-300">Recipes</a>
          </nav>
          <div className="flex items-center space-x-2">
            <div className="relative hidden sm:block">
              <input 
                type="search" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="bg-white border border-gray-300 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-300 w-40"
              />
            </div>
            <button className="relative p-2 rounded-full text-brand-dark hover:bg-brand-secondary/30 transition-colors">
              <HeartIcon className="h-6 w-6" />
               {wishlistItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-white text-xs font-bold">
                  {wishlistItemCount}
                </span>
              )}
            </button>
            <button className="relative p-2 rounded-full text-brand-dark hover:bg-brand-secondary/30 transition-colors">
              <ShoppingCartIcon />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-white text-xs font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;