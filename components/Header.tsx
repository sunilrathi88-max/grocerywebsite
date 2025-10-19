import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { HeartIcon } from './icons/HeartIcon';
import { MenuIcon } from './icons/MenuIcon';
import { UserIcon } from './icons/UserIcon';
import { CogIcon } from './icons/CogIcon';
import { Product, CartItem } from '../types';
import MiniCart from './MiniCart';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/100x100/F8E3D9/333333?text=Tattva+Co.';

interface HeaderProps {
    cartItems: CartItem[];
    wishlistItemCount: number;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onCartClick: () => void;
    onWishlistClick: () => void;
    onMobileMenuClick: () => void;
    isLoggedIn: boolean;
    isAdmin: boolean;
    onLoginClick: () => void;
    onLogoutClick: () => void;
    allProducts: Product[];
    onSelectProduct: (product: Product) => void;
    subtotal: number;
    categories: string[];
    onSelectCategory: (category: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
    cartItems,
    wishlistItemCount, 
    searchQuery, 
    onSearchChange, 
    onCartClick, 
    onWishlistClick,
    onMobileMenuClick,
    isLoggedIn,
    isAdmin,
    onLoginClick,
    onLogoutClick,
    allProducts,
    onSelectProduct,
    subtotal,
    categories,
    onSelectCategory
}) => {
  const [isAutocompleteOpen, setAutocompleteOpen] = useState(false);
  const [isMiniCartOpen, setMiniCartOpen] = useState(false);
  const [isProductsOpen, setProductsOpen] = useState(false);
  
  // Handle image load errors with branded placeholder
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    if (img.src !== PLACEHOLDER_IMAGE) {
      img.src = PLACEHOLDER_IMAGE;
    }
  };
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  const cartItemCount = useMemo(() => cartItems.reduce((total, item) => total + item.quantity, 0), [cartItems]);

  const autocompleteResults = useMemo(() => {
    if (!searchQuery) return [];
    return allProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);
  }, [searchQuery, allProducts]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setAutocompleteOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchContainerRef]);

  let miniCartTimeout: number;
  const handleMiniCartEnter = () => {
      clearTimeout(miniCartTimeout);
      setMiniCartOpen(true);
  };
  const handleMiniCartLeave = () => {
      miniCartTimeout = window.setTimeout(() => setMiniCartOpen(false), 200);
  };

  return (
    <header className="bg-brand-light/80 backdrop-blur-lg border-b border-gray-200 fixed top-0 w-full z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a href="#/" className="text-3xl font-serif font-bold text-brand-dark">
              Tattva Co.
            </a>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#/" className="text-brand-dark hover:text-brand-primary transition-colors duration-300">Home</a>
            <div className="relative" onMouseEnter={() => setProductsOpen(true)} onMouseLeave={() => setProductsOpen(false)}>
              <button className="flex items-center gap-1 text-brand-dark hover:text-brand-primary transition-colors duration-300">
                  Products <ChevronDownIcon className="h-4 w-4" />
              </button>
              {isProductsOpen && (
                  <div className="absolute top-full mt-2 w-48 bg-white rounded-lg shadow-lg border z-10 animate-fade-in-fast">
                      <ul>
                          {categories.map(category => (
                              <li key={category}>
                                  <button onClick={() => { onSelectCategory(category); setProductsOpen(false); }} className="w-full text-left p-3 hover:bg-brand-secondary/30 transition-colors text-sm">
                                      {category}
                                  </button>
                              </li>
                          ))}
                      </ul>
                  </div>
              )}
            </div>
            <a href="#/recipes" className="text-brand-dark hover:text-brand-primary transition-colors duration-300">Recipes</a>
            <a href="#/blog" className="text-brand-dark hover:text-brand-primary transition-colors duration-300">Blog</a>
            <a href="#/contact" className="text-brand-dark hover:text-brand-primary transition-colors duration-300">Contact</a>
          </nav>
          <div className="flex items-center space-x-2">
            <div className="relative hidden sm:block" ref={searchContainerRef}>
              <input 
                type="search" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setAutocompleteOpen(true)}
                className="bg-white border border-gray-300 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-300 w-40"
              />
              {isAutocompleteOpen && autocompleteResults.length > 0 && (
                <div className="absolute top-full mt-2 w-80 bg-white rounded-lg shadow-lg border z-10">
                  <ul>
                    {autocompleteResults.map(product => (
                      <li key={product.id}>
                        <button onClick={() => { onSelectProduct(product); setAutocompleteOpen(false); onSearchChange(''); }} className="w-full text-left flex items-center gap-4 p-3 hover:bg-brand-secondary/30 transition-colors">
                          <img src={product.images[0] || PLACEHOLDER_IMAGE} alt={product.name} className="w-10 h-10 object-cover rounded-md" onError={handleImageError} />
                          <span>{product.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {isLoggedIn && (
                <>
                  {isAdmin && ( <a href="#/admin" className="relative p-2 rounded-full text-brand-dark hover:bg-brand-secondary/30 transition-colors" aria-label="Admin Dashboard"><CogIcon className="h-6 w-6" /></a>)}
                  <a href="#/profile" className="relative p-2 rounded-full text-brand-dark hover:bg-brand-secondary/30 transition-colors" aria-label="User Profile"><UserIcon className="h-6 w-6" /></a>
                </>
            )}
            <button onClick={onWishlistClick} className="relative p-2 rounded-full text-brand-dark hover:bg-brand-secondary/30 transition-colors" aria-label={`View your wishlist (${wishlistItemCount} items)`}>
              <HeartIcon className="h-6 w-6" />
               {wishlistItemCount > 0 && (<span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-white text-xs font-bold">{wishlistItemCount}</span>)}
            </button>
            <div className="relative" onMouseEnter={handleMiniCartEnter} onMouseLeave={handleMiniCartLeave}>
                <button onClick={onCartClick} className="relative p-2 rounded-full text-brand-dark hover:bg-brand-secondary/30 transition-colors" aria-label={`View your cart (${cartItemCount} items)`}>
                    <ShoppingCartIcon className="h-6 w-6" />
                    {cartItemCount > 0 && (<span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-white text-xs font-bold">{cartItemCount}</span>)}
                </button>
                {isMiniCartOpen && <MiniCart items={cartItems} subtotal={subtotal} />}
            </div>
             <button onClick={isLoggedIn ? onLogoutClick : onLoginClick} className="hidden sm:block bg-brand-dark text-white font-bold py-2 px-4 rounded-full text-sm hover:bg-opacity-80 transition-colors">{isLoggedIn ? 'Logout' : 'Login'}</button>
            <button onClick={onMobileMenuClick} className="md:hidden p-2 rounded-full text-brand-dark hover:bg-brand-secondary/30 transition-colors" aria-label="Open navigation menu"><MenuIcon className="h-6 w-6" /></button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-fast {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out forwards; }
      `}</style>
    </header>
  );
};

export default React.memo(Header);
