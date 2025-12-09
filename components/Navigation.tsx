import React from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface NavigationProps {
  categories: string[];
  onSelectCategory: (category: string) => void;
  isProductsOpen: boolean;
  setProductsOpen: (isOpen: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({
  categories,
  onSelectCategory,
  isProductsOpen,
  setProductsOpen,
}) => {
  const handleScrollTo = (id: string) => {
    // If not on home page, navigate to home first
    if (window.location.hash !== '#/') {
      window.location.hash = '#/';
      // Wait for navigation then scroll
      setTimeout(() => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="hidden md:flex items-center gap-8">
      <button
        onClick={() => {
          if (window.location.hash !== '#/') window.location.hash = '#/';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="text-base font-medium text-neutral-900 hover:text-brand-primary transition-colors py-2 relative group"
      >
        Home
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full" />
      </button>

      {/* Products Dropdown */}
      <div
        className="relative group"
        onMouseEnter={() => setProductsOpen(true)}
        onMouseLeave={() => setProductsOpen(false)}
      >
        <button
          className="text-base font-medium text-neutral-900 hover:text-brand-primary transition-colors py-2 flex items-center gap-1"
          onClick={() => handleScrollTo('products-section')}
        >
          Collections <ChevronDownIcon className="h-4 w-4" />
        </button>
        {isProductsOpen && (
          <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-lg py-2 z-10 animate-fade-in-fast border border-neutral-100">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setProductsOpen(false);
                  onSelectCategory(cat);
                  handleScrollTo('products-section');
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-brand-accent hover:text-brand-primary transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => handleScrollTo('why-us')}
        className="text-base font-medium text-neutral-900 hover:text-brand-primary transition-colors py-2 group relative"
      >
        Why Us
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full" />
      </button>

      <button
        onClick={() => handleScrollTo('our-story')}
        className="text-base font-medium text-neutral-900 hover:text-brand-primary transition-colors py-2 group relative"
      >
        Our Story
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full" />
      </button>

      <a
        href="#/offers"
        className="text-base font-medium text-neutral-900 hover:text-brand-primary transition-colors py-2 group relative"
      >
        Offers
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full" />
      </a>
    </nav>
  );
};

export default Navigation;
