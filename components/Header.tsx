import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { HeartIcon } from './icons/HeartIcon';
import { MenuIcon } from './icons/MenuIcon';
import { UserIcon } from './icons/UserIcon';
import { CogIcon } from './icons/CogIcon';
import { MoonIcon } from './icons/MoonIcon';
import { SunIcon } from './icons/SunIcon';
import { Product } from '../types';
import SignOutButton from './SignOutButton';
import { MiniCartItem } from './MiniCart';
const MiniCart = React.lazy(() => import('./MiniCart'));
import { TagIcon } from './icons/TagIcon';
import { SearchIcon } from './icons/SearchIcon';
import Navigation from './Navigation';
import { imageErrorHandlers } from '../utils/imageHelpers';
import { useDarkMode } from '../hooks/useDarkMode';
import { m, AnimatePresence } from 'framer-motion';
import { fuzzySearch, getSuggestions } from '../utils/searchUtils';

interface HeaderProps {
  cartItems: MiniCartItem[];
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
  categories: string[];
  onSelectCategory: (category: string) => void;
  onRemoveItem?: (id: string) => void;
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
  categories,
  onSelectCategory,
  onRemoveItem,
}) => {
  const navigate = useNavigate();
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

  // Import search utils
  // import { fuzzySearch, getSuggestions } from '../utils/searchUtils';

  const autocompleteResults = useMemo(() => {
    if (!searchQuery) return { products: [], categories: [], suggestions: [] };

    // Use fuzzy search for products
    const matchingProducts = fuzzySearch(searchQuery, allProducts).slice(0, 4);

    // Fuzzy matching for categories
    const matchingCategories = categories
      .filter(
        (cat) =>
          cat.toLowerCase() !== 'all' && cat.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 2);

    // Get suggestions if low on results
    let suggestions: string[] = [];
    if (matchingProducts.length === 0 && matchingCategories.length === 0) {
      const allNames = allProducts.map((p) => p.name);
      suggestions = getSuggestions(searchQuery, [...allNames, ...categories]);
    }

    return { products: matchingProducts, categories: matchingCategories, suggestions };
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
        🎉 Free shipping on all orders over ₹999!
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-sm' : 'bg-white border-b border-neutral-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-16 h-20 flex items-center justify-between gap-8">
          {/* Left: Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <span className="text-2xl font-serif font-bold text-neutral-900 tracking-tight">
              Tattva Co.
            </span>
          </Link>

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
                  autocompleteResults.categories.length > 0 ||
                  (autocompleteResults.suggestions &&
                    autocompleteResults.suggestions.length > 0)) && (
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

                    {/* "Did you mean?" Suggestions */}
                    {autocompleteResults.suggestions &&
                      autocompleteResults.suggestions.length > 0 && (
                        <div className="p-3 bg-yellow-50 border-t border-yellow-100">
                          <p className="text-xs font-bold text-yellow-700 uppercase tracking-wide mb-2">
                            Did you mean?
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {autocompleteResults.suggestions.map((term) => (
                              <button
                                key={term}
                                onClick={() => {
                                  onSearchChange(term);
                                  // Keep open to show results for new term
                                }}
                                className="text-sm text-yellow-800 bg-white border border-yellow-200 px-3 py-1 rounded-full hover:bg-yellow-100 transition-colors"
                              >
                                {term}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}
            </div>

            {/* Mobile Search Toggle */}
            <button
              className="md:hidden text-neutral-700"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Toggle search"
            >
              <SearchIcon className="w-6 h-6" />
            </button>

            {/* Wishlist */}
            <button
              onClick={onWishlistClick}
              className="relative p-2 text-neutral-700 hover:text-brand-secondary transition-colors"
              aria-label="View wishlist"
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
              <m.div
                animate={
                  cartBounce ? { scale: [1, 1.2, 0.9, 1.1, 1], rotate: [0, -10, 10, -5, 0] } : {}
                }
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <button
                  data-testid="header-cart-btn"
                  onClick={onCartClick}
                  className="relative p-2 text-neutral-700 hover:text-brand-primary transition-colors"
                  aria-label="View cart"
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
              </m.div>
              {isMiniCartOpen && (
                <div className="absolute top-full right-0 pt-2 hidden group-hover:block z-50">
                  <React.Suspense
                    fallback={
                      <div className="w-80 h-40 bg-white shadow-xl rounded-xl animate-pulse" />
                    }
                  >
                    <MiniCart
                      isOpen={true} // Always "open" when parent renders it
                      onClose={() => setMiniCartOpen(false)}
                      items={cartItems}
                      onCheckout={() => navigate('/checkout')}
                      onContinueShopping={() => setMiniCartOpen(false)}
                      onRemoveItem={(id) => {
                        if (onRemoveItem) onRemoveItem(id);
                      }}
                    />
                  </React.Suspense>
                </div>
              )}
            </div>

            {/* User / Login */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="p-2 text-neutral-700 hover:text-brand-primary"
                    aria-label="Admin dashboard"
                  >
                    <CogIcon className="w-6 h-6" />
                  </button>
                )}
                <button
                  onClick={() => navigate('/profile')}
                  className="p-2 text-neutral-700 hover:text-brand-primary"
                  aria-label="User profile"
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
              aria-label="Toggle dark mode"
            >
              {darkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
            </button>

            {/* Mobile Menu */}
            <button
              className="md:hidden p-2 text-neutral-700"
              onClick={onMobileMenuClick}
              aria-label="Open menu"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Search Expanded */}
        <AnimatePresence>
          {isSearchOpen && (
            <m.div
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
            </m.div>
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
