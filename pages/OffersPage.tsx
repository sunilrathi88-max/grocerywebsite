import React, { useState, useMemo, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useProductFilter, usePriceRange } from '../hooks/useProductFilter';
import ProductGrid from '../components/ProductGrid';
import SortDropdown from '../components/SortDropdown';
import AdvancedFilters from '../components/AdvancedFilters';
import { useCartStore } from '../store/cartStore';
import { useWishlist } from '../hooks/useWishlist';
import { Product, Variant } from '../types';
import CountdownTimer from '../components/CountdownTimer';
import SideModal from '../components/SideModal';
import { useIsMobile } from '../hooks/useIsMobile';

const OffersPage: React.FC = () => {
  const { products, isLoading: productsLoading } = useProducts();
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist } = useWishlist();
  const isMobile = useIsMobile();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // State
  const [sortOrder, setSortOrder] = useState<
    'name' | 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'popular'
  >('popular');
  const [showOnSale, setShowOnSale] = useState(true);
  const [showInStock, setShowInStock] = useState(false);
  const [selectedCategory] = useState('All');
  const [searchQuery] = useState('');

  // Filter States
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [selectedHeatLevels, setSelectedHeatLevels] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedGrinds, setSelectedGrinds] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);

  // Derived Data
  const [minPrice, maxPrice] = usePriceRange(products);

  useEffect(() => {
    if (products.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPriceRange([minPrice, maxPrice]);
    }
  }, [products, minPrice, maxPrice]);

  const availableTags = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.tags || []))),
    [products]
  );
  const availableOrigins = useMemo(
    () => Array.from(new Set(products.map((p) => p.origin).filter((o): o is string => !!o))),
    [products]
  );
  const availableHeatLevels = useMemo(
    () => availableTags.filter((t) => ['Mild', 'Medium', 'Hot', 'Extra Hot'].includes(t)),
    [availableTags]
  );
  const availableCuisines = useMemo(
    () =>
      availableTags.filter((t) =>
        ['North Indian', 'South Indian', 'Mughlai', 'Bengali'].includes(t)
      ),
    [availableTags]
  );
  const availableSizes = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.variants.map((v) => v.name)))),
    [products]
  );
  const availableGrinds = useMemo(
    () => Array.from(new Set(products.map((p) => p.grind).filter((g): g is string => !!g))),
    [products]
  );
  const availableGrades = useMemo(
    () => Array.from(new Set(products.map((p) => p.grade).filter((g): g is string => !!g))),
    [products]
  );

  const handleToggleTag = (tag: string) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  const handleToggleOrigin = (origin: string) =>
    setSelectedOrigins((prev) =>
      prev.includes(origin) ? prev.filter((o) => o !== origin) : [...prev, origin]
    );
  const handleToggleHeatLevel = (level: string) =>
    setSelectedHeatLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  const handleToggleCuisine = (cuisine: string) =>
    setSelectedCuisines((prev) =>
      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    );
  const handleToggleSize = (size: string) =>
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  const handleToggleGrind = (grind: string) =>
    setSelectedGrinds((prev) =>
      prev.includes(grind) ? prev.filter((g) => g !== grind) : [...prev, grind]
    );
  const handleToggleGrade = (grade: string) =>
    setSelectedGrades((prev) =>
      prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]
    );

  const handleClearFilters = () => {
    setSelectedTags([]);
    setSelectedOrigins([]);
    setSelectedHeatLevels([]);
    setSelectedCuisines([]);
    setSelectedSizes([]);
    setSelectedGrinds([]);
    setSelectedGrades([]);
    setPriceRange([minPrice, maxPrice]);
    setShowOnSale(true);
    setShowInStock(false);
    setSortOrder('popular');
  };

  const { filteredProducts } = useProductFilter(products, {
    category: selectedCategory,
    searchQuery,
    priceRange,
    sortBy: sortOrder,
    inStockOnly: showInStock,
    showOnSale,
    tags: [...selectedTags],
    origin: selectedOrigins,
    size: selectedSizes,
    grind: selectedGrinds,
    grade: selectedGrades,
    heatLevel: selectedHeatLevels,
    cuisine: selectedCuisines,
  });

  const handleAddToCart = (product: Product, variant: Variant) => {
    addItem({
      id: `${product.id}-${variant.name}`,
      name: product.name,
      price: variant.salePrice || variant.price,
      quantity: 1,
      weight: variant.name,
      image: product.images[0],
      stock: variant.stock,
    });
  };

  const handleToggleWishlistFn = (product: Product) => {
    toggleWishlist(product);
  };

  // Calculate end of sale (7 days from now)
  const saleEndDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    date.setHours(23, 59, 59, 999);
    return date;
  }, []);

  return (
    <>
      {/* Sale Countdown */}
      <CountdownTimer endDate={saleEndDate} label="Limited Time Sale Ends In" />

      <div className="bg-brand-primary/10 py-12 mb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark mb-4">
            Special Offers
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Exclusive deals on our premium spices and ingredients. Limited time only.
          </p>
        </div>
      </div>

      <div
        id="products-section"
        className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-8 container mx-auto px-4 py-8"
      >
        {/* Mobile Filter Button */}
        {isMobile && (
          <div className="col-span-1 mb-4">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-2.5 rounded-lg text-sm font-bold text-gray-700 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              Filters & Sort
            </button>
          </div>
        )}

        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside className="sticky top-24 h-fit">
            <AdvancedFilters
              showOnSale={showOnSale}
              onToggleOnSale={() => setShowOnSale(!showOnSale)}
              showInStock={showInStock}
              onToggleInStock={() => setShowInStock(!showInStock)}
              availableTags={availableTags}
              selectedTags={selectedTags}
              onToggleTag={handleToggleTag}
              priceRange={{ min: priceRange[0], max: priceRange[1] }}
              maxPrice={maxPrice}
              onPriceChange={(max) => setPriceRange((prev) => [prev[0], max])}
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
          </aside>
        )}

        {/* Mobile Sidebar Modal */}
        {isMobile && (
          <SideModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} title="Filters">
            <div className="p-4 pb-20">
              <AdvancedFilters
                showOnSale={showOnSale}
                onToggleOnSale={() => setShowOnSale(!showOnSale)}
                showInStock={showInStock}
                onToggleInStock={() => setShowInStock(!showInStock)}
                availableTags={availableTags}
                selectedTags={selectedTags}
                onToggleTag={handleToggleTag}
                priceRange={{ min: priceRange[0], max: priceRange[1] }}
                maxPrice={maxPrice}
                onPriceChange={(max) => setPriceRange((prev) => [prev[0], max])}
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
              <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
                <button
                  onClick={handleClearFilters}
                  className="flex-1 py-3 bg-gray-100 text-gray-800 font-bold rounded-lg"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 py-3 bg-brand-primary text-white font-bold rounded-lg"
                >
                  Show Results
                </button>
              </div>
            </div>
          </SideModal>
        )}

        <div className="min-w-0">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600 font-medium">Showing {filteredProducts.length} deals</p>
            <SortDropdown
              currentSort={sortOrder}
              onSortChange={(val) =>
                setSortOrder(
                  val as 'name' | 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'popular'
                )
              }
            />
          </div>

          <ProductGrid
            products={filteredProducts}
            isLoading={productsLoading}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlistFn}
            comparisonIds={new Set<number>()}
            onNotifyMe={() => {}}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>
    </>
  );
};

export default OffersPage;
