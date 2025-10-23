import React, { useState, useEffect } from 'react';
import { AuthService } from '../utils/authService';
import { FacebookIcon } from './icons/FacebookIcon';

interface OAuthButtonsProps {
  onSuccess: (user: any, isNewUser: boolean) => void;
  onError: (error: string) => void;
  mode?: 'login' | 'signup';
}

const OAuthButtons: React.FC<OAuthButtonsProps> = ({ onSuccess, onError, mode = 'login' }) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  useEffect(() => {
    // Handle OAuth callback
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split('?')[1] || '');
    const code = params.get('code');
    const provider = params.get('provider') as 'google' | 'facebook' | null;
    const state = params.get('state');

    if (code && provider && state) {
      // Verify state to prevent CSRF attacks
      const savedState = sessionStorage.getItem('oauth_state');
      if (state === savedState) {
        handleOAuthCallback(provider, code);
      } else {
        onError('Invalid OAuth state. Please try again.');
      }
      sessionStorage.removeItem('oauth_state');
    }
  }, []);

  const generateState = (): string => {
    return (
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
  };

  const handleGoogleLogin = () => {
    setIsLoading('google');

    // Generate and save state for CSRF protection
    const state = generateState();
    sessionStorage.setItem('oauth_state', state);

    // Get OAuth config from environment variables
    const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const REDIRECT_URI =
      import.meta.env.VITE_GOOGLE_REDIRECT_URI ||
      `${window.location.origin}${window.location.pathname}#/oauth-callback`;
    const SCOPE = 'email profile';

    // Check if OAuth is configured
    if (!CLIENT_ID || CLIENT_ID === 'your_google_client_id_here') {
      // Mock implementation for demo/testing
      console.warn('Google OAuth not configured. Using mock flow.');
      setTimeout(() => {
        mockOAuthFlow('google');
      }, 1000);
      return;
    }

    // Build OAuth URL
    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(SCOPE)}&` +
      `state=${state}&` +
      `access_type=offline&` +
      `prompt=consent`;

    // Redirect to OAuth provider
    window.location.href = authUrl;
  };

  const handleFacebookLogin = () => {
    setIsLoading('facebook');

    const state = generateState();
    sessionStorage.setItem('oauth_state', state);

    // Get OAuth config from environment variables
    const APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;
    const REDIRECT_URI =
      import.meta.env.VITE_FACEBOOK_REDIRECT_URI ||
      `${window.location.origin}${window.location.pathname}#/oauth-callback`;
    const SCOPE = 'email,public_profile';

    // Check if OAuth is configured
    if (!APP_ID || APP_ID === 'your_facebook_app_id_here') {
      // Mock implementation for demo/testing
      console.warn('Facebook OAuth not configured. Using mock flow.');
      setTimeout(() => {
        mockOAuthFlow('facebook');
      }, 1000);
      return;
    }

    const authUrl =
      `https://www.facebook.com/v12.0/dialog/oauth?` +
      `client_id=${APP_ID}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `scope=${encodeURIComponent(SCOPE)}&` +
      `state=${state}&` +
      `response_type=code`;

    // Redirect to OAuth provider
    window.location.href = authUrl;
  };

  const mockOAuthFlow = async (provider: 'google' | 'facebook') => {
    try {
      // Simulate OAuth success
      const mockCode = 'mock_oauth_code_' + Math.random().toString(36);
      const response = await AuthService.oauthLogin(provider, mockCode);

      if (response.success) {
        onSuccess(response.user, response.isNewUser);
      } else {
        onError('OAuth login failed');
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'OAuth login failed');
    } finally {
      setIsLoading(null);
    }
  };

  const handleOAuthCallback = async (provider: 'google' | 'facebook', code: string) => {
    setIsLoading(provider);

    try {
      const response = await AuthService.oauthLogin(provider, code);

      if (response.success) {
        onSuccess(response.user, response.isNewUser);
      } else {
        onError('OAuth login failed');
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'OAuth login failed');
    } finally {
      setIsLoading(null);
    }
  };

  const actionText = mode === 'login' ? 'Sign in' : 'Sign up';

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading !== null}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {isLoading === 'google' ? (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600"></div>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>{actionText} with Google</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handleFacebookLogin}
        disabled={isLoading !== null}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-white bg-[#1877F2] hover:bg-[#166FE5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {isLoading === 'facebook' ? (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
        ) : (
          <>
            <FacebookIcon className="w-5 h-5" />
            <span>{actionText} with Facebook</span>
          </>
        )}
      </button>
    </div>
  );
};

export default OAuthButtons;
