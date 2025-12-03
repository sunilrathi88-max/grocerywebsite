import React, { useState } from 'react';
import { MailIcon } from './icons/MailIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface ForgotPasswordPageProps {
  onNavigateToLogin: () => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigateToLogin }) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    // Simulate API call
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
    } catch {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-secondary/20 via-white to-brand-primary/10 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-brand-primary/10 p-4 rounded-full">
              <MailIcon className="h-12 w-12 text-brand-primary" />
            </div>
          </div>
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-2">Forgot Password?</h2>
          <p className="text-gray-600">
            {isSuccess ? (
              'Check your email for reset instructions'
            ) : (
              <>No worries, we&apos;ll send you reset instructions</>
            )}
          </p>
        </div>

        {/* Form or Success Message */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {isSuccess ? (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircleIcon className="h-16 w-16 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Email Sent!</h3>
                <p className="text-gray-600">
                  We&apos;ve sent password reset instructions to{' '}
                  <span className="font-medium text-gray-900">{email}</span>
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <p className="text-sm text-blue-900 mb-2">
                  <strong>Didn&apos;t receive the email?</strong>
                </p>
                <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                  <li>Check your spam or junk folder</li>
                  <li>Verify the email address is correct</li>
                  <li>Wait a few minutes and check again</li>
                </ul>
              </div>
              <div className="space-y-3">
                <button
                  onClick={onNavigateToLogin}
                  className="w-full bg-gradient-to-r from-brand-primary to-brand-dark text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                >
                  Back to Login
                </button>
                <button
                  onClick={handleReset}
                  className="w-full text-brand-primary hover:text-brand-dark font-medium transition-colors"
                >
                  Try another email
                </button>
              </div>
            </div>
          ) : (
            <>
              {errors.general && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-shake">
                  <AlertTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{errors.general}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
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
                      Sending...
                    </span>
                  ) : (
                    'Send Reset Instructions'
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Back to Login Link */}
        {!isSuccess && (
          <div className="text-center">
            <button
              onClick={onNavigateToLogin}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to login
            </button>
          </div>
        )}

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

export default ForgotPasswordPage;
