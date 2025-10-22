import React, { useState } from 'react';
import { User, Order } from '../types';
import { UserIcon } from './icons/UserIcon';
import { LocationMarkerIcon } from './icons/LocationMarkerIcon';
import { ClipboardListIcon } from './icons/ClipboardListIcon';
import { userAPI } from '../utils/apiService';
import { APIErrorDisplay } from './APIErrorDisplay';

interface UserProfileProps {
  user: User;
  orders: Order[];
}

const UserProfile: React.FC<UserProfileProps> = ({ user, orders }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders'>('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileInfo user={user} />;
      case 'addresses':
        return <AddressManager addresses={user.addresses} />;
      case 'orders':
        return <OrderHistory orders={orders} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-brand-dark mb-12">
        My Account
      </h2>
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="md:w-1/4">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${activeTab === 'profile' ? 'bg-brand-primary text-white' : 'hover:bg-brand-secondary/50'}`}
            >
              <UserIcon className="h-6 w-6" /> <span className="font-bold">Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${activeTab === 'addresses' ? 'bg-brand-primary text-white' : 'hover:bg-brand-secondary/50'}`}
            >
              <LocationMarkerIcon className="h-6 w-6" />{' '}
              <span className="font-bold">Addresses</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${activeTab === 'orders' ? 'bg-brand-primary text-white' : 'hover:bg-brand-secondary/50'}`}
            >
              <ClipboardListIcon className="h-6 w-6" /> <span className="font-bold">My Orders</span>
            </button>
          </nav>
        </aside>
        {/* Main Content */}
        <main className="md:w-3/4">
          <div className="bg-white p-8 rounded-lg shadow-md">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

const ProfileInfo: React.FC<{ user: User }> = ({ user }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: user.name, email: user.email });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateError(null);
    setSuccessMessage(null);

    try {
      await userAPI.updateProfile({ name: formData.name, email: formData.email });
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.warn('Profile update failed:', error);
      setUpdateError(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-serif font-bold mb-6">Personal Information</h3>

      {updateError && (
        <div className="mb-4">
          <APIErrorDisplay
            error={{ message: updateError }}
            onRetry={() => setUpdateError(null)}
            onDismiss={() => setUpdateError(null)}
          />
        </div>
      )}

      {successMessage && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {successMessage}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 input-field"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 input-field"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isUpdating}
          className="mt-4 bg-brand-dark text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-opacity-90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isUpdating && (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
          )}
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
      <style>{`
        .input-field {
            display: block; width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; 
        }
        .input-field:focus {
            outline: none; --tw-ring-color: #FFB7C1; box-shadow: 0 0 0 2px var(--tw-ring-color); border-color: #FFB7C1;
        }
      `}</style>
    </div>
  );
};

const AddressManager: React.FC<{ addresses: User['addresses'] }> = ({ addresses }) => (
  <div>
    <h3 className="text-2xl font-serif font-bold mb-6">Saved Addresses</h3>
    <div className="space-y-6">
      {addresses.map((addr) => (
        <div key={addr.id} className="p-4 border rounded-lg relative">
          {addr.isDefault && (
            <span className="absolute top-2 right-2 bg-brand-primary text-white text-xs font-bold px-2 py-1 rounded-full">
              Default
            </span>
          )}
          <p className="font-bold">{addr.type} Address</p>
          <p>
            {addr.street}, {addr.city}
          </p>
          <p>
            {addr.state}, {addr.zip}, {addr.country}
          </p>
          <div className="mt-2 space-x-2">
            <button className="text-sm text-brand-primary font-bold">Edit</button>
            <button className="text-sm text-red-500 font-bold">Delete</button>
          </div>
        </div>
      ))}
    </div>
    <button className="mt-6 bg-brand-dark text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-opacity-90 transition-colors">
      Add New Address
    </button>
  </div>
);

const OrderHistory: React.FC<{ orders: Order[] }> = ({ orders }) => (
  <div>
    <h3 className="text-2xl font-serif font-bold mb-6">Order History</h3>
    {orders.length === 0 ? (
      <p>You haven&apos;t placed any orders yet.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Order ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'Delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default UserProfile;
