import React from 'react';
import { Product, Variant, ToastMessage } from '../types';
import { useABTest } from '../src/context/ABTestContext'; // A/B Test Hook
import { HeroSection } from '../components/HeroSection';
import WhyChooseUs from '../components/WhyChooseUs';
import CertificationsBanner from '../components/CertificationsBanner';
import ShopByCategory from '../components/ShopByCategory';
import ShopByUseCase from '../components/ShopByUseCase';
import FeaturedCollection from '../components/FeaturedCollection';
import BrandStory from '../components/BrandStory';
import RecommendedProducts from '../components/RecommendedProducts';
import Testimonials from '../components/Testimonials';
import BlogStrip from '../components/BlogStrip';
import FAQPreview from '../components/FAQPreview';
import Newsletter from '../components/Newsletter';
import ProductGrid from '../components/ProductGrid';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import SortDropdown from '../components/SortDropdown';
import AdvancedFilters from '../components/AdvancedFilters';
import QuizModule from '../components/QuizModule';
import { MOCK_TESTIMONIALS } from '../data/testimonials';

interface HomePageProps {
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
}

const HomePage: React.FC<HomePageProps> = ({
  products,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  selectedTags,
  finalFilteredProducts,
  productsLoading,
  wishlistedIds,
  comparisonIds,
  handleAddToCart,
  handleToggleWishlist,
  setSelectedProduct,
  handleNotifyMe,
  handleClearFilters,
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
  addToast,
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
    <main>
      <HeroSection
        title={
          variant === 'B'
            ? '100% Organic, High-Curcumin Turmeric & Premium Spices'
            : 'From Flavorless Dust... To Dishes That Taste Alive.'
        }
        subtitle={
          variant === 'B'
            ? 'Sourced directly from farmers. FSSAI Certified. Cold-ground to preserve essential oils. Shop the purest spices in India.'
            : 'Your dishes will taste alive—never bland again. Cold-ground spices from partner farms, lab-tested for purity. Delivered fresh to your kitchen.'
        }
        badges={[
          { icon: '❄️', text: 'Cold Ground Daily' },
          { icon: '🔬', text: 'Lab Tested Every Batch' },
          { icon: '🌾', text: 'Direct from Farmers' },
          { icon: '✅', text: 'FSSAI Certified' },
        ]}
        ctaPrimary={{ text: 'Browse Collections', href: '#products-section' }}
        ctaSecondary={{ text: 'Take the Spice Quiz', href: '#quiz-section' }}
        heroImage="/images/rathi-naturals-hero.png"
        subtext="Trusted by 1000+ home chefs across india"
      />

      {/* Best Sellers - Masalas Only (right after hero) */}
      <FeaturedCollection
        title="Our Most Loved Masalas"
        products={products.filter((p) => [4, 12, 29, 28, 27].includes(p.id))}
        onAddToCart={handleAddToCartWithTracking}
        onToggleWishlist={handleToggleWishlist}
        wishlistedIds={wishlistedIds}
        onSelectProduct={setSelectedProduct}
        onNotifyMe={handleNotifyMe}
        onViewAll={() => {
          setSelectedCategory('Spices');
          const element = document.getElementById('products-section');
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <CertificationsBanner className="mt-4 mb-8" />

      <div id="category-showcase">
        <ShopByCategory
          onSelectCategory={(cat) => {
            // Basic handling, ideally filter by category
            setSelectedCategory(cat);
            const element = document.getElementById('products-section');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </div>

      <WhyChooseUs />

      <React.Suspense fallback={<div>Loading Testimonials...</div>}>
        <Testimonials testimonials={MOCK_TESTIMONIALS} />
      </React.Suspense>

      <ShopByUseCase />

      {/* New Arrivals - Different background */}
      <FeaturedCollection
        title="New Arrivals"
        products={products.slice(8, 16)}
        onAddToCart={handleAddToCartWithTracking}
        onToggleWishlist={handleToggleWishlist}
        wishlistedIds={wishlistedIds}
        onSelectProduct={setSelectedProduct}
        onNotifyMe={handleNotifyMe}
        bgClass="bg-neutral-50"
        onViewAll={() => {
          setSortOrder('newest');
          const element = document.getElementById('products-section');
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <BrandStory />

      {/* Personalized Recommendations */}
      <React.Suspense fallback={null}>
        <RecommendedProducts
          allProducts={products}
          onAddToCart={handleAddToCartWithTracking}
          onSelectProduct={setSelectedProduct}
          onNotifyMe={handleNotifyMe}
        />
      </React.Suspense>

      <BlogStrip />

      <FAQPreview />

      <Newsletter />

      {/* Main Product Grid Section */}
      <div id="products-section" className="bg-brand-accent py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-dark mb-6">
              Shop All
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Explore our full range of premium spices.
            </p>
          </div>

          {/* Advanced Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-10">
            <aside className="hidden md:block sticky top-24 h-fit z-10">
              <React.Suspense
                fallback={<div className="h-[450px] bg-gray-100 rounded-xl animate-pulse" />}
              >
                <AdvancedFilters
                  showOnSale={showOnSale}
                  onToggleOnSale={() => setShowOnSale(!showOnSale)}
                  showInStock={showInStock}
                  onToggleInStock={() => setShowInStock(!showInStock)}
                  availableTags={availableTags}
                  selectedTags={selectedTagsState}
                  onToggleTag={handleToggleTag}
                  priceRange={priceRange}
                  maxPrice={maxPrice}
                  onPriceChange={(max) => setPriceRange({ ...priceRange, max })}
                  origins={availableOrigins}
                  selectedOrigins={selectedOrigins}
                  onToggleOrigin={handleToggleOrigin}
                  heatLevels={availableHeatLevels}
                  selectedHeatLevels={selectedHeatLevels}
                  onToggleHeatLevel={handleToggleHeatLevel}
                  cuisines={availableCuisines}
                  selectedCuisines={selectedCuisines}
                  onToggleCuisine={handleToggleCuisine}
                  sizes={availableSizes}
                  selectedSizes={selectedSizes}
                  onToggleSize={handleToggleSize}
                  grinds={availableGrinds}
                  selectedGrinds={selectedGrinds}
                  onToggleGrind={handleToggleGrind}
                  grades={availableGrades}
                  selectedGrades={selectedGrades}
                  onToggleGrade={handleToggleGrade}
                />
              </React.Suspense>
            </aside>

            <div>
              {selectedCategory !== 'All' && (
                <div className="mb-4">
                  <Breadcrumbs
                    items={[
                      {
                        label: 'Home',
                        onClick: () => setSelectedCategory('All'),
                      },
                      { label: selectedCategory },
                    ]}
                  />
                </div>
              )}
              <div className="flex flex-wrap gap-4 justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
                <p className="text-gray-600 font-medium whitespace-nowrap hidden sm:block">
                  Showing {finalFilteredProducts.length} results
                </p>

                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="md:hidden flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-lg font-medium text-neutral-700 hover:bg-neutral-200 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                  Filters
                </button>

                <SortDropdown
                  currentSort={sortOrder}
                  onSortChange={(val) =>
                    setSortOrder(val as 'name' | 'price-asc' | 'price-desc' | 'rating' | 'newest')
                  }
                />
              </div>

              {/* Active Filters Display */}
              {(selectedCategory !== 'All' || searchQuery || selectedTags.length > 0) && (
                <div className="flex flex-wrap gap-2 items-center mb-4">
                  {selectedCategory !== 'All' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-medium">
                      {selectedCategory}
                      <button
                        onClick={() => setSelectedCategory('All')}
                        className="hover:text-brand-dark ml-1"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              )}

              <ProductGrid
                products={products}
                onAddToCart={handleAddToCartWithTracking}
                onToggleWishlist={handleToggleWishlist}
                comparisonIds={comparisonIds}
                isLoading={productsLoading}
                onNotifyMe={handleNotifyMe}
                onSelectProduct={setSelectedProduct}
                onClearFilters={handleClearFilters}
                enableFilters
                title="Our Premium Collection"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Module */}
      <section
        data-testid="quiz-section"
        id="quiz-section"
        className="bg-brand-secondary/5 py-20 mt-0"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <React.Suspense fallback={null}>
            <QuizModule addToast={addToast} />
          </React.Suspense>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
