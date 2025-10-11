import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from './icons/XIcon';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, searchQuery, onSearchChange }) => {
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
    { name: 'Home', href: '#/' },
    { name: 'Products', href: '#/' },
    { name: 'Contact Us', href: '#/contact' },
    { name: 'Recipes', href: '#/recipes' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[80]"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-full max-w-sm bg-white shadow-xl z-[90] flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 id="mobile-menu-title" className="text-2xl font-serif font-bold text-brand-dark">Menu</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Close menu">
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
            <nav className="flex flex-col p-6 pt-0 space-y-4">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  custom={i}
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                  href={link.href}
                  className="text-2xl font-serif text-brand-dark hover:text-brand-primary transition-colors"
                  onClick={onClose}
                >
                  {link.name}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;