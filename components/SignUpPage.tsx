import React, { useState } from 'react';
import { UserIcon } from './icons/UserIcon';
import { MailIcon } from './icons/MailIcon';
import { EyeIcon } from './icons/EyeIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import OAuthButtons from './OAuthButtons';
import { AuthService } from '../utils/authService';

interface SignUpPageProps {
  onSignUp: (name: string, email: string, password: string) => void;
  onNavigateToLogin: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onSignUp, onNavigateToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPasswordStrength = (
    password: string
  ): {
    strength: number;
    label: string;
    color: string;
  } => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 1) return { strength: 20, label: 'Weak', color: 'bg-red-500' };
    if (strength === 2) return { strength: 40, label: 'Fair', color: 'bg-orange-500' };
    if (strength === 3) return { strength: 60, label: 'Good', color: 'bg-yellow-500' };
    if (strength === 4) return { strength: 80, label: 'Strong', color: 'bg-green-500' };
    return { strength: 100, label: 'Very Strong', color: 'bg-green-600' };
  };

  const passwordStrength = password ? getPasswordStrength(password) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Call authentication service
    setIsLoading(true);
    try {
      const response = await AuthService.signUp(name, email, password);

      if (response.success) {
        if (response.verificationEmailSent) {
          // Redirect to email verification page
          window.location.hash = `#/verify-email?email=${encodeURIComponent(email)}`;
        } else {
          onSignUp(name, email, password);
        }
      } else {
        setErrors({ general: response.message || 'Sign up failed' });
      }
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'An error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary/10 via-white to-brand-secondary/20 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-brand-primary/10 p-4 rounded-full">
              <UserIcon className="h-12 w-12 text-brand-primary" />
            </div>
          </div>
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600">Join Tattva Co. and discover premium Indian products</p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {errors.general && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-shake">
              <AlertTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.name
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-brand-primary'
                  } rounded-lg focus:outline-none focus:ring-2 transition-all duration-200`}
                  placeholder="John Doe"
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertTriangleIcon className="h-4 w-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.email
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-brand-primary'
                  } rounded-lg focus:outline-none focus:ring-2 transition-all duration-200`}
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertTriangleIcon className="h-4 w-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pr-10 px-3 py-3 border ${
                    errors.password
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-brand-primary'
                  } rounded-lg focus:outline-none focus:ring-2 transition-all duration-200`}
                  placeholder="Create a strong password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertTriangleIcon className="h-4 w-4" />
                  {errors.password}
                </p>
              )}
              {passwordStrength && !errors.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Password strength:</span>
                    <span
                      className={`text-xs font-medium ${passwordStrength.strength >= 60 ? 'text-green-600' : passwordStrength.strength >= 40 ? 'text-yellow-600' : 'text-red-600'}`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`block w-full pr-10 px-3 py-3 border ${
                    errors.confirmPassword
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-brand-primary'
                  } rounded-lg focus:outline-none focus:ring-2 transition-all duration-200`}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertTriangleIcon className="h-4 w-4" />
                  {errors.confirmPassword}
                </p>
              )}
              {confirmPassword && password === confirmPassword && !errors.confirmPassword && (
                <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircleIcon className="h-4 w-4" />
                  Passwords match
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div>
              <div className="flex items-start">
                <input
                  id="accept-terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className={`mt-1 h-4 w-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary cursor-pointer ${
                    errors.terms ? 'border-red-500' : ''
                  }`}
                  disabled={isLoading}
                />
                <label
                  htmlFor="accept-terms"
                  className="ml-2 block text-sm text-gray-700 cursor-pointer"
                >
                  I agree to the{' '}
                  <a
                    href="#/terms-of-service"
                    className="font-medium text-brand-primary hover:text-brand-dark"
                    target="_blank"
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    href="#/privacy-policy"
                    className="font-medium text-brand-primary hover:text-brand-dark"
                    target="_blank"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.terms && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertTriangleIcon className="h-4 w-4" />
                  {errors.terms}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-brand-primary to-brand-dark text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* OAuth Buttons */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>

            <div className="mt-6">
              <OAuthButtons
                onSuccess={(user, isNewUser) => {
                  if (isNewUser) {
onSignUp(user.user_metadata?.name || user.email?.split('@')[0] || '', user.email, '');                  } else {
                    // User already exists, redirect to home
                    window.location.hash = '#/';
                  }
                }}
                onError={(error) => {
                  setErrors({ general: error });
                }}
                mode="signup"
              />
            </div>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onNavigateToLogin}
              className="font-medium text-brand-primary hover:text-brand-dark transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <button
            onClick={() => (window.location.hash = '#/')}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to home
          </button>
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

export default SignUpPage;
