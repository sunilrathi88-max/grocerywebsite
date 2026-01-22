import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';
import './src/index.css';
import './src/mobile.css';
import './styles/animations.css';

// Main App Import
import App from './App';

// Error Boundary
import ErrorBoundary from './components/ErrorBoundary';

// Initialize Analytics (Removed due to missing export)
// import { initAnalytics } from './utils/analytics';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <React.Suspense
            fallback={
              <div className="flex h-screen w-full items-center justify-center bg-brand-light">
                <div className="text-xl font-serif text-brand-primary animate-pulse">
                  Loading Rathi Naturals...
                </div>
              </div>
            }
          >
            <App />
          </React.Suspense>
          <ReactQueryDevtools initialIsOpen={false} />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
