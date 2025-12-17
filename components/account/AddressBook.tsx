import React, { useState } from 'react';
import { User } from '../../types';
import { useAddresses } from '../../hooks/useAddresses';
import { Button } from '../ui/Button';

// Props are no longer needed for data, but maybe for backward compat or just remove them.
// Let's remove them to enforce hook usage.
// interface AddressBookProps {
//     user: User;
//     onUpdateUser: (user: Partial<User>) => void;
// }

const AddressBook: React.FC = () => {
  const { addresses, addAddress, updateAddress, deleteAddress, isLoading, isUpdating } =
    useAddresses();
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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await deleteAddress(id);
    } catch (error) {
      console.error('Failed to delete address', error);
      alert('Failed to delete address');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingAddress) {
        await updateAddress({
          ...editingAddress,
          ...formData,
          type: formData.type as 'Home' | 'Work' | 'Other',
        });
      } else {
        await addAddress({
          ...formData,
          type: formData.type as 'Home' | 'Work' | 'Other',
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save address', error);
      alert('Failed to save address');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

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
                  name="street"
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
                    name="city"
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
                    name="state"
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
                    name="zipCode"
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
                    name="country"
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
                <Button type="submit" isLoading={isUpdating}>
                  Save Address
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressBook;
