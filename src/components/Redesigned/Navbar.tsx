import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, X, FileText, ChevronRight, UserCircle, Menu } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import TrustBar from './TrustBar';
import { Product, BlogPost } from '../../../types';
import { fuzzySearchBlogs } from '../../../utils/searchUtils';
import { productAPI } from '../../../utils/apiService';
import { AnimatePresence, motion } from 'framer-motion';

interface NavbarProps {
  products: Product[];
  posts: BlogPost[];
}

const Navbar: React.FC<NavbarProps> = ({ products: _products, posts }) => {
  const { cartItemCount: totalItems } = useCart();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [supabaseProducts, setSupabaseProducts] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debounce query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch from Supabase
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setSupabaseProducts([]);
        return;
      }
      setIsSearching(true);
      try {
        const results = await productAPI.getAll({ search: debouncedQuery });
        setSupabaseProducts(results.slice(0, 4));
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    };
    fetchResults();
  }, [debouncedQuery]);

  const autocompleteResults = useMemo(() => {
    if (!query.trim()) return { products: [], posts: [] };
    const matchingPosts = fuzzySearchBlogs(query, posts).slice(0, 3);
    return { products: supabaseProducts, posts: matchingPosts };
  }, [query, posts, supabaseProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsFocused(false);
      navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="sticky top-0 z-[100]">
      <nav 
        className={`px-4 md:px-8 flex items-center justify-between transition-all duration-250 ease-in-out font-body
          ${isScrolled 
            ? 'h-[56px] bg-forest/95 backdrop-blur-md shadow-[0_2px_24px_rgba(0,0,0,0.12)]' 
            : 'h-[72px] bg-transparent'
          }
          md:bg-transparent max-md:bg-forest max-md:h-[64px] max-md:shadow-[0_2px_12px_rgba(0,0,0,0.15)]
        `}
      >
        {/* Logo */}
        <Link
          to="/"
          className="font-display text-2xl font-bold text-cream tracking-wide shrink-0 transition-colors"
        >
          RATHI NATURALS
        </Link>

        {/* Desktop Nav links */}
        <div className="hidden lg:flex items-center gap-2">
          {['Pantry', 'Produce', 'Dairy', 'Spices', 'About'].map((item) => (
            <Link
              key={item}
              to={item === 'About' ? '/about' : `/shop?category=${item.toLowerCase()}`}
              className={`text-cream text-sm font-medium uppercase tracking-[0.06em] px-3 py-2 border-b-2 transition-all duration-150
                ${location.pathname.includes(item.toLowerCase()) ? 'border-gold opacity-100' : 'border-transparent opacity-80 hover:border-gold hover:opacity-100'}
              `}
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div ref={searchRef} className="hidden md:flex relative max-w-md group transition-all">
            <form onSubmit={handleSearch} className="flex h-10">
              <div className="relative w-48 focus-within:w-64 transition-all duration-300">
                <input
                  value={query}
                  onFocus={() => setIsFocused(true)}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full h-full px-4 rounded-l-md border-none focus:ring-2 focus:ring-gold outline-none text-sm font-body bg-cream text-bark placeholder-sage"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sage hover:text-bark transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-4 bg-gold hover:bg-gold/90 text-white rounded-r-md cursor-pointer transition-all flex items-center justify-center"
              >
                <Search size={18} />
              </button>
            </form>

            {/* Autocomplete Dropdown */}
            <AnimatePresence>
              {isFocused && (autocompleteResults.products.length > 0 || autocompleteResults.posts.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-2 w-[400px] bg-ivory rounded-xl shadow-2xl border border-border overflow-hidden z-[110] max-h-[80vh] overflow-y-auto"
                >
                  {/* Products Section */}
                  {(autocompleteResults.products.length > 0 || isSearching) && (
                    <div className="p-2">
                      <div className="px-4 py-3">
                        <h4 className="text-[10px] font-bold text-gold uppercase tracking-[0.2em]">
                          Recommended Products {isSearching && <span className="lowercase text-sage font-normal ml-2">searching...</span>}
                        </h4>
                      </div>
                      <div className="space-y-1">
                        {autocompleteResults.products.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              navigate(`/product/${p.id}`);
                              setIsFocused(false);
                              setQuery('');
                            }}
                            className="w-full flex items-center gap-4 p-3 hover:bg-cream rounded-lg transition-all group text-left"
                          >
                            <div className="w-12 h-12 rounded bg-white overflow-hidden flex-shrink-0 border border-border">
                              <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-bold text-bark truncate group-hover:text-gold transition-colors">{p.name}</div>
                              <div className="text-[10px] text-sage font-medium uppercase tracking-wider">{p.category}</div>
                            </div>
                            <div className="text-sm font-bold text-bark font-display">₹{p.variants[0].salePrice || p.variants[0].price}</div>
                            <ChevronRight size={14} className="text-sage group-hover:text-gold transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Blog Section */}
                  {autocompleteResults.posts.length > 0 && (
                    <div className="bg-cream p-2 border-t border-border">
                      <div className="px-4 py-3">
                        <h4 className="text-[10px] font-bold text-gold uppercase tracking-[0.2em]">From Our Blog</h4>
                      </div>
                      <div className="space-y-1">
                        {autocompleteResults.posts.map((post) => (
                          <button
                            key={post.id}
                            onClick={() => {
                              navigate(`/blog/${post.slug}`);
                              setIsFocused(false);
                              setQuery('');
                            }}
                            className="w-full flex items-center gap-4 p-3 hover:bg-white rounded-lg transition-all group text-left border border-transparent hover:border-border"
                          >
                            <div className="w-10 h-10 rounded-md bg-gold/10 flex items-center justify-center flex-shrink-0 text-gold">
                              <FileText size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-bold text-bark truncate group-hover:text-gold">{post.title}</div>
                              <div className="text-[10px] text-sage line-clamp-1 italic">{post.excerpt}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* View All */}
                  <button onClick={handleSearch} className="w-full py-4 bg-forest text-cream text-xs font-bold uppercase tracking-[0.3em] hover:bg-forest/90 flex items-center justify-center gap-3 transition-colors">
                    View All Results <Search size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Icon */}
          <Link to="/account" className="hidden md:flex text-cream hover:text-gold transition-colors">
            <UserCircle size={24} strokeWidth={1.5} />
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative flex items-center justify-center text-cream hover:text-gold transition-colors">
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-gold text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden text-cream hover:text-gold transition-colors">
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 top-[64px] bg-forest z-50 flex flex-col"
          >
            <div className="flex flex-col py-6 px-8 space-y-6 flex-1 overflow-y-auto">
              {['Pantry', 'Produce', 'Dairy', 'Spices', 'About'].map(item => (
                <Link
                  key={item}
                  to={item === 'About' ? '/about' : `/shop?category=${item.toLowerCase()}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-cream font-display text-2xl uppercase tracking-widest hover:text-gold transition-colors"
                >
                  {item}
                </Link>
              ))}
              <div className="h-px bg-white/10 w-full my-4" />
              <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="text-gold font-body font-bold uppercase tracking-widest text-sm">
                Login / Account
              </Link>
            </div>
            {/* Mobile Search at bottom */}
            <div className="p-6 bg-forest/80 border-t border-white/10">
               <form onSubmit={handleSearch} className="flex h-12 w-full">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 h-full px-4 rounded-l-md border-none outline-none text-base font-body bg-cream text-bark placeholder-sage"
                  />
                  <button type="submit" className="px-6 bg-gold text-white rounded-r-md flex items-center justify-center">
                    <Search size={20} />
                  </button>
                </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <TrustBar />
    </div>
  );
};

export default Navbar;
