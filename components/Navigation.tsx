import React, { useState } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { Link } from 'react-router-dom';
import MegaMenu from './MegaMenu';

interface NavigationProps {
  onSelectCategory: (category: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onSelectCategory }) => {
  const [isMegaMenuOpen, setMegaMenuOpen] = useState(false);

  const handleScrollTo = (id: string) => {
    if (window.location.hash !== '#/') {
      window.location.assign('#/');
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
          if (window.location.hash !== '#/') window.location.assign('#/');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="text-base font-medium text-neutral-900 hover:text-brand-primary transition-colors py-2 relative group"
      >
        Home
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full" />
      </button>

      {/* Shop - with MegaMenu */}
      <div
        className="relative"
        onMouseEnter={() => setMegaMenuOpen(true)}
        onMouseLeave={() => setMegaMenuOpen(false)}
      >
        <button
          className={`text-base font-medium transition-colors py-2 flex items-center gap-1 ${
            isMegaMenuOpen ? 'text-brand-primary' : 'text-neutral-900 hover:text-brand-primary'
          }`}
          onClick={() => handleScrollTo('products-section')}
        >
          Shop
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`}
          />
        </button>
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
      />
    </nav>
  );
};

export default Navigation;
