import React, { useState, useEffect } from 'react';
import { AuthService } from '../utils/authService';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';

interface TwoFactorSetupPageProps {
  onComplete: () => void;
  onCancel: () => void;
}

const TwoFactorSetupPage: React.FC<TwoFactorSetupPageProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<'intro' | 'scan' | 'verify' | 'backup' | 'complete'>('intro');
  const [secret, setSecret] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackupCodes, setCopiedBackupCodes] = useState(false);

  useEffect(() => {
    if (step === 'scan') {
      initiate2FASetup();
    }
  }, [step]);

  const initiate2FASetup = async () => {
    try {
      const response = await AuthService.setup2FA();
      if (response.success) {
        setSecret(response.secret);
        setQrCodeUrl(response.qrCodeUrl);
        setBackupCodes(response.backupCodes);
      }
    } catch (_error) {
      console.error('Failed to setup 2FA:', error);
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    setVerificationError('');

    try {
      const response = await AuthService.verify2FA(verificationCode, 1); // Replace 1 with actual user ID
      if (response.success) {
        setStep('backup');
      } else {
        setVerificationError(response.message || 'Invalid code. Please try again.');
      }
    } catch (_error) {
      setVerificationError(error instanceof Error ? error.message : 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const copyToClipboard = (text: string, type: 'secret' | 'backup') => {
    navigator.clipboard.writeText(text);
    if (type === 'secret') {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    } else {
      setCopiedBackupCodes(true);
      setTimeout(() => setCopiedBackupCodes(false), 2000);
    }
  };

  const downloadBackupCodes = () => {
    const text = backupCodes.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tattva-co-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheckIcon className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Enable Two-Factor Authentication
            </h2>
            <p className="text-gray-600">Add an extra layer of security to your account</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-blue-600 font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Install an Authenticator App</h3>
                <p className="text-sm text-gray-600">
                  Download Google Authenticator, Authy, or Microsoft Authenticator
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-blue-600 font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Scan QR Code</h3>
                <p className="text-sm text-gray-600">
                  Use the app to scan the QR code we&apos;ll provide
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-blue-600 font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Enter Verification Code</h3>
                <p className="text-sm text-gray-600">
                  Enter the 6-digit code from the app to verify setup
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setStep('scan')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
            <button
              onClick={onCancel}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'scan') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Scan QR Code</h2>

          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
            <img src={qrCodeUrl} alt="2FA QR Code" className="w-full h-auto mx-auto" />
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Can&apos;t scan? Enter this code manually:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-white px-3 py-2 rounded border border-gray-300 text-sm font-mono break-all">
                {secret}
              </code>
              <button
                onClick={() => copyToClipboard(secret, 'secret')}
                className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                title="Copy secret"
              >
                {copiedSecret ? (
                  <CheckCircleIcon className="w-5 h-5" />
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            onClick={() => setStep('verify')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            I&apos;ve Scanned the Code
          </button>
        </div>
      </div>
    );
  }

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Verification Code</h2>
          <p className="text-gray-600 mb-6">Enter the 6-digit code from your authenticator app</p>

          <div className="mb-6">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setVerificationCode(value);
                setVerificationError('');
              }}
              placeholder="000000"
              className={`w-full px-4 py-3 border ${
                verificationError ? 'border-red-500' : 'border-gray-300'
              } rounded-lg text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500`}
              maxLength={6}
            />
            {verificationError && (
              <div className="mt-2 flex items-center text-red-600 text-sm">
                <AlertTriangleIcon className="w-4 h-4 mr-1" />
                {verificationError}
              </div>
            )}
          </div>

          <button
            onClick={handleVerify}
            disabled={verificationCode.length !== 6 || isVerifying}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isVerifying ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Verifying...
              </>
            ) : (
              'Verify and Continue'
            )}
          </button>

          <button
            onClick={() => setStep('scan')}
            className="w-full mt-3 text-gray-600 hover:text-gray-900 py-2 font-medium"
          >
            Back to QR Code
          </button>
        </div>
      </div>
    );
  }

  if (step === 'backup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangleIcon className="w-10 h-10 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Save Backup Codes</h2>
            <p className="text-gray-600">
              Store these codes safely. You&apos;ll need them if you lose access to your
              authenticator app.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-2">
              {backupCodes.map((code, index) => (
                <div
                  key={index}
                  className="bg-white px-3 py-2 rounded border border-gray-300 text-sm font-mono text-center"
                >
                  {code}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={() => copyToClipboard(backupCodes.join('\n'), 'backup')}
              className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center"
            >
              {copiedBackupCodes ? (
                <>
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy Codes
                </>
              )}
            </button>

            <button
              onClick={downloadBackupCodes}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Download as Text File
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-amber-900 mb-2">⚠️ Important:</h3>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Each code can only be used once</li>
              <li>• Store them in a secure location</li>
              <li>• Don&apos;t share these codes with anyone</li>
            </ul>
          </div>

          <button
            onClick={() => setStep('complete')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            I&apos;ve Saved My Codes
          </button>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">All Set!</h2>
          <p className="text-gray-600 mb-8">
            Two-factor authentication is now enabled on your account. You&apos;ll need your
            authenticator app to sign in.
          </p>
          <button
            onClick={onComplete}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Return to Account Settings
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default TwoFactorSetupPage;
