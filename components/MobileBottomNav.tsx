import React from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { HeartIcon } from './icons/HeartIcon';
import { UserIcon } from './icons/UserIcon';
import { TagIcon } from './icons/TagIcon';

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
  onOpenMenu,
  currentView,
}) => {
  const navItems = [
    {
      name: 'Home',
      icon: <HomeIcon className="h-6 w-6" />,
      action: () => (window.location.hash = '#/'),
      isActive: currentView === 'home',
    },
    {
      name: 'Categories',
      icon: <TagIcon className="h-6 w-6" />,
      action: onOpenMenu, // Using existing menu logic but renaming entry point
      isActive: false,
    },
    {
      name: 'Cart',
      icon: <ShoppingCartIcon className="h-6 w-6" />,
      action: onOpenCart,
      isActive: false,
      badge: cartItemCount,
    },
    {
      name: 'Wishlist',
      icon: <HeartIcon className="h-6 w-6" />,
      action: onOpenWishlist,
      isActive: false,
      badge: wishlistItemCount,
    },
    {
      name: 'Profile',
      icon: <UserIcon className="h-6 w-6" />,
      action: () => (window.location.hash = '#/profile'),
      isActive: currentView === 'profile' || currentView === 'login',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-[100] md:hidden pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={item.action}
            aria-label={item.name}
            className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
              item.isActive ? 'text-brand-primary' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <div className="relative">
              {item.icon}
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-primary text-brand-dark text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border border-white">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;
