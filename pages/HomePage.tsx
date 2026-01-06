import React from 'react';
import { Product, Variant } from '../types';
import { HeroSection } from '../components/HeroSection';
import WhyChooseUs from '../components/WhyChooseUs';
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
  setSortOrder: (sort: string) => void;
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
  addToast: (msg: string, type: any) => void;
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
  return (
    <main>
      <HeroSection
        title="Taste the Difference."
        subtitle="Cold-ground spices from partner farms. Lab-tested for purity. Delivered fresh to your kitchen — no middlemen, no compromises."
        badges={[
          { icon: '❄️', text: 'Cold Ground Daily' },
          { icon: '🔬', text: 'Lab Tested Every Batch' },
          { icon: '🌾', text: 'Direct from Farmers' },
          { icon: '✅', text: 'FSSAI Certified' },
        ]}
        ctaPrimary={{ text: 'Shop Best Sellers', href: '#products-section' }}
        ctaSecondary={{ text: 'Take the Spice Quiz', href: '#quiz-section' }}
        heroImage="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1000&auto=format&fit=crop"
        subtext="Trusted by 10,000+ home chefs across India"
      />

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

      {/* Best Sellers */}
      <FeaturedCollection
        title="Our Most Loved Masalas"
        products={products.slice(0, 8)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        wishlistedIds={wishlistedIds}
        onSelectProduct={setSelectedProduct}
        onNotifyMe={handleNotifyMe}
        onViewAll={() => {
          setSelectedCategory('All');
          const element = document.getElementById('products-section');
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <ShopByUseCase />

      {/* New Arrivals - Different background */}
      <FeaturedCollection
        title="New Arrivals"
        products={products.slice(8, 16)}
        onAddToCart={handleAddToCart}
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
          onAddToCart={handleAddToCart}
          onSelectProduct={setSelectedProduct}
          onNotifyMe={handleNotifyMe}
        />
      </React.Suspense>

      <React.Suspense fallback={<div>Loading Testimonials...</div>}>
        <Testimonials testimonials={MOCK_TESTIMONIALS} />
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

                <SortDropdown currentSort={sortOrder} onSortChange={(val) => setSortOrder(val)} />
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
                products={finalFilteredProducts}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                isLoading={productsLoading}
                onNotifyMe={handleNotifyMe}
                onClearFilters={handleClearFilters}
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
