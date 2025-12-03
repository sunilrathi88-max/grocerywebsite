import React, { useState } from 'react';
import { User, Order } from '../types';
import { UserIcon } from './icons/UserIcon';
import { LocationMarkerIcon } from './icons/LocationMarkerIcon';
import { ClipboardListIcon } from './icons/ClipboardListIcon';
import { userAPI } from '../utils/apiService';
import { APIErrorDisplay } from './APIErrorDisplay';
import OrderDetailModal from './OrderDetailModal';

interface UserProfileProps {
  user: User;
  orders: Order[];
  onUpdateUser: (user: Partial<User>) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, orders, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders'>('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileInfo user={user} onUpdateUser={onUpdateUser} />;
      case 'addresses':
        return (
          <AddressManager addresses={user.addresses} onUpdateUser={onUpdateUser} user={user} />
        );
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
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${activeTab === 'profile' ? 'bg-brand-primary text-brand-dark' : 'hover:bg-brand-secondary/50'}`}
            >
              <UserIcon className="h-6 w-6" /> <span className="font-bold">Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${activeTab === 'addresses' ? 'bg-brand-primary text-brand-dark' : 'hover:bg-brand-secondary/50'}`}
            >
              <LocationMarkerIcon className="h-6 w-6" />{' '}
              <span className="font-bold">Addresses</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${activeTab === 'orders' ? 'bg-brand-primary text-brand-dark' : 'hover:bg-brand-secondary/50'}`}
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

const ProfileInfo: React.FC<{ user: User; onUpdateUser: (u: Partial<User>) => void }> = ({
  user,
  onUpdateUser,
}) => {
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
      const { data } = await userAPI.updateProfile({ name: formData.name, email: formData.email });
      onUpdateUser(data);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (_error) {
      console.warn('Profile update failed:', _error);
      setUpdateError(_error instanceof Error ? _error.message : 'Failed to update profile');
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

const AddressManager: React.FC<{
  addresses: User['addresses'];
  onUpdateUser: (u: Partial<User>) => void;
  user: User;
}> = ({ addresses, onUpdateUser, user: _user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<User['addresses'][0] | null>(null);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    type: 'Home',
    isDefault: false,
  });

  const handleAddNew = () => {
    setEditingAddress(null);
    setFormData({
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'India',
      type: 'Home',
      isDefault: false,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (addr: User['addresses'][0]) => {
    setEditingAddress(addr);
    setFormData({
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      country: addr.country,
      type: addr.type,
      isDefault: addr.isDefault,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    const newAddresses = addresses.filter((a) => a.id !== id);
    try {
      const { data } = await userAPI.updateProfile({ addresses: newAddresses });
      onUpdateUser(data);
    } catch (error) {
      console.error('Failed to delete address', error);
      alert('Failed to delete address');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    let newAddresses = [...addresses];

    if (formData.isDefault) {
      newAddresses = newAddresses.map((a) => ({ ...a, isDefault: false }));
    }

    if (editingAddress) {
      newAddresses = newAddresses.map((a) =>
        a.id === editingAddress.id
          ? { ...a, ...formData, type: formData.type as 'Home' | 'Work' | 'Other', id: a.id }
          : a
      );
    } else {
      newAddresses.push({
        ...formData,
        type: formData.type as 'Home' | 'Work' | 'Other',
        id: Date.now(),
      });
    }

    try {
      const { data } = await userAPI.updateProfile({ addresses: newAddresses });
      onUpdateUser(data);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save address', error);
      alert('Failed to save address');
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-serif font-bold mb-6">Saved Addresses</h3>
      <div className="space-y-6">
        {addresses.length === 0 && <p className="text-gray-500">No addresses saved yet.</p>}
        {addresses.map((addr) => (
          <div key={addr.id} className="p-4 border rounded-lg relative bg-gray-50">
            {addr.isDefault && (
              <span className="absolute top-2 right-2 bg-brand-primary text-brand-dark text-xs font-bold px-2 py-1 rounded-full">
                Default
              </span>
            )}
            <p className="font-bold text-lg mb-1">{addr.type} Address</p>
            <p className="text-gray-700">
              {addr.street}, {addr.city}
            </p>
            <p className="text-gray-700">
              {addr.state}, {addr.zip}, {addr.country}
            </p>
            <div className="mt-3 space-x-4">
              <button
                onClick={() => handleEdit(addr)}
                className="text-sm text-brand-primary font-bold hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(addr.id)}
                className="text-sm text-red-500 font-bold hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleAddNew}
        className="mt-6 bg-brand-dark text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-opacity-90 transition-colors"
      >
        Add New Address
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-fade-in">
            <h3 className="text-xl font-bold mb-4">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Address Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Street Address</label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary p-2 border"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary p-2 border"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">PIN Code</label>
                  <input
                    type="text"
                    required
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary p-2 border"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="h-4 w-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
                />
                <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
                  Set as default address
                </label>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-dark rounded-md hover:bg-opacity-90"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const OrderHistory: React.FC<{ orders: Order[] }> = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
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
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-brand-primary hover:text-brand-dark font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
};

export default UserProfile;
