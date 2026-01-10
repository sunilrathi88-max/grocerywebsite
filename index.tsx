import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
// import { initGA4 } from './utils/analytics';
import './src/index.css';
import './src/mobile.css';
import './animations.css';

// Initialize Google Analytics if measurement ID is provided
// const gaId = (import.meta as { env?: { VITE_GA_MEASUREMENT_ID?: string } }).env
//   ?.VITE_GA_MEASUREMENT_ID;
// if (gaId && gaId !== 'G-XXXXXXXXXX') {
//   initGA4(gaId); // TODO: Re-enable when real GA4 is added
// }

// Add smooth scroll behavior globally
if (typeof window !== 'undefined') {
  document.documentElement.style.scrollBehavior = 'smooth';
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
