import React from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

// Lazy load pages
const CartPage = React.lazy(() => import('./CartPage'));
const MobileCartPage = React.lazy(() => import('./MobileCartPage'));

const ResponsiveCartPage: React.FC = () => {
    const isMobile = useIsMobile(1024);

    return (
        <React.Suspense
            fallback={
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                </div>
            }
        >
            {isMobile ? <MobileCartPage /> : <CartPage />}
        </React.Suspense>
    );
};

export default ResponsiveCartPage;
