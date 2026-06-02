import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ShoppingCart, Heart, User, Tag } from 'lucide-react';

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
  currentView,
}) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY + 5) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY - 5) {
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
      label: 'Home',
      icon: Home,
      action: () => navigate('/'),
      isActive: currentView === 'home',
    },
    {
      id: 'shop',
      label: 'Shop',
      icon: Tag,
      action: () => navigate('/shop'),
      isActive: currentView === 'shop',
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: ShoppingCart,
      action: onOpenCart,
      isActive: false,
      badge: cartItemCount,
    },
    {
      id: 'wishlist',
      label: 'Saved',
      icon: Heart,
      action: onOpenWishlist,
      isActive: false,
      badge: wishlistItemCount,
    },
    {
      id: 'account',
      label: 'Account',
      icon: User,
      action: () => navigate('/account'),
      isActive: currentView === 'profile' || currentView === 'login' || currentView === 'account',
    },
  ];

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-[100] md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ type: 'spring', stiffness: 350, damping: 35 }}
    >
      {/* The floating pill container */}
      <div className="px-3 pb-3">
        <div
          className="relative flex items-center justify-around rounded-[28px] overflow-hidden"
          style={{
            background: 'rgba(15, 7, 4, 0.92)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)',
            height: '64px',
          }}
        >
          {/* Active background pill (slides) */}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.isActive;

            return (
              <button
                key={item.id}
                onClick={item.action}
                aria-label={item.label}
                className="relative flex-1 flex flex-col items-center justify-center h-full gap-1 transition-all"
              >
                {/* Active bg pill */}
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-x-1 inset-y-2 rounded-2xl"
                    style={{ background: 'rgba(179,139,89,0.18)' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}

                <div className="relative">
                  {/* Badge */}
                  <AnimatePresence>
                    {item.badge && item.badge > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2.5 min-w-[17px] h-[17px] flex items-center justify-center text-[9px] font-black rounded-full z-10"
                        style={{
                          background: 'linear-gradient(135deg, #B38B59, #8C6D45)',
                          color: 'white',
                          boxShadow: '0 1px 6px rgba(179,139,89,0.5)',
                          padding: '0 3px',
                        }}
                      >
                        {item.badge > 9 ? '9+' : item.badge}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <Icon
                      size={20}
                      strokeWidth={isActive ? 2.5 : 1.8}
                      className="transition-colors"
                      style={{ color: isActive ? '#B38B59' : 'rgba(255,255,255,0.4)' }}
                    />
                  </motion.div>
                </div>

                <span
                  className="text-[9px] font-bold uppercase tracking-widest transition-colors relative"
                  style={{ color: isActive ? '#B38B59' : 'rgba(255,255,255,0.3)' }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default MobileBottomNav;
