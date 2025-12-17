import React, { useState } from 'react';
import { User } from '../../types';
import { userAPI } from '../../utils/apiService';
import { APIErrorDisplay } from '../APIErrorDisplay';

interface AccountOverviewProps {
  user: User;
  onUpdateUser: (user: Partial<User>) => void;
}

const AccountOverview: React.FC<AccountOverviewProps> = ({ user, onUpdateUser }) => {
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
            className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
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
            className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
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
    </div>
  );
};

export default AccountOverview;
