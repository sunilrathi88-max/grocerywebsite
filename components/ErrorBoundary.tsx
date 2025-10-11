import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: undefined,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // In a real app, you would log this to an error reporting service
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-brand-accent p-8 text-center">
          <AlertTriangleIcon className="h-20 w-20 text-red-500 mb-6" />
          <h1 className="text-4xl font-serif font-bold text-brand-dark">Oops! Something went wrong.</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-lg">
            We've encountered an unexpected issue. Our team has been notified. Please try refreshing the page.
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
