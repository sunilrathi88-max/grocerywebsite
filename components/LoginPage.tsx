import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { UserIcon } from './icons/UserIcon';
import { MailIcon } from './icons/MailIcon';
import { EyeIcon } from './icons/EyeIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import OAuthButtons from './OAuthButtons';
import { AuthService } from '../utils/authService';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onNavigateToSignup: () => void;
  onNavigateToForgotPassword: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onNavigateToSignup,
  onNavigateToForgotPassword,
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Call authentication service
    setIsLoading(true);
    try {
      const response = await AuthService.login(email, password, rememberMe);

      if (response.success) {
        // Map AuthUser to User type
        const user: User = {
          ...response.user,
          addresses: [], // Initialize empty addresses for now
          wishlist: [],
          orders: [],
        };
        onLogin(user);
      } else if (response.requires2FA) {
        // Redirect to 2FA verification page
        navigate('/2fa-verify');
      } else {
        setErrors({ general: response.message || 'Invalid email or password' });
      }
    } catch (_error) {
      setErrors({
        general: _error instanceof Error ? _error.message : 'An error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-secondary/20 via-white to-brand-primary/10 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-brand-primary/10 p-4 rounded-full">
              <UserIcon className="h-12 w-12 text-brand-primary" />
            </div>
          </div>
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your Tattva Co. account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {errors.general && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-shake">
              <AlertTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 top-9 flex items-center pointer-events-none z-10">
                  <MailIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  label="Email Address"
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="you@example.com"
                  disabled={isLoading}
                  error={errors.email}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  placeholder="Enter your password"
                  disabled={isLoading}
                  error={errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 top-8 flex items-center text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary cursor-pointer"
                  disabled={isLoading}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 cursor-pointer"
                >
                  Remember me
                </label>
              </div>

              <button
                type="button"
                onClick={onNavigateToForgotPassword}
                className="text-sm font-medium text-brand-primary hover:text-brand-dark transition-colors"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <Button type="submit" isLoading={isLoading} fullWidth variant="primary">
              Sign In
            </Button>
          </form>

          {/* OAuth Buttons */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <OAuthButtons
                onSuccess={(user, _isNewUser) => {
                  // OAuth returns AuthUser, need to map to User
                  const appUser: User = {
                    ...user,
                    id: 0,
                    name: user.email.split('@')[0],
                    isAdmin: false,
                    addresses: [],
                    wishlist: [],
                    orders: [],
                  };
                  onLogin(appUser);
                }}
                onError={(error) => {
                  setErrors({ general: error });
                }}
                mode="login"
              />
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-900 mb-1">Demo Credentials:</p>
            <p className="text-xs text-blue-700">
              Email: <span className="font-mono">anika.sharma@example.com</span>
            </p>
            <p className="text-xs text-blue-700">
              Password: <span className="font-mono">password123</span>
            </p>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{' '}
            <button
              onClick={onNavigateToSignup}
              className="font-medium text-brand-primary hover:text-brand-dark transition-colors"
            >
              Sign up now
            </button>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to home
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .animate-shake {
          animation: shake 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
