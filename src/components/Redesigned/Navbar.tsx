import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import TrustBar from './TrustBar';

const Navbar: React.FC = () => {
  const { cartItemCount: totalItems } = useCart();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

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
        <form 
          onSubmit={handleSearch} 
          className="flex-1 flex max-w-2xl group transition-all"
        >
          <div className="relative flex-1">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search haldi, mirch, masala, saffron..."
              className="w-full h-10 md:h-11 px-4 rounded-l-lg border-none focus:ring-2 focus:ring-[#B38B59] outline-none text-sm font-body bg-[#FAF6F2] text-stone-900 placeholder-stone-400 shadow-inner"
            />
          </div>
          <button 
            type="submit" 
            className="h-10 md:h-11 px-6 bg-[#B38B59] hover:bg-[#8C6D45] text-white border-none rounded-r-lg cursor-pointer transition-all flex items-center justify-center shadow-md active:scale-95"
          >
            <Search size={20} strokeWidth={2.5} />
          </button>
        </form>

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
      </nav>
      
      {/* Redesigned TrustBar below Navbar */}
      <TrustBar />
    </div>
  );
};

export default Navbar;
