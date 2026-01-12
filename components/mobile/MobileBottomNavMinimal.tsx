import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeIcon } from '../icons/HomeIcon';
import { TagIcon } from '../icons/TagIcon';
import { GiftIcon } from '../icons/GiftIcon';
import { UserIcon } from '../icons/UserIcon';

interface MobileBottomNavProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

const MobileBottomNavMinimal: React.FC<MobileBottomNavProps> = ({
  currentPath = '/',
  onNavigate,
}) => {
  const navigate = useNavigate();

  const handleNav = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon, path: '/' },
    { id: 'shop', label: 'Shop', icon: TagIcon, path: '/shop' },
    { id: 'offers', label: 'Offers', icon: GiftIcon, path: '/offers' },
    { id: 'profile', label: 'Profile', icon: UserIcon, path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-stone-800 border-t border-gray-100 dark:border-stone-700 z-50 md:hidden">
      <div className="flex justify-around items-center h-16 px-2 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));

          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.path)}
              className="flex flex-col items-center justify-center w-full h-full"
            >
              <Icon
                className={`w-6 h-6 transition-colors ${
                  isActive
                    ? 'text-amber-600'
                    : 'text-stone-500 dark:text-stone-400 hover:text-amber-600'
                }`}
              />
              <span
                className={`text-[10px] mt-1 font-medium transition-colors ${
                  isActive ? 'text-amber-600' : 'text-stone-500 dark:text-stone-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <style>{`
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </nav>
  );
};

export default MobileBottomNavMinimal;
