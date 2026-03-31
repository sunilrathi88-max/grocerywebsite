import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, X, FileText, ChevronRight, UserCircle, Menu } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import TrustBar from './TrustBar';
import { Product, BlogPost } from '../../../types';
import { fuzzySearchProducts, fuzzySearchBlogs } from '../../../utils/searchUtils';
import { AnimatePresence, motion } from 'framer-motion';

interface NavbarProps {
  products: Product[];
  posts: BlogPost[];
}

const Navbar: React.FC<NavbarProps> = ({ products, posts }) => {
  const { cartItemCount: totalItems } = useCart();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const autocompleteResults = useMemo(() => {
    if (!query.trim()) return { products: [], posts: [] };
    const matchingProducts = fuzzySearchProducts(query, products).slice(0, 4);
    const matchingPosts = fuzzySearchBlogs(query, posts).slice(0, 3);
    return { products: matchingProducts, posts: matchingPosts };
  }, [query, products, posts]);

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
      <nav className="bg-[#42210B] px-4 md:px-8 flex items-center gap-4 h-16 md:h-16 shadow-md">
        {/* Logo */}
        <Link
          to="/"
          className="font-display text-xl md:text-2xl font-bold text-white whitespace-nowrap tracking-wide hover:text-[#B38B59] transition-colors"
        >
          Rathi Naturals
        </Link>

        {/* Search */}
        <div ref={searchRef} className="flex-1 relative flex max-w-2xl group transition-all">
          <form onSubmit={handleSearch} className="flex-1 flex">
            <div className="relative flex-1">
              <input
                value={query}
                onFocus={() => setIsFocused(true)}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search haldi, mirch, masala, saffron..."
                className="w-full h-10 md:h-11 px-4 rounded-l-lg border-none focus:ring-2 focus:ring-[#B38B59] outline-none text-sm font-body bg-[#FAF6F2] text-stone-900 placeholder-stone-400 shadow-inner"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="h-10 md:h-11 px-6 bg-[#B38B59] hover:bg-[#8C6D45] text-white border-none rounded-r-lg cursor-pointer transition-all flex items-center justify-center shadow-md active:scale-95"
            >
              <Search size={20} strokeWidth={2.5} />
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          <AnimatePresence>
            {isFocused &&
              (autocompleteResults.products.length > 0 || autocompleteResults.posts.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-stone-100 overflow-hidden z-[110] max-h-[80vh] overflow-y-auto custom-scrollbar"
                >
                  {/* Products Section */}
                  {autocompleteResults.products.length > 0 && (
                    <div className="p-2">
                      <div className="px-4 py-3 flex items-center justify-between">
                        <h4 className="text-[10px] font-black text-[#B38B59] uppercase tracking-[0.2em]">
                          Recommended Spices
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
                            className="w-full flex items-center gap-4 p-3 hover:bg-[#FAF6F2] rounded-xl transition-all group text-left"
                          >
                            <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0 border border-stone-200/50">
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-bold text-[#42210B] truncate group-hover:text-[#B38B59] transition-colors">
                                {p.name}
                              </div>
                              <div className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">
                                {p.category}
                              </div>
                            </div>
                            <div className="text-sm font-black text-[#42210B]">
                              ₹{p.variants[0].salePrice || p.variants[0].price}
                            </div>
                            <ChevronRight
                              size={14}
                              className="text-stone-300 group-hover:text-[#B38B59] group-hover:translate-x-1 transition-all"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Blog Section */}
                  {autocompleteResults.posts.length > 0 && (
                    <div className="bg-[#FAF6F2]/50 p-2 border-t border-stone-100">
                      <div className="px-4 py-3">
                        <h4 className="text-[10px] font-black text-[#B38B59] uppercase tracking-[0.2em]">
                          From Our Kitchen Blog
                        </h4>
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
                            className="w-full flex items-center gap-4 p-3 hover:bg-white rounded-xl transition-all group text-left shadow-sm hover:shadow-md border border-transparent hover:border-stone-100"
                          >
                            <div className="w-10 h-10 rounded-lg bg-[#B38B59]/10 flex items-center justify-center flex-shrink-0 text-[#B38B59]">
                              <FileText size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-bold text-[#42210B] truncate group-hover:text-[#B38B59] transition-colors">
                                {post.title}
                              </div>
                              <div className="text-[10px] text-stone-400 line-clamp-1 italic">
                                {post.excerpt}
                              </div>
                            </div>
                            <ChevronRight
                              size={14}
                              className="text-stone-300 group-hover:text-[#B38B59] group-hover:translate-x-1 transition-all"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* View All */}
                  <button
                    onClick={handleSearch}
                    className="w-full py-4 bg-[#42210B] text-white text-xs font-black uppercase tracking-[0.3em] hover:bg-[#B38B59] transition-all flex items-center justify-center gap-3"
                  >
                    View All Results
                    <Search size={14} />
                  </button>
                </motion.div>
              )}
          </AnimatePresence>
        </div>

        {/* Desktop Nav links */}
        <div className="hidden lg:flex items-center gap-8 ml-4">
          <Link
            to="/shop"
            className="text-stone-200 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-1"
          >
            Shop
          </Link>
          <Link
            to="/offers"
            className="text-stone-200 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors"
          >
            Offers
          </Link>
          <Link
            to="/about"
            className="text-stone-200 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors"
          >
            Our Story
          </Link>
          <Link
            to="/blog"
            className="text-stone-200 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors"
          >
            Blog
          </Link>
        </div>

        {/* User Icon */}
        <Link
          to="/account"
          className="text-white hover:text-[#B38B59] transition-colors active:scale-95"
          title="Account / Login"
        >
          <UserCircle size={26} strokeWidth={1.5} />
        </Link>

        {/* Cart */}
        <Link
          to="/cart"
          className="flex items-center gap-2.5 text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all border border-white/5 shadow-sm active:scale-95 ml-2"
        >
          <div className="relative">
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#F59E0B] text-[#111] rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black shadow-lg animate-in zoom-in-50 duration-300">
                {totalItems}
              </span>
            )}
          </div>
          <span className="hidden sm:inline font-bold text-sm tracking-wide">CART</span>
        </Link>
        
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-white hover:text-[#B38B59] transition-colors active:scale-95 ml-2"
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Nav Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#42210B] border-t border-white/10 overflow-hidden"
          >
            <div className="flex flex-col py-4 px-6 space-y-4">
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-white font-bold uppercase tracking-widest hover:text-[#B38B59]">Shop</Link>
              <Link to="/offers" onClick={() => setIsMobileMenuOpen(false)} className="text-white font-bold uppercase tracking-widest hover:text-[#B38B59]">Offers</Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-white font-bold uppercase tracking-widest hover:text-[#B38B59]">Our Story</Link>
              <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-white font-bold uppercase tracking-widest hover:text-[#B38B59]">Blog</Link>
              <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="text-[#B38B59] font-bold uppercase tracking-widest">Login / Account</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Redesigned TrustBar below Navbar */}
      <TrustBar />
    </div>
  );
};

export default Navbar;
