import React, { useState } from 'react';
import { AuthService } from '../utils/authService';

interface SignOutButtonProps {
  redirectTo?: string;
  className?: string;
}

const SignOutButton: React.FC<SignOutButtonProps> = ({ redirectTo = '#/', className }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      window.location.hash = redirectTo;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isLoading}
      className={className || 'px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700'}
    >
      {isLoading ? 'Signing out...' : 'Sign out'}
    </button>
  );
};

export default SignOutButton;
