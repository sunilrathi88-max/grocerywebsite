import React, { ErrorInfo, PropsWithChildren } from 'react';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';

type Props = PropsWithChildren<Record<string, never>>;

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  // FIX: Reverted to constructor-based state initialization to resolve error with 'this.props'.
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    // In a real app, you would log this to an error reporting service
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-brand-accent p-8 text-center">
          <AlertTriangleIcon className="h-20 w-20 text-red-500 mb-6" />
          <h1 className="text-4xl font-serif font-bold text-brand-dark">
            Oops! Something went wrong.
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-lg">
            We&apos;ve encountered an unexpected issue. Our team has been notified. Please try
            refreshing the page.
          </p>
          <button
            onClick={this.handleRefresh}
            className="mt-8 bg-brand-primary text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
