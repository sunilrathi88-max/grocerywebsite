import React, { useState, useEffect, useCallback } from 'react';
import { AuthService } from '../utils/authService';
import { MailIcon } from './icons/MailIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface EmailVerificationPageProps {
  email: string;
  onNavigateToHome: () => void;
  onResendEmail?: () => void;
}

const EmailVerificationPage: React.FC<EmailVerificationPageProps> = ({
  email,
  onNavigateToHome,
  onResendEmail,
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);

  const verifyEmail = useCallback(
    async (token: string) => {
      setIsVerifying(true);
      setError('');

      try {
        const response = await AuthService.verifyEmail(token);
        if (response.success) {
          setIsVerified(true);
          // Auto-redirect after 3 seconds
          setTimeout(() => {
            onNavigateToHome();
          }, 3000);
        } else {
          setError('Verification failed. The link may be expired or invalid.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Verification failed');
      } finally {
        setIsVerifying(false);
      }
    },
    [onNavigateToHome]
  );

  // Check for verification token in URL
  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split('?')[1] || '');
    const token = params.get('token');

    if (token) {
      verifyEmail(token);
    }
  }, [verifyEmail]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;

    setResendSuccess(false);
    setError('');

    try {
      const response = await AuthService.sendVerificationEmail(email);
      if (response.success) {
        setResendSuccess(true);
        setResendCooldown(60); // 60 second cooldown
        if (onResendEmail) onResendEmail();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend email');
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
          <p className="text-gray-600 mb-6">
            Your email has been successfully verified. Redirecting you to the homepage...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Email...</h2>
          <p className="text-gray-600">Please wait while we verify your email address.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircleIcon className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleResendEmail}
            disabled={resendCooldown > 0}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Verification Email'}
          </button>
          <button
            onClick={onNavigateToHome}
            className="w-full mt-3 text-gray-600 hover:text-gray-900 py-2 font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MailIcon className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
          <p className="text-gray-600">
            We&apos;ve sent a verification link to{' '}
            <span className="font-semibold text-gray-900">{email}</span>
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">📬 Check Your Inbox</h3>
          <p className="text-sm text-blue-800 mb-2">
            Click the verification link in the email to activate your account.
          </p>
          <p className="text-xs text-blue-700">The link will expire in 24 hours.</p>
        </div>

        {resendSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-start">
            <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-green-800">
              Verification email sent! Please check your inbox.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleResendEmail}
            disabled={resendCooldown > 0}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Verification Email'}
          </button>

          <button
            onClick={onNavigateToHome}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            I&apos;ll Verify Later
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Didn&apos;t receive the email?</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Check your spam or junk folder
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Make sure you entered the correct email address
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Wait a few minutes for the email to arrive
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Try resending the verification email
            </li>
          </ul>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Need help?{' '}
          <button
            onClick={() => (window.location.hash = '#/contact')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
