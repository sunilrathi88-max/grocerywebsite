import React from 'react';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { ExclamationCircleIcon } from './icons/ExclamationCircleIcon';

interface APIErrorDisplayProps {
  error: {
    message: string;
    code?: string;
    status?: number;
  };
  onRetry?: () => void;
  onDismiss?: () => void;
  fullPage?: boolean;
}

/**
 * Component to display API errors with appropriate UI
 */
export const APIErrorDisplay: React.FC<APIErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  fullPage = false,
}) => {
  const getErrorTitle = () => {
    if (error.status === 404) return 'Not Found';
    if (error.status === 401) return 'Unauthorized';
    if (error.status === 403) return 'Forbidden';
    if (error.status && error.status >= 500) return 'Server Error';
    if (error.code === 'NETWORK_ERROR') return 'Connection Error';
    return 'Error';
  };

  const getErrorIcon = () => {
    if (error.status && error.status >= 500) {
      return <AlertTriangleIcon className="h-16 w-16 text-red-500" />;
    }
    return <ExclamationCircleIcon className="h-16 w-16 text-amber-500" />;
  };

  const getErrorDescription = () => {
    if (error.code === 'NETWORK_ERROR') {
      return 'Please check your internet connection and try again.';
    }
    if (error.status === 404) {
      return 'The requested resource could not be found.';
    }
    if (error.status === 401) {
      return 'Please log in to continue.';
    }
    if (error.status === 403) {
      return 'You do not have permission to access this resource.';
    }
    if (error.status && error.status >= 500) {
      return "We're experiencing technical difficulties. Please try again later.";
    }
    return error.message || 'An unexpected error occurred.';
  };

  if (fullPage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8 text-center">
        {getErrorIcon()}
        <h1 className="mt-6 text-3xl font-serif font-bold text-brand-dark">{getErrorTitle()}</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-lg">{getErrorDescription()}</p>
        {error.code && (
          <p className="mt-2 text-sm text-gray-500">
            Error Code: <span className="font-mono">{error.code}</span>
          </p>
        )}
        <div className="mt-8 flex gap-4">
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-brand-primary text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300"
            >
              Try Again
            </button>
          )}
          <button
            onClick={() => (window.location.href = '/')}
            className="bg-white text-brand-dark font-bold py-3 px-8 rounded-full border-2 border-brand-dark hover:bg-brand-accent transition-all duration-300"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg my-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <ExclamationCircleIcon className="h-6 w-6 text-red-500" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-lg font-semibold text-red-900">{getErrorTitle()}</h3>
          <p className="mt-2 text-sm text-red-700">{getErrorDescription()}</p>
          {error.code && (
            <p className="mt-1 text-xs text-red-600 font-mono">Error: {error.code}</p>
          )}
        </div>
        <div className="ml-4 flex gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-sm text-red-700 hover:text-red-900 font-medium underline"
            >
              Retry
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-sm text-red-700 hover:text-red-900 font-medium"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Loading skeleton component
 */
export const LoadingState: React.FC<{ fullPage?: boolean; message?: string }> = ({
  fullPage = false,
  message = 'Loading...',
}) => {
  if (fullPage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-primary"></div>
        <p className="mt-4 text-lg text-gray-600">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand-primary"></div>
      <span className="ml-4 text-gray-600">{message}</span>
    </div>
  );
};

/**
 * Empty state component
 */
export const EmptyState: React.FC<{
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({ title, description, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <svg
          className="h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-brand-primary text-white font-bold py-2 px-6 rounded-full hover:bg-opacity-90 transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
