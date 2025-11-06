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
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { TagIcon } from './icons/TagIcon';
import { imageErrorHandlers } from '../utils/imageHelpers';
import { useDarkMode } from '../hooks/useDarkMode';
import { motion } from 'framer-motion';
import FreeShippingBanner from './FreeShippingBanner';

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
  onSelectCategory,
}) => {
  const [isAutocompleteOpen, setAutocompleteOpen] = useState(false);
  const [isMiniCartOpen, setMiniCartOpen] = useState(false);
  const [isProductsOpen, setProductsOpen] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const [cartBounce, setCartBounce] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const prevCartCountRef = useRef<number>(0);

  const cartItemCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  // Trigger bounce animation when cart count increases
  useEffect(() => {
    const prevCount = prevCartCountRef.current;
    if (cartItemCount > prevCount && prevCount !== 0) {
      // Use setTimeout to avoid setState during effect
      const timer = setTimeout(() => {
        setCartBounce(true);
        setTimeout(() => setCartBounce(false), 600);
      }, 0);
      // Update ref after checking (refs can be updated in effects)
      prevCartCountRef.current = cartItemCount;
      return () => clearTimeout(timer);
    }
    prevCartCountRef.current = cartItemCount;
  }, [cartItemCount]);

  const autocompleteResults = useMemo(() => {
    if (!searchQuery) return { products: [], categories: [] };

    const query = searchQuery.toLowerCase();

    // Find matching products
    const matchingProducts = allProducts
      .filter((p) => p.name.toLowerCase().includes(query))
      .slice(0, 4);

    // Find matching categories
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

  // Mini cart hover handling with delay (using useRef to avoid reassignment)
  const miniCartTimeoutRef = React.useRef<number | undefined>(undefined);
  const handleMiniCartEnter = () => {
    if (miniCartTimeoutRef.current) {
      clearTimeout(miniCartTimeoutRef.current);
    }
    setMiniCartOpen(true);
  };
  const handleMiniCartLeave = () => {
    miniCartTimeoutRef.current = window.setTimeout(() => setMiniCartOpen(false), 200);
  };

  // Products dropdown hover handling with delay (using useRef to avoid reassignment)
  const productsTimeoutRef = React.useRef<number | undefined>(undefined);
  const handleProductsEnter = () => {
    if (productsTimeoutRef.current) {
      clearTimeout(productsTimeoutRef.current);
    }
    setProductsOpen(true);
  };
  const handleProductsLeave = () => {
    productsTimeoutRef.current = window.setTimeout(() => setProductsOpen(false), 300);
  };

  return (
    <header className="bg-brand-light/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 fixed top-0 w-full z-50 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a
              href="#/"
                    <FreeShippingBanner />
              className="text-3xl font-serif font-bold text-brand-dark dark:text-gray-100 transition-colors duration-300"
            >
              Tattva Co.
            </a>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#/"
              className="text-brand-dark dark:text-gray-100 hover:text-brand-primary dark:hover:text-brand-primary transition-colors duration-300"
            >
              Home
            </a>
            <div
              className="relative"
              onMouseEnter={handleProductsEnter}
              onMouseLeave={handleProductsLeave}
            >
              <button className="flex items-center gap-1 text-brand-dark hover:text-brand-primary transition-colors duration-300">
                Products <ChevronDownIcon className="h-4 w-4" />
              </button>
              {isProductsOpen && (
                <div
                  className="absolute top-full mt-2 w-48 bg-white rounded-lg shadow-lg border z-10 animate-fade-in-fast"
                  onMouseEnter={handleProductsEnter}
                  onMouseLeave={handleProductsLeave}
                >
                  <ul>
                    {categories.map((category) => (
                      <li key={category}>
                        <button
                          onClick={() => {
                            // Close dropdown immediately
                            setProductsOpen(false);

                            // Set the category first
                            onSelectCategory(category);

                            // Check if we need to navigate to home page
                            const currentHash = window.location.hash;
                            const needsNavigation =
                              currentHash !== '#/' && currentHash !== '' && currentHash !== '#';

                            if (needsNavigation) {
                              // Navigate to home page first
                              window.location.hash = '#/';
                            }

                            // Scroll to products section after a delay
                            const scrollDelay = needsNavigation ? 500 : 150;
                            setTimeout(() => {
                              const productsSection = document.getElementById('products-section');

                              if (productsSection) {
                                const headerOffset = 100;
                                const elementPosition = productsSection.getBoundingClientRect().top;
                                const offsetPosition =
                                  elementPosition + window.pageYOffset - headerOffset;

                                window.scrollTo({
                                  top: offsetPosition,
                                  behavior: 'smooth',
                                });
                              } else {
                                console.error('Products section not found!');
                              }
                            }, scrollDelay);
                          }}
                          className="w-full text-left p-3 hover:bg-brand-secondary/30 transition-colors text-sm"
                        >
                          {category}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <a
              href="#/recipes"
              className="text-brand-dark hover:text-brand-primary transition-colors duration-300"
            >
              Recipes
            </a>
            <a
              href="#/blog"
              className="text-brand-dark hover:text-brand-primary transition-colors duration-300"
            >
              Blog
            </a>
            <a
              href="#/contact"
              className="text-brand-dark hover:text-brand-primary transition-colors duration-300"
            >
              Contact
            </a>
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
              {isAutocompleteOpen &&
                (autocompleteResults.products.length > 0 ||
                  autocompleteResults.categories.length > 0) && (
                  <div className="absolute top-full mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 animate-fade-in-up overflow-hidden">
                    {/* Categories Section */}
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
                                className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-brand-primary/10 hover:to-amber-50 transition-all group"
                              >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-amber-600 flex items-center justify-center flex-shrink-0">
                                  <TagIcon className="h-4 w-4 text-white" />
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

                    {/* Products Section */}
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
                                className="w-full text-left flex items-center gap-4 px-4 py-3 hover:bg-gradient-to-r hover:from-brand-primary/10 hover:to-amber-50 transition-all group"
                              >
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                                  onError={imageErrorHandlers.thumb}
                                />
                                <div className="flex-1">
                                  <p className="font-medium text-gray-800 group-hover:text-brand-primary transition-colors">
                                    {product.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    ${product.variants[0].salePrice || product.variants[0].price}
                                  </p>
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Search All Results */}
                    {searchQuery && (
                      <div className="border-t border-gray-100 bg-gray-50">
                        <button
                          onClick={() => {
                            setAutocompleteOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm font-medium text-brand-primary hover:bg-brand-primary/10 transition-colors flex items-center justify-between group"
                        >
                          <span>View all results for &quot;{searchQuery}&quot;</span>
                          <ChevronRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
            </div>
            {isLoggedIn && (
              <>
                {isAdmin && (
                  <a
                    href="#/admin"
                    className="relative p-2 rounded-full text-brand-dark dark:text-gray-100 hover:bg-brand-secondary/30 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Admin Dashboard"
                  >
                    <CogIcon className="h-6 w-6" />
                  </a>
                )}
                <a
                  href="#/profile"
                  className="relative p-2 rounded-full text-brand-dark dark:text-gray-100 hover:bg-brand-secondary/30 dark:hover:bg-gray-700 transition-colors"
                  aria-label="User Profile"
                >
                  <UserIcon className="h-6 w-6" />
                </a>
              </>
            )}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="relative p-2 rounded-full text-brand-dark dark:text-gray-100 hover:bg-brand-secondary/30 dark:hover:bg-gray-700 transition-all duration-300"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
            </button>
            <button
              onClick={onWishlistClick}
              className="relative p-2 rounded-full text-brand-dark dark:text-gray-100 hover:bg-brand-secondary/30 dark:hover:bg-gray-700 transition-colors"
              aria-label={`View your wishlist (${wishlistItemCount} items)`}
            >
              <HeartIcon className="h-6 w-6" />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-white text-xs font-bold">
                  {wishlistItemCount}
                </span>
              )}
            </button>
            <div
              className="relative"
              onMouseEnter={handleMiniCartEnter}
              onMouseLeave={handleMiniCartLeave}
            >
              <motion.div
                animate={
                  cartBounce
                    ? {
                        scale: [1, 1.2, 0.9, 1.1, 1],
                        rotate: [0, -10, 10, -5, 0],
                      }
                    : {}
                }
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...({} as any)}
              >
                <button
                  onClick={onCartClick}
                  className="relative p-2 rounded-full text-brand-dark dark:text-gray-100 hover:bg-brand-secondary/30 dark:hover:bg-gray-700 transition-colors"
                  aria-label={`View your cart (${cartItemCount} items)`}
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  {cartItemCount > 0 && (
                    <motion.span
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-white text-xs font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      key={cartItemCount}
                      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      {...({} as any)}
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </button>
              </motion.div>
              {isMiniCartOpen && <MiniCart items={cartItems} subtotal={subtotal} />}
            </div>
            {isLoggedIn ? (
              <SignOutButton className="bg-brand-dark text-white font-bold py-2 px-4 rounded-full text-sm hover:bg-opacity-80 transition-colors" />
            ) : (
              <button
                onClick={() => (window.location.hash = '#/login')}
                className="bg-brand-dark text-white font-bold py-2 px-4 rounded-full text-sm hover:bg-opacity-80 transition-colors"
              >
                Login
              </button>
            )}
            <button
              onClick={onMobileMenuClick}
              className="md:hidden p-2 rounded-full text-brand-dark hover:bg-brand-secondary/30 transition-colors"
              aria-label="Open navigation menu"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
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
