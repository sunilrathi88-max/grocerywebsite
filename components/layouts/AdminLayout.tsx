import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: '📊' },
    { label: 'Orders', path: '/admin/orders', icon: '📦' },
    { label: 'Products', path: '/admin/products', icon: '🏷️' },
    { label: 'Customers', path: '/admin/customers', icon: '👥' },
    { label: 'Settings', path: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside
        className={`bg-brand-dark text-white transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {isSidebarOpen && <span className="font-bold text-xl tracking-wider">ADMIN</span>}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 p-3 rounded cursor-pointer transition-colors ${location.pathname === item.path ? 'bg-brand-primary text-brand-dark font-bold' : 'hover:bg-gray-700 text-gray-300'}`}
            >
              <span className="text-xl">{item.icon}</span>
              {isSidebarOpen && <span>{item.label}</span>}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 p-3 rounded cursor-pointer hover:bg-gray-700 text-gray-400"
          >
            <span>🏠</span>
            {isSidebarOpen && <span>Back to Store</span>}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {navItems.find((i) => i.path === location.pathname)?.label || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-bold text-sm text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
            <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-brand-dark font-bold">
              A
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};
