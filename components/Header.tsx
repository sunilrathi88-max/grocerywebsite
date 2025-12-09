import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { HeartIcon } from './icons/HeartIcon';
import { MenuIcon } from './icons/MenuIcon';
import { UserIcon } from './icons/UserIcon';
import { CogIcon } from './icons/CogIcon';
import { MoonIcon } from './icons/MoonIcon';
import { SunIcon } from './icons/SunIcon';
import { Product, CartItem } from '../types';
import SignOutButton from './SignOutButton';
import MiniCart from './MiniCart';
import { TagIcon } from './icons/TagIcon';
import { SearchIcon } from './icons/SearchIcon';
import Navigation from './Navigation';
import { imageErrorHandlers } from '../utils/imageHelpers';
import { useDarkMode } from '../hooks/useDarkMode';
import { motion, AnimatePresence } from 'framer-motion';

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
  onLogoutClick: () => void; // Keep for interface compatibility, ignore unused warning for now
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
  onLogoutClick: _onLogoutClick,
  allProducts,
  onSelectProduct,
  subtotal,
  categories,
  onSelectCategory,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProductsOpen, setProductsOpen] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const [isAutocompleteOpen, setAutocompleteOpen] = useState(false);
  const [isMiniCartOpen, setMiniCartOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const prevCartCountRef = useRef<number>(0);

  const cartItemCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trigger bounce animation when cart count increases
  useEffect(() => {
    const prevCount = prevCartCountRef.current;
    if (cartItemCount > prevCount && prevCount !== 0) {
      const timer = setTimeout(() => {
        setCartBounce(true);
        setTimeout(() => setCartBounce(false), 600);
      }, 0);
      prevCartCountRef.current = cartItemCount;
      return () => clearTimeout(timer);
    }
    prevCartCountRef.current = cartItemCount;
  }, [cartItemCount]);

  const autocompleteResults = useMemo(() => {
    if (!searchQuery) return { products: [], categories: [] };
    const query = searchQuery.toLowerCase();
    const matchingProducts = allProducts
      .filter((p) => p.name.toLowerCase().includes(query))
      .slice(0, 4);
    const matchingCategories = categories
      .filter((cat) => cat.toLowerCase() !== 'all' && cat.toLowerCase().includes(query))
      .slice(0, 2);
    return { products: matchingProducts, categories: matchingCategories };
  }, [searchQuery, allProducts, categories]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setAutocompleteOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchContainerRef]);

  // Mini cart hover handling
  const miniCartTimeoutRef = useRef<number | undefined>(undefined);
  const handleMiniCartEnter = () => {
    if (miniCartTimeoutRef.current) clearTimeout(miniCartTimeoutRef.current);
    setMiniCartOpen(true);
  };
  const handleMiniCartLeave = () => {
    miniCartTimeoutRef.current = window.setTimeout(() => setMiniCartOpen(false), 200);
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-warning-yellow/10 text-brand-dark py-2 px-4 md:px-16 text-center text-sm font-medium hidden md:block">
        🎉 Free shipping on all orders over ₹999 | Lab-tested purity guaranteed
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-sm' : 'bg-white border-b border-neutral-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-16 h-20 flex items-center justify-between gap-8">
          {/* Left: Logo */}
          <div
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
            onClick={() => (window.location.hash = '#/')}
          >
            <span className="text-2xl font-serif font-bold text-neutral-900 tracking-tight">
              Tattva Co.
            </span>
          </div>

          {/* Center: Navigation (Desktop) */}
          <Navigation
            categories={categories}
            onSelectCategory={onSelectCategory}
            isProductsOpen={isProductsOpen}
            setProductsOpen={setProductsOpen}
          />

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block" ref={searchContainerRef}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setAutocompleteOpen(true)}
                className="w-48 focus:w-64 transition-all duration-300 bg-neutral-100 border-none rounded-full py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-brand-primary/20 placeholder-neutral-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
                <SearchIcon className="w-4 h-4" />
              </span>

              {/* Autocomplete Dropdown */}
              {isAutocompleteOpen &&
                (autocompleteResults.products.length > 0 ||
                  autocompleteResults.categories.length > 0) && (
                  <div className="absolute top-full mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 animate-fade-in-up overflow-hidden right-0">
                    {/* Categories */}
                    {autocompleteResults.categories.length > 0 && (
                      <div className="border-b border-gray-100">
                        <div className="px-4 py-2 bg-gray-50">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                            Categories
                          </p>
                        </div>
                        <ul>
                          {autocompleteResults.categories.map((category) => (
                            <li key={category}>
                              <button
                                onClick={() => {
                                  onSelectCategory(category);
                                  setAutocompleteOpen(false);
                                  onSearchChange('');
                                }}
                                className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-all group"
                              >
                                <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                                  <TagIcon className="h-4 w-4 text-brand-primary" />
                                </div>
                                <span className="font-medium text-gray-800 group-hover:text-brand-primary transition-colors">
                                  {category}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Products */}
                    {autocompleteResults.products.length > 0 && (
                      <div>
                        <div className="px-4 py-2 bg-gray-50">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                            Products
                          </p>
                        </div>
                        <ul>
                          {autocompleteResults.products.map((product) => (
                            <li key={product.id}>
                              <button
                                onClick={() => {
                                  onSelectProduct(product);
                                  setAutocompleteOpen(false);
                                  onSearchChange('');
                                }}
                                className="w-full text-left flex items-center gap-4 px-4 py-3 hover:bg-neutral-50 transition-all group"
                              >
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded-lg shadow-sm"
                                  onError={imageErrorHandlers.thumb}
                                />
                                <div className="flex-1">
                                  <p className="font-medium text-gray-800 group-hover:text-brand-primary transition-colors">
                                    {product.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Rs. {product.variants[0].salePrice || product.variants[0].price}
                                  </p>
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
            </div>

            {/* Mobile Search Toggle */}
            <button
              className="md:hidden text-neutral-700"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <SearchIcon className="w-6 h-6" />
            </button>

            {/* Wishlist */}
            <button
              onClick={onWishlistClick}
              className="relative p-2 text-neutral-700 hover:text-brand-secondary transition-colors"
            >
              <HeartIcon className="w-6 h-6" />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-secondary text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistItemCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <div
              className="relative group"
              onMouseEnter={handleMiniCartEnter}
              onMouseLeave={handleMiniCartLeave}
            >
              <motion.div
                animate={
                  cartBounce ? { scale: [1, 1.2, 0.9, 1.1, 1], rotate: [0, -10, 10, -5, 0] } : {}
                }
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <button
                  data-testid="header-cart-btn"
                  onClick={onCartClick}
                  className="relative p-2 text-neutral-700 hover:text-brand-primary transition-colors"
                >
                  <ShoppingCartIcon className="w-6 h-6" />
                  {cartItemCount > 0 && (
                    <span
                      data-testid="cart-badge"
                      className="absolute -top-0.5 -right-0.5 bg-brand-primary text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center"
                    >
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </motion.div>
              {isMiniCartOpen && (
                <div className="absolute top-full right-0 pt-2 hidden group-hover:block z-50">
                  <MiniCart items={cartItems} subtotal={subtotal} />
                </div>
              )}
            </div>

            {/* User / Login */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button
                    onClick={() => (window.location.hash = '#/admin')}
                    className="p-2 text-neutral-700 hover:text-brand-primary"
                  >
                    <CogIcon className="w-6 h-6" />
                  </button>
                )}
                <button
                  onClick={() => (window.location.hash = '#/profile')}
                  className="p-2 text-neutral-700 hover:text-brand-primary"
                >
                  <UserIcon className="w-6 h-6" />
                </button>
                <div className="hidden md:block">
                  <SignOutButton className="text-sm font-medium text-neutral-600 hover:text-brand-secondary" />
                </div>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="hidden md:block bg-brand-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-all shadow-button active:transform active:scale-95"
              >
                Login
              </button>
            )}

            {/* Dark Mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-neutral-700 hover:text-brand-primary transition-colors"
            >
              {darkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
            </button>

            {/* Mobile Menu */}
            <button className="md:hidden p-2 text-neutral-700" onClick={onMobileMenuClick}>
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Search Expanded */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-neutral-200 bg-white px-4 py-3 overflow-hidden"
            >
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-neutral-100 border-none rounded-lg py-3 pl-4 pr-10 text-base focus:ring-2 focus:ring-brand-primary/20"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <style>{`
          @keyframes fade-in-fast {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out forwards; }
        `}</style>
      </header>
    </>
  );
};
export default React.memo(Header);
