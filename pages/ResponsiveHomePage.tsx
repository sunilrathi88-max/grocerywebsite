import React from 'react';
import { Product, Variant, ToastMessage } from '../types';
import { useIsMobile } from '../hooks/useIsMobile';
import HomePage from './HomePage';

// Lazy load MobileHomePage
const MobileHomePage = React.lazy(() => import('./MobileHomePage'));

interface ResponsiveHomePageProps {
    products: Product[];
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    searchQuery: string;
    selectedTags: string[];
    finalFilteredProducts: Product[];
    productsLoading: boolean;
    wishlistedIds: Set<number>;
    comparisonIds: Set<number>;
    handleAddToCart: (product: Product, variant: Variant, quantity?: number) => void;
    handleToggleWishlist: (product: Product) => void;
    setSelectedProduct: (product: Product | null) => void;
    handleNotifyMe: (productName: string) => void;
    handleToggleCompare: (product: Product) => void;
    handleClearFilters: () => void;
    setIsFilterOpen: (isOpen: boolean) => void;
    setSortOrder: React.Dispatch<
        React.SetStateAction<'name' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>
    >;
    sortOrder: string;
    showOnSale: boolean;
    setShowOnSale: (show: boolean) => void;
    showInStock: boolean;
    setShowInStock: (show: boolean) => void;
    availableTags: string[];
    selectedTagsState: string[];
    handleToggleTag: (tag: string) => void;
    priceRange: { min: number; max: number };
    setPriceRange: (range: { min: number; max: number }) => void;
    maxPrice: number;
    selectedOrigins: string[];
    handleToggleOrigin: (origin: string) => void;
    availableOrigins: string[];
    selectedHeatLevels: string[];
    handleToggleHeatLevel: (level: string) => void;
    availableHeatLevels: string[];
    selectedCuisines: string[];
    handleToggleCuisine: (cuisine: string) => void;
    availableCuisines: string[];
    selectedSizes: string[];
    handleToggleSize: (size: string) => void;
    availableSizes: string[];
    selectedGrinds: string[];
    handleToggleGrind: (grind: string) => void;
    availableGrinds: string[];
    selectedGrades: string[];
    handleToggleGrade: (grade: string) => void;
    availableGrades: string[];
    addToast: (msg: string, type: ToastMessage['type']) => void;
    // Mobile-specific props
    cartItemCount: number;
    onMenuClick: () => void;
    onCartClick: () => void;
    onSearchChange: (query: string) => void;
}

const ResponsiveHomePage: React.FC<ResponsiveHomePageProps> = (props) => {
    const isMobile = useIsMobile(768);

    if (isMobile) {
        return (
            <React.Suspense
                fallback={
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                    </div>
                }
            >
                <MobileHomePage
                    products={props.products}
                    wishlistedIds={props.wishlistedIds}
                    cartItemCount={props.cartItemCount}
                    searchQuery={props.searchQuery}
                    onSearchChange={props.onSearchChange}
                    handleAddToCart={props.handleAddToCart}
                    handleToggleWishlist={props.handleToggleWishlist}
                    setSelectedProduct={props.setSelectedProduct}
                    onMenuClick={props.onMenuClick}
                    onCartClick={props.onCartClick}
                    addToast={props.addToast}
                />
            </React.Suspense>
        );
    }

    return <HomePage {...props} />;
};

export default ResponsiveHomePage;
