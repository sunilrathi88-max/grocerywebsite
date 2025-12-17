import React, { useState } from 'react';
import { utilsAPI } from '../utils/apiService';
import { PincodeServiceability } from '../types';

interface PincodeCheckerProps {
  onCheck?: (data: { serviceable: boolean; details?: any }) => void;
  className?: string; // Standard className prop for styling
}

const PincodeChecker: React.FC<PincodeCheckerProps> = ({ onCheck, className }) => {
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    serviceable: boolean;
    message: string;
    details?: {
      city: string;
      state: string;
      codAvailable: boolean;
      estimatedDeliveryDays: number;
    };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await utilsAPI.checkPincode(pincode);
      // Edge function structure: { serviceable: boolean, message: string, details?: ... }
      // utilsAPI wraps it in { success: true, data: ... }

      const checkResult = response.data;
      setResult(checkResult);

      if (onCheck) {
        onCheck(checkResult);
      }
    } catch (err: any) {
      console.error('Pincode check failed', err);
      // Handle different error structures if needed
      setError(err.message || 'Failed to check pincode. Please try again.');
      if (onCheck) {
        onCheck({ serviceable: false });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`mt-4 ${className || ''}`}>
      <label htmlFor="pincode-check" className="block text-sm font-medium text-gray-700 mb-1">
        Check Delivery Availability
      </label>
      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          id="pincode-check"
          type="text"
          value={pincode}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '');
            if (val.length <= 6) setPincode(val);
          }}
          placeholder="Enter Pincode"
          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
          maxLength={6}
        />
        <button
          type="submit"
          disabled={loading || pincode.length !== 6}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-brand-dark bg-brand-primary hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Checking...' : 'Check'}
        </button>
      </form>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {result && (
        <div
          className={`mt-2 text-sm rounded-md p-2 flex items-start gap-2 ${result.serviceable ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
        >
          {result.serviceable ? (
            <svg
              className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          ) : (
            <svg
              className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          )}
          <div>
            <p className="font-medium">{result.message}</p>
            {result.serviceable && result.details && (
              <p className="text-xs mt-1 text-green-700">
                Est. Delivery: {result.details.estimatedDeliveryDays} days
                {result.details.codAvailable ? ' • COD Available' : ' • No COD'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PincodeChecker;
