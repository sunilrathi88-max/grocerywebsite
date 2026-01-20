import React from 'react';
import { Product, Variant, ToastMessage } from '../types';
import { useABTest } from '../src/context/ABTestContext'; // A/B Test Hook
import HeroSection from '../components/HeroSection';
import TrustSignals from '../components/TrustSignals';
import JourneyTimeline from '../components/JourneyTimeline';
import HarvestCollection from '../components/HarvestCollection';
import CategoryShowcase from '../components/CategoryShowcase';
import ProductGrid from '../components/ProductGrid';
import SortDropdown from '../components/SortDropdown';
import AdvancedFilters from '../components/AdvancedFilters';

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

  return (
    <main className="bg-white">
      {/* 1. Hero Section (New Design) */}
      <HeroSection />

      {/* 2. Trust Signals (Dark Strip) */}
      <TrustSignals />

      {/* 3. Journey Timeline (Transparency) */}
      <JourneyTimeline />

      {/* 4. Harvest Collection (Curated Grid) */}
      <HarvestCollection products={products} />

      {/* 5. Category Showcase (Whole/Blends/Infusions) */}
      <CategoryShowcase />

      {/* 6. Main Product Grid (Full Catalog) */}
      <div id="products-section" className="bg-background-light py-20 border-t border-primary/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-accent-charcoal mb-4">
              Shop All
            </h2>
            <p className="text-accent-charcoal/60 max-w-2xl mx-auto">
              Explore our complete collection of ethically sourced, single-origin spices and blends.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-1/4 hidden lg:block sticky top-24 self-start max-h-[calc(100vh-120px)] overflow-y-auto pr-4 scrollbar-thin">
              <AdvancedFilters
                priceRange={priceRange}
                maxPrice={maxPrice}
                onPriceChange={(value) => setPriceRange({ min: 0, max: value })}
                selectedOrigins={selectedOrigins}
                onToggleOrigin={handleToggleOrigin}
                origins={availableOrigins}
                selectedHeatLevels={selectedHeatLevels}
                onToggleHeatLevel={handleToggleHeatLevel}
                heatLevels={availableHeatLevels}
                selectedCuisines={selectedCuisines}
                onToggleCuisine={handleToggleCuisine}
                cuisines={availableCuisines}
                selectedSizes={selectedSizes}
                onToggleSize={handleToggleSize}
                sizes={availableSizes}
                selectedGrinds={selectedGrinds}
                onToggleGrind={handleToggleGrind}
                grinds={availableGrinds}
                selectedGrades={selectedGrades}
                onToggleGrade={handleToggleGrade}
                grades={availableGrades}
                selectedTags={selectedTagsState}
                onToggleTag={handleToggleTag}
                availableTags={availableTags}
                showOnSale={showOnSale}
                onToggleOnSale={() => setShowOnSale(!showOnSale)}
                showInStock={showInStock}
                onToggleInStock={() => setShowInStock(!showInStock)}
              />
            </aside>

            {/* Product Grid */}
            <div className="w-full lg:w-3/4">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <p className="text-sm text-accent-charcoal font-medium">
                  Showing {finalFilteredProducts.length} Results
                </p>
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <button
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-primary/20 rounded text-sm font-bold text-primary hover:bg-primary/5 transition-colors"
                    onClick={() => setIsFilterOpen(true)}
                  >
                    <span className="material-symbols-outlined text-[18px]">filter_list</span>
                    Filters
                  </button>
                  <SortDropdown
                    currentSort={sortOrder}
                    onSortChange={(value) =>
                      setSortOrder(
                        value as 'name' | 'price-asc' | 'price-desc' | 'rating' | 'newest'
                      )
                    }
                  />
                </div>
              </div>

              <ProductGrid
                products={finalFilteredProducts}
                isLoading={productsLoading}
                onAddToCart={handleAddToCartWithTracking}
                onToggleWishlist={handleToggleWishlist}
                onSelectProduct={setSelectedProduct}
                onNotifyMe={handleNotifyMe}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
