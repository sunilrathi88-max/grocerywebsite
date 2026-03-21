import React from 'react';
import { Product, Variant, ToastMessage } from '../types';
import { useABTest } from '../src/context/ABTestContext'; // A/B Test Hook
import Hero from '../components/Hero';
import MarqueeStrip from '../components/ui/MarqueeStrip';
import PhilosophySection from '../components/ui/PhilosophySection';
import PinnedProcessSection from '../components/ui/PinnedProcessSection';
import TrustSignals from '../components/TrustSignals';
import HarvestCollection from '../components/HarvestCollection';
import ProductGrid from '../components/ProductGrid';
import SortDropdown from '../components/SortDropdown';
import AdvancedFilters from '../components/AdvancedFilters';
// Lazy load below-the-fold heavy components for INP/LCP optimization
const Testimonials = React.lazy(() => import('../components/Testimonials'));
const CookingContextWidget = React.lazy(() => import('../components/CookingContextWidget'));
const BlogHighlights = React.lazy(() => import('../components/BlogHighlights'));
const NewsletterSection = React.lazy(() => import('../components/NewsletterSection'));
const RecommendedProducts = React.lazy(() => import('../components/RecommendedProducts'));

import { FEATURED_TESTIMONIALS } from '../data/testimonials';
import QuizModule from '../components/QuizModule';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';
import { pageSEO, generateOrganizationSchema, generateWebsiteSchema } from '../utils/seo';

interface HomePageProps {
  products: Product[];
  _selectedCategory: string;
  _setSelectedCategory: (category: string) => void;
  _searchQuery: string;
  _selectedTags: string[];
  finalFilteredProducts: Product[];
  productsLoading: boolean;
  _wishlistedIds: Set<number>;
  _comparisonIds: Set<number>;
  handleAddToCart: (product: Product, variant: Variant, quantity?: number) => void;
  handleToggleWishlist: (product: Product) => void;
  setSelectedProduct: (product: Product | null) => void;
  handleNotifyMe: (productName: string) => void;
  handleToggleCompare: (product: Product) => void;
  _handleClearFilters: () => void;
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
  _addToast: (msg: string, type: ToastMessage['type']) => void;
}

const HomePage: React.FC<HomePageProps> = ({
  products,
  _selectedCategory,
  _setSelectedCategory,
  _searchQuery,
  _selectedTags,
  finalFilteredProducts,
  productsLoading,
  _wishlistedIds,
  _comparisonIds,
  handleAddToCart,
  handleToggleWishlist,
  setSelectedProduct,
  handleNotifyMe,
  _handleClearFilters,
  setIsFilterOpen,
  setSortOrder,
  sortOrder,
  showOnSale,
  setShowOnSale,
  showInStock,
  setShowInStock,
  availableTags,
  selectedTagsState,
  handleToggleTag,
  priceRange,
  setPriceRange,
  maxPrice,
  selectedOrigins,
  handleToggleOrigin,
  availableOrigins,
  selectedHeatLevels,
  handleToggleHeatLevel,
  availableHeatLevels,
  selectedCuisines,
  handleToggleCuisine,
  availableCuisines,
  selectedSizes,
  handleToggleSize,
  availableSizes,
  selectedGrinds,
  handleToggleGrind,
  availableGrinds,
  selectedGrades,
  handleToggleGrade,
  availableGrades,
  _addToast,
}) => {
  const { variant, trackConversion } = useABTest();

  // Track View on Mount
  React.useEffect(() => {
    trackConversion('view_homepage', { variant });
  }, [variant, trackConversion]);

  // Wrap Add to Cart for Tracking
  const handleAddToCartWithTracking = (product: Product, variant: Variant, quantity?: number) => {
    trackConversion('add_to_cart', { productId: product.id, productName: product.name });
    handleAddToCart(product, variant, quantity);
  };

  const handleQuizToast = (message: string, type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      default:
        toast(message);
    }
  };

  // Handler for CookingContextWidget
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddBundleToCart = (kit: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kit.products.forEach((p: any) => {
      // Find full product object if needed, or construct minimal product object
      // Since existing handleAddToCart might need full Product object, we should probably find it in 'products' prop
      const fullProduct = products.find((prod) => prod.id === p.id);
      if (fullProduct) {
        handleAddToCart(fullProduct, fullProduct.variants[0], 1);
      }
    });
    _addToast(`Added ${kit.name} to cart!`, 'success');
  };

  return (
    <main className="bg-ink min-h-screen">
      <SEO 
        {...pageSEO.home()} 
        title="Rathi Naturals — Premium Indian Spices (Cold Ground, Est. 1965)"
        description="Shop premium single-origin Indian spices. Cold-ground in small batches to preserve 100% of natural essential oils, colour, and aroma."
        structuredData={[
          generateOrganizationSchema(), 
          generateWebsiteSchema()
        ]} 
      />
      {/* 1. Hero Section (New Design) */}
      <Hero />

      {/* 2. Marquee Strip */}
      <MarqueeStrip />

      {/* 3. Heritage Philosophy */}
      <PhilosophySection />

      {/* 4. Pinned Process */}
      <PinnedProcessSection />

      {/* 4. Why Choose Rathi Naturals? */}
      {/* Removed BrandStory and CategoryShowcase as per user request */}
      <TrustSignals />

      {/* Lazy Loaded Below The Fold Components */}
      <React.Suspense fallback={<div className="w-full h-40 bg-background-light animate-pulse" />}>
        {/* 4b. Personalized Recommendations (Based on History) */}
        <RecommendedProducts
          allProducts={products}
          onAddToCart={handleAddToCartWithTracking}
          onSelectProduct={setSelectedProduct}
          onNotifyMe={handleNotifyMe}
        />

        {/* 5. Cooking Context Widget (Moved up for better engagement) */}
        <div className="py-8 bg-[#fafafa]">
          <CookingContextWidget onAddBundleToCart={handleAddBundleToCart} />
        </div>

        {/* 6. Customer Testimonials */}
        <Testimonials testimonials={FEATURED_TESTIMONIALS} />

        {/* 7. Featured Products - Best Sellers */}
        <HarvestCollection
          products={products}
          title="Best Sellers"
          subtitle="Most loved by our customers."
        />

        {/* 8. Featured Products - New Arrivals */}
        <HarvestCollection
          products={products.slice(0, 4)}
          title="New Arrivals"
          subtitle="Fresh from the latest harvest."
        />

        {/* 11. Blog Highlights */}
        <BlogHighlights />

        {/* 12. Newsletter Signup */}
        <NewsletterSection />
      </React.Suspense>

      {/* (Hidden) Main Product Grid for SEO/Fallback purposes - kept but de-emphasized */}
      <div className="hidden">
        <ProductGrid
          products={finalFilteredProducts}
          isLoading={productsLoading}
          onAddToCart={handleAddToCartWithTracking}
          onToggleWishlist={handleToggleWishlist}
          onSelectProduct={setSelectedProduct}
          onNotifyMe={handleNotifyMe}
        />
      </div>
    </main>
  );
};

export default HomePage;
