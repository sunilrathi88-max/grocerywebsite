import React, { useState } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MegaMenu from './MegaMenu';

interface NavigationProps {
  onSelectCategory: (category: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onSelectCategory }) => {
  const [isMegaMenuOpen, setMegaMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 200); // 200ms delay to bridge the gap
  };

  const handleScrollTo = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (category: string) => {
    onSelectCategory(category);
    handleScrollTo('products-section');
    setMegaMenuOpen(false);
  };

  return (
    <nav className="hidden md:flex items-center gap-8 relative">
      {/* Home */}
      <button
        onClick={() => {
          navigate('/');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="text-base font-medium text-neutral-900 hover:text-brand-primary transition-colors py-2 relative group"
      >
        Home
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full" />
      </button>

      {/* Blog */}
      <Link
        to="/blog"
        className="text-base font-medium text-neutral-900 hover:text-brand-primary transition-colors py-2 relative group"
      >
        Blog
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full" />
      </Link>

      {/* Shop - with MegaMenu */}
      <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Link
          to="/shop"
          className={`text-base font-medium transition-colors py-2 flex items-center gap-1 ${
            isMegaMenuOpen ? 'text-brand-primary' : 'text-neutral-900 hover:text-brand-primary'
          }`}
        >
          Shop
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`}
          />
        </Link>
      </div>

      {/* Popular Masalas - Quick Access */}
      <button
        onClick={() => handleScrollTo('most-loved-section')}
        className="text-base font-medium text-neutral-900 hover:text-brand-primary transition-colors py-2 relative group"
      >
        Popular Masalas
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full" />
      </button>

      {/* Offers */}
      <Link
        to="/offers"
        className="text-base font-medium text-neutral-600 hover:text-brand-primary transition-colors py-2 relative group"
      >
        Offers
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full" />
      </Link>

      {/* Subscription */}
      <Link
        to="/subscription"
        className="text-base font-bold text-brand-dark hover:text-brand-primary transition-colors py-2 flex items-center gap-1"
      >
        <span className="text-lg">📦</span>
        Subscription
      </Link>

      {/* MegaMenu - Positioned from parent */}
      <MegaMenu
        isOpen={isMegaMenuOpen}
        onClose={() => setMegaMenuOpen(false)}
        onSelectCategory={handleCategorySelect}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    </nav>
  );
};

export default Navigation;
