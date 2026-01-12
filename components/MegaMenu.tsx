import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHatIcon } from './icons/ChefHatIcon';
import { ShoppingBagIcon } from './icons/ShoppingBagIcon';
import { GiftIcon } from './icons/GiftIcon';
import { LeafIcon } from './icons/LeafIcon';
import { SunIcon } from './icons/SunIcon';
import { GlobeIcon } from './icons/GlobeIcon';
import { HeartIcon } from './icons/HeartIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { BeakerIcon } from './icons/BeakerIcon';
import { StarIcon } from './icons/StarIcon';
import { TagIcon } from './icons/TagIcon';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory?: (category: string) => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose, onSelectCategory }) => {
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

  const handleCategoryClick = (category: string) => {
    onSelectCategory?.(category);
    onClose();
  };

  const navGroups = [
    {
      title: 'By Customer Intent',
      items: [
        {
          label: 'Essential Kitchen Masalas',
          sub: 'Start here! 5 must-haves',
          icon: ChefHatIcon,
          id: 'Essential Kitchen',
        },
        {
          label: 'Recipe-Ready Bundles',
          sub: 'Complete kits for dishes',
          icon: ShoppingBagIcon,
          id: 'Recipe Bundles',
        },
        {
          label: 'Premium & Gifts',
          sub: 'Specialty imports & combos',
          icon: GiftIcon,
          id: 'Premium & Gifts',
        },
      ],
    },
    {
      title: 'By Cooking Needs',
      items: [
        { label: 'Making Curry Today', icon: LeafIcon, id: 'Making Curry' },
        { label: 'Making Chai', icon: SunIcon, id: 'Making Chai' },
        { label: 'Making Rice Dishes', icon: GlobeIcon, id: 'Making Rice' },
        { label: 'Health & Wellness', icon: HeartIcon, id: 'Health & Wellness' },
      ],
    },
    {
      title: 'By Type',
      items: [
        { label: 'Pure Single Spices', icon: SparklesIcon, id: 'Pure Spices' },
        { label: 'Masala Blends', icon: BeakerIcon, id: 'Masala Blends' },
        { label: 'Whole (Unground)', icon: LeafIcon, id: 'Whole Spices' },
        { label: 'Organic Certified', icon: StarIcon, id: 'Combo Packs' }, // "Combo Packs" mapped to Organic Certified in UI previously? Keeping ID consistent check.
      ],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/5 z-40 md:top-[120px]" // Below header
            onClick={onClose}
          />

          {/* Menu Content */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-t border-white/20 shadow-xl z-50 origin-top"
            role="menu"
            aria-label="Shop menu"
            onMouseLeave={onClose} // Optional: Close on mouse leave for desktop convenience
          >
            <div className="container mx-auto px-6 py-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                {/* Dynamic Columns */}
                {navGroups.map((group, idx) => (
                  <div key={idx}>
                    <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-5 border-b border-neutral-100 pb-2">
                      {group.title}
                    </h3>
                    <ul className="space-y-4">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <li key={item.label}>
                            <button
                              onClick={() => handleCategoryClick(item.id)}
                              className="flex items-start gap-3 group w-full text-left p-2 -ml-2 rounded-lg hover:bg-neutral-50 transition-colors"
                            >
                              <div className="p-2 bg-neutral-100 rounded-md group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors text-neutral-500">
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <span className="font-medium block text-neutral-800 group-hover:text-brand-primary transition-colors">
                                  {item.label}
                                </span>
                                {item.sub && (
                                  <span className="text-xs text-neutral-500 mt-0.5 block">
                                    {item.sub}
                                  </span>
                                )}
                              </div>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}

                {/* Featured Column */}
                <div className="bg-gradient-to-br from-brand-primary/5 to-amber-100/30 rounded-2xl p-6 border border-brand-primary/10">
                  <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-5 flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4 text-brand-primary" />
                    Featured Collection
                  </h3>
                  <div className="space-y-4">
                    <div
                      className="group cursor-pointer"
                      onClick={() => handleCategoryClick('Spices')}
                    >
                      <div className="flex gap-4 items-start">
                        <div className="w-16 h-16 rounded-lg bg-white p-1 shadow-sm overflow-hidden border border-neutral-100">
                          <img
                            src="/images/products/garam-masala-front.jpg"
                            alt="Garam Masala"
                            className="w-full h-full object-contain hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900 text-sm group-hover:text-brand-primary transition-colors">
                            Bestseller: Garam Masala
                          </p>
                          <p className="text-xs text-neutral-500 mt-1">⭐ 4.9 (324 reviews)</p>
                          <p className="text-sm font-bold text-brand-dark mt-1">₹199</p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-px bg-brand-primary/10" />

                    <div
                      className="group cursor-pointer"
                      onClick={() => handleCategoryClick('Spices')}
                    >
                      <div className="flex gap-4 items-start">
                        <div className="w-16 h-16 rounded-lg bg-white p-1 shadow-sm overflow-hidden border border-neutral-100">
                          <img
                            src="/images/products/chai-masala-front.jpg"
                            alt="Chai Masala"
                            className="w-full h-full object-contain hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900 text-sm group-hover:text-brand-primary transition-colors">
                            Popular: Chai Masala
                          </p>
                          <p className="text-xs text-neutral-500 mt-1">⭐ 4.8 (256 reviews)</p>
                          <p className="text-sm font-bold text-brand-dark mt-1">₹149</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/shop"
                    onClick={onClose}
                    className="mt-6 block w-full text-center bg-brand-primary text-white font-bold py-2.5 px-4 rounded-xl hover:bg-brand-dark transition-all shadow-md shadow-brand-primary/20 text-sm"
                  >
                    View All Products →
                  </Link>
                </div>
              </div>

              {/* Bottom Quick Links */}
              <div className="flex justify-center gap-8 mt-10 pt-6 border-t border-neutral-100">
                <Link
                  to="/new-arrivals"
                  onClick={onClose}
                  className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-brand-primary transition-colors group"
                >
                  <TagIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  New Arrivals
                </Link>
                <Link
                  to="/offers"
                  onClick={onClose}
                  className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-brand-primary transition-colors group"
                >
                  <SparklesIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Special Offers
                </Link>
                <Link
                  to="/bestsellers"
                  onClick={onClose}
                  className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-brand-primary transition-colors group"
                >
                  <StarIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Bestsellers
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MegaMenu;
