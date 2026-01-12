import React from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { UserIcon } from '../icons/UserIcon';
import { LocationMarkerIcon } from '../icons/LocationMarkerIcon';
import { ClipboardListIcon } from '../icons/ClipboardListIcon';
import { SparklesIcon } from '../icons/SparklesIcon';
import { HeartIcon } from '../icons/HeartIcon'; // Assuming you have this or will use Heroicons equivalent
import { User } from '../../types';

interface AccountLayoutProps {
  user: User | null;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { path: '.', label: 'Profile', icon: UserIcon, end: true },
    { path: 'orders', label: 'My Orders', icon: ClipboardListIcon },
    { path: 'addresses', label: 'Addresses', icon: LocationMarkerIcon },
    { path: 'wishlist', label: 'Wishlist', icon: HeartIcon },
    { path: 'loyalty', label: 'Loyalty Points', icon: SparklesIcon },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-brand-dark mb-12">
        My Account
      </h2>
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="md:w-1/4">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 p-3 rounded-r-lg border-l-4 transition-all duration-200 ${
                    isActive
                      ? 'border-brand-primary bg-brand-primary/10 text-brand-dark'
                      : 'border-transparent hover:bg-gray-50 text-gray-600 hover:text-brand-primary'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="font-semibold">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>
        {/* Main Content */}
        <main className="md:w-3/4">
          <div className="bg-white p-8 rounded-lg shadow-md min-h-[500px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountLayout;
