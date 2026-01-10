import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory?: (category: string) => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose, onSelectCategory }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCategoryClick = (category: string) => {
    onSelectCategory?.(category);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-neutral-100 animate-slideDown z-50"
      role="menu"
      aria-label="Shop menu"
    >
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: By Customer Intent */}
          <div>
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">
              By Customer Intent
            </h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => handleCategoryClick('Essential Kitchen')}
                  className="flex items-center gap-3 text-neutral-700 hover:text-amber-700 transition-colors group w-full text-left"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">🏠</span>
                  <div>
                    <span className="font-medium block">Essential Kitchen Masalas</span>
                    <span className="text-xs text-neutral-500">Start here! 5 must-haves</span>
                  </div>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Recipe Bundles')}
                  className="flex items-center gap-3 text-neutral-700 hover:text-amber-700 transition-colors group w-full text-left"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">🍛</span>
                  <div>
                    <span className="font-medium block">Recipe-Ready Bundles</span>
                    <span className="text-xs text-neutral-500">Complete kits for dishes</span>
                  </div>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Premium & Gifts')}
                  className="flex items-center gap-3 text-neutral-700 hover:text-amber-700 transition-colors group w-full text-left"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">🎁</span>
                  <div>
                    <span className="font-medium block">Premium & Gifts</span>
                    <span className="text-xs text-neutral-500">Specialty imports & combos</span>
                  </div>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: By Cooking Needs */}
          <div>
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">
              By Cooking Needs
            </h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => handleCategoryClick('Making Curry')}
                  className="flex items-center gap-2 text-neutral-700 hover:text-amber-700 transition-colors w-full text-left"
                >
                  <span>🍛</span>
                  <span className="font-medium">Making Curry Today</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Making Chai')}
                  className="flex items-center gap-2 text-neutral-700 hover:text-amber-700 transition-colors w-full text-left"
                >
                  <span>☕</span>
                  <span className="font-medium">Making Chai</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Making Rice')}
                  className="flex items-center gap-2 text-neutral-700 hover:text-amber-700 transition-colors w-full text-left"
                >
                  <span>🍚</span>
                  <span className="font-medium">Making Rice Dishes</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Health & Wellness')}
                  className="flex items-center gap-2 text-neutral-700 hover:text-amber-700 transition-colors w-full text-left"
                >
                  <span>🏥</span>
                  <span className="font-medium">Health & Wellness</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: By Type */}
          <div>
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">
              By Type
            </h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => handleCategoryClick('Pure Spices')}
                  className="text-neutral-700 hover:text-amber-700 transition-colors font-medium w-full text-left"
                >
                  Pure Single Spices
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Masala Blends')}
                  className="text-neutral-700 hover:text-amber-700 transition-colors font-medium w-full text-left"
                >
                  Masala Blends
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Whole Spices')}
                  className="text-neutral-700 hover:text-amber-700 transition-colors font-medium w-full text-left"
                >
                  Whole (Unground)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Combo Packs')}
                  className="text-neutral-700 hover:text-amber-700 transition-colors font-medium w-full text-left"
                >
                  Organic Certified
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Featured */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">
              Featured Collection
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <img
                  src="/images/products/garam-masala-front.jpg"
                  alt="Garam Masala"
                  className="w-16 h-16 object-contain rounded-lg bg-white"
                />
                <div>
                  <p className="font-semibold text-neutral-800 text-sm">Bestseller: Garam Masala</p>
                  <p className="text-xs text-neutral-600">⭐ 4.9 (324 reviews)</p>
                  <p className="text-sm font-bold text-amber-700">₹199</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <img
                  src="/images/products/chai-masala-front.jpg"
                  alt="Chai Masala"
                  className="w-16 h-16 object-contain rounded-lg bg-white"
                />
                <div>
                  <p className="font-semibold text-neutral-800 text-sm">Popular: Chai Masala</p>
                  <p className="text-xs text-neutral-600">⭐ 4.8 (256 reviews)</p>
                  <p className="text-sm font-bold text-amber-700">₹149</p>
                </div>
              </div>
            </div>
            <Link
              to="/shop"
              onClick={onClose}
              className="mt-4 block text-center bg-amber-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-amber-700 transition-colors text-sm"
            >
              View All Products →
            </Link>
          </div>
        </div>

        {/* Bottom Quick Links */}
        <div className="flex justify-center gap-6 mt-8 pt-6 border-t border-neutral-100">
          <Link
            to="/new-arrivals"
            onClick={onClose}
            className="text-sm font-medium text-neutral-600 hover:text-amber-700 transition-colors"
          >
            🆕 New Arrivals
          </Link>
          <Link
            to="/offers"
            onClick={onClose}
            className="text-sm font-medium text-neutral-600 hover:text-amber-700 transition-colors"
          >
            🏷️ Special Offers
          </Link>
          <Link
            to="/bestsellers"
            onClick={onClose}
            className="text-sm font-medium text-neutral-600 hover:text-amber-700 transition-colors"
          >
            ⭐ Bestsellers
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MegaMenu;
