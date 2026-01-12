import React from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import { Product, ToastMessage } from '../types';

// Lazy load both pages
const CategoryPage = React.lazy(() => import('./CategoryPage'));
const MobileCategoryPage = React.lazy(() => import('./MobileCategoryPage'));

interface ResponsiveCategoryPageProps {
  // Mobile-specific props
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  cartItemCount?: number;
  onCartClick?: () => void;
  onMenuClick?: () => void;
  addToast?: (msg: string, type: ToastMessage['type']) => void;
  setSelectedProduct?: (product: Product | null) => void;
}

const ResponsiveCategoryPage: React.FC<ResponsiveCategoryPageProps> = (props) => {
  const isMobile = useIsMobile(1024);

  if (isMobile) {
    return (
      <React.Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[60vh] bg-amber-50 dark:bg-stone-900">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        }
      >
        <MobileCategoryPage
          searchQuery={props.searchQuery}
          onSearchChange={props.onSearchChange}
          cartItemCount={props.cartItemCount}
          onCartClick={props.onCartClick}
          onMenuClick={props.onMenuClick}
          addToast={props.addToast}
          setSelectedProduct={props.setSelectedProduct}
        />
      </React.Suspense>
    );
  }

  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      }
    >
      <CategoryPage />
    </React.Suspense>
  );
};

export default ResponsiveCategoryPage;
