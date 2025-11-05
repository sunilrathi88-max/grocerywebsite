import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

interface SignOutButtonProps {
  redirectTo?: string;
  className?: string;
}

const SignOutButton: React.FC<SignOutButtonProps> = ({ redirectTo = '#/', className }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      // Clear any local storage
      localStorage.removeItem('auth_access_token');
      localStorage.removeItem('auth_refresh_token');
      localStorage.removeItem('auth_token_expiry');
      window.location.hash = redirectTo;
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleSignOut} disabled={isLoading} className={className}>
      {isLoading ? 'Signing out...' : 'Sign Out'}
    </button>
  );
};

export default SignOutButton;
