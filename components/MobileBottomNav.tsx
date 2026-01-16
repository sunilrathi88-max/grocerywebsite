import React from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { HeartIcon } from './icons/HeartIcon';
import { UserIcon } from './icons/UserIcon';
import { TagIcon } from './icons/TagIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface MobileBottomNavProps {
  cartItemCount: number;
  wishlistItemCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenMenu: () => void;
  currentView: string;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartItemCount,
  wishlistItemCount,
  onOpenCart,
  onOpenWishlist,
  onOpenMenu: _onOpenMenu,
  currentView,
}) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 10;

      if (currentScrollY < scrollThreshold) {
        // Always show when at top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY + 5) {
        // Scrolling down - hide
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY - 5) {
        // Scrolling up - show
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    {
      id: 'home',
      name: 'Home',
      icon: HomeIcon,
      action: () => navigate('/'),
      isActive: currentView === 'home',
    },
    {
      id: 'shop',
      name: 'Shop',
      icon: TagIcon,
      action: () => navigate('/shop'),
      isActive: currentView === 'shop',
    },
    {
      id: 'cart',
      name: 'Cart',
      icon: ShoppingCartIcon,
      action: onOpenCart,
      isActive: false,
      badge: cartItemCount,
    },
    {
      id: 'wishlist',
      name: 'Wishlist',
      icon: HeartIcon,
      action: onOpenWishlist,
      isActive: false,
      badge: wishlistItemCount,
    },
    {
      id: 'profile',
      name: 'Profile',
      icon: UserIcon,
      action: () => navigate('/profile'),
      isActive: currentView === 'profile' || currentView === 'login' || currentView === 'account',
    },
  ];

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-[100] md:hidden pb-safe"
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-lg border-t border-white/20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]" />

      <div className="relative flex justify-around items-center h-[60px] px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isActive;

          return (
            <button
              key={item.id}
              onClick={item.action}
              aria-label={item.name}
              className="relative flex flex-col items-center justify-center w-full h-full min-h-[44px]"
            >
              <div className="relative p-1">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    color: isActive ? '#D4A017' : '#6B7280', // brand-primary vs neutral-500
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Icon className="h-6 w-6" />
                </motion.div>

                {/* Badge Animation */}
                <AnimatePresence>
                  {item.badge && item.badge > 0 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-1.5 -right-1.5 bg-accent-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-white shadow-sm z-10"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Active Indicator Dot */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </div>

              <span
                className={`text-[11px] font-medium mt-0.5 transition-colors ${
                  isActive ? 'text-brand-primary' : 'text-neutral-500'
                }`}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default MobileBottomNav;
