import React, { useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { XIcon } from './icons/XIcon';

import { NAV_GROUPS } from '../data/navigation';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: string[];
  onSelectCategory: (category: string) => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  categories,
  onSelectCategory,
  isLoggedIn,
  onLoginClick,
  onLogoutClick,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  const menuVariants = {
    hidden: { x: '-100%' },
    visible: { x: '0' },
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1 + 0.3,
      },
    }),
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Offers', href: '/offers' },
    { name: 'Recipes', href: '/recipes' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <AnimatePresence>
      {isOpen && [
        <m.div
          key="backdrop"
          // FIX: Wrapped framer-motion props in a spread object to resolve TypeScript error.
          {...({
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.3 },
            className: 'fixed inset-0 bg-black bg-opacity-50 z-[80]',
            onClick: onClose,
            'aria-hidden': 'true',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any)}
        />,
        <m.div
          key="menu"
          // FIX: Wrapped framer-motion props in a spread object to resolve TypeScript error.

          {...({
            initial: 'hidden',
            animate: 'visible',
            exit: 'hidden',
            variants: menuVariants,
            transition: { type: 'spring', stiffness: 300, damping: 30 },
            className:
              'fixed top-0 left-0 h-full w-full max-w-sm bg-white shadow-xl z-[90] flex flex-col',
            role: 'dialog',
            'aria-modal': 'true',
            'aria-labelledby': 'mobile-menu-title',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any)}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 id="mobile-menu-title" className="text-2xl font-serif font-bold text-brand-dark">
              Menu
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Close menu"
            >
              <XIcon className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          <div className="p-6">
            <input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
              }}
              className="w-full bg-white border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all duration-300"
            />
          </div>
          <nav className="flex flex-col p-6 pt-0 space-y-4 overflow-y-auto max-h-[60vh]">
            {navLinks.map((link, i) => (
              <m.button
                key={link.name}
                custom={i}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
                className="text-2xl font-serif text-brand-dark hover:text-brand-primary transition-colors text-left"
                onClick={() => {
                  navigate(link.href);
                  onClose();
                }}
              >
                {link.name}
              </m.button>
            ))}

            {/* Curated Navigation Groups */}
            {NAV_GROUPS.map((group, groupIdx) => (
              <div key={group.title} className="border-t border-gray-100 pt-4 mt-2">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                  {group.title}
                </p>
                <div className="bg-gray-50 rounded-xl overflow-hidden">
                  {group.items.map((item, itemIdx) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors text-left border-b border-gray-100 last:border-0"
                        onClick={() => {
                          onSelectCategory(item.id);
                          onClose();
                        }}
                      >
                        <div className="text-brand-primary/70">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-base font-medium text-brand-dark block">
                            {item.label}
                          </span>
                          {item.sub && (
                            <span className="text-xs text-gray-500 block">{item.sub}</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="border-t border-gray-200 my-4 pt-4">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                Categories
              </p>
              {categories.map((category, i) => (
                <m.button
                  key={category}
                  // FIX: Wrapped framer-motion props in a spread object to resolve TypeScript error.
                  {...({
                    custom: i + navLinks.length,
                    variants: navItemVariants,
                    initial: 'hidden',
                    animate: 'visible',
                    className:
                      'block w-full text-left text-lg text-brand-dark hover:text-brand-primary transition-colors py-1',
                    onClick: () => {
                      onSelectCategory(category);
                      onClose();
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  } as any)}
                >
                  {category}
                </m.button>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              {isLoggedIn ? (
                <m.button
                  // FIX: Wrapped framer-motion props in a spread object to resolve TypeScript error.
                  {...({
                    custom: navLinks.length + categories.length + 1,
                    variants: navItemVariants,
                    initial: 'hidden',
                    animate: 'visible',
                    className:
                      'w-full bg-brand-dark text-white font-bold py-3 rounded-full shadow-lg hover:bg-opacity-90 transition-all',
                    onClick: onLogoutClick,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  } as any)}
                >
                  Sign Out
                </m.button>
              ) : (
                <m.button
                  // FIX: Wrapped framer-motion props in a spread object to resolve TypeScript error.
                  {...({
                    custom: navLinks.length + categories.length + 1,
                    variants: navItemVariants,
                    initial: 'hidden',
                    animate: 'visible',
                    className:
                      'w-full bg-brand-primary text-brand-dark font-bold py-3 rounded-full shadow-lg hover:bg-opacity-90 transition-all',
                    onClick: onLoginClick,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  } as any)}
                >
                  Login / Sign Up
                </m.button>
              )}
            </div>
          </nav>
        </m.div>,
      ]}
    </AnimatePresence>
  );
};

export default MobileMenu;
