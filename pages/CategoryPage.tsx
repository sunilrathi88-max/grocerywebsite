import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useProducts } from '../hooks/useProducts';
import { useProductFilter, FilterOptions } from '../hooks/useProductFilter';
import { FilterSidebar } from '../components/FilterSidebar';
import { ProductCard } from '../components/ProductCard';
import { Pagination } from '../components/Pagination';
import { useCartStore } from '../store/cartStore';
import { useWishlist } from '../hooks/useWishlist';
import { Product, Variant } from '../types';

const ITEMS_PER_PAGE = 12;

// Valid sort options
type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const displayCategory = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : 'Shop All';

  // Hooks
  const { products, isLoading, error } = useProducts({ useMockData: true });
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist } = useWishlist();

  // Parse initial state from URL
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const initialSort = (searchParams.get('sort') as SortOption) || 'popular';
  const initialHeatLevel = searchParams.get('heatLevel')?.split(',').filter(Boolean) || [];
  const initialUseCase = searchParams.get('useCase')?.split(',').filter(Boolean) || [];
  const initialRating = searchParams.get('rating')?.split(',').filter(Boolean) || [];
  const initialPriceMin = parseInt(searchParams.get('priceMin') || '0', 10);
  const initialPriceMax = parseInt(searchParams.get('priceMax') || '2000', 10);

  // State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    heatLevel: initialHeatLevel,
    useCase: initialUseCase,
    rating: initialRating,
  });
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialPriceMin,
    initialPriceMax,
  ]);

  // Sync state to URL
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();

    if (currentPage > 1) params.set('page', currentPage.toString());
    if (sortBy !== 'popular') params.set('sort', sortBy);
    if (selectedFilters.heatLevel?.length)
      params.set('heatLevel', selectedFilters.heatLevel.join(','));
    if (selectedFilters.useCase?.length) params.set('useCase', selectedFilters.useCase.join(','));
    if (selectedFilters.rating?.length) params.set('rating', selectedFilters.rating.join(','));
    if (priceRange[0] > 0) params.set('priceMin', priceRange[0].toString());
    if (priceRange[1] < 2000) params.set('priceMax', priceRange[1].toString());

    setSearchParams(params, { replace: true });
  }, [currentPage, sortBy, selectedFilters, priceRange, setSearchParams]);

  useEffect(() => {
    updateURL();
  }, [updateURL]);

  // Derived Filter Options for hook
  const filterOptions: FilterOptions = useMemo(
    () => ({
      category: category === 'shop' || !category ? 'All' : displayCategory,
      searchQuery: '',
      priceRange: priceRange,
      sortBy: sortBy,
      heatLevel: selectedFilters['heatLevel'],
      tags: selectedFilters['useCase'],
      minRating: selectedFilters['rating']?.includes('4')
        ? 4
        : selectedFilters['rating']?.includes('3')
          ? 3
          : undefined,
    }),
    [category, displayCategory, priceRange, sortBy, selectedFilters]
  );

  const { filteredProducts, productCount } = useProductFilter(products, filterOptions);

  // Pagination
  const totalPages = Math.ceil(productCount / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => setCurrentPage(1), 0);
    return () => clearTimeout(timeoutId);
  }, [selectedFilters, priceRange, sortBy]);

  const handleFilterChange = (groupId: string, values: string[]) => {
    if (groupId === 'price') {
      const [min, max] = values[0].split(',').map(Number);
      setPriceRange([min, max]);
    } else {
      setSelectedFilters((prev) => ({ ...prev, [groupId]: values }));
    }
  };

  const handleRemoveFilter = (groupId: string, valueToRemove: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [groupId]: prev[groupId]?.filter((v) => v !== valueToRemove) || [],
    }));
  };

  const handleClearAllFilters = () => {
    setSelectedFilters({});
    setPriceRange([0, 2000]);
  };

  const handleAddToCart = (product: Product, variant?: Variant) => {
    // Added variant parameter
    addItem({
      id: product.id.toString(),
      productId: product.id,
      variantId: variant?.id || product.variants[0]?.id || 0,
      name: product.name,
      price: product.variants[0]?.salePrice ?? product.variants[0]?.price,
      quantity: 1,
      image: product.images[0],
      weight: variant?.name || 'Standard',
      stock: 10,
    });
  };

  const handleWishlist = (productId: string) => {
    const product = products.find((p) => p.id.toString() === productId);
    if (product) {
      toggleWishlist(product);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Collect active filters for chips display
  const activeFilters = useMemo(() => {
    const filters: { groupId: string; label: string; value: string }[] = [];

    Object.entries(selectedFilters).forEach(([groupId, values]) => {
      values.forEach((value) => {
        const labelMap: Record<string, string> = {
          '4': '4★ & above',
          '3': '3★ & above',
        };
        filters.push({
          groupId,
          label: labelMap[value] || value,
          value,
        });
      });
    });

    if (priceRange[0] > 0 || priceRange[1] < 2000) {
      filters.push({
        groupId: 'price',
        label: `₹${priceRange[0]} – ₹${priceRange[1]}`,
        value: 'price',
      });
    }

    return filters;
  }, [selectedFilters, priceRange]);

  // Define Filter Groups
  const filterGroups = [
    {
      id: 'heatLevel',
      title: 'Heat Level',
      type: 'checkbox' as const,
      options: [
        {
          id: 'Mild',
          label: 'Mild',
          count: products.filter((p) => p.tags?.includes('Mild')).length,
        },
        {
          id: 'Medium',
          label: 'Medium',
          count: products.filter((p) => p.tags?.includes('Medium')).length,
        },
        { id: 'Hot', label: 'Hot', count: products.filter((p) => p.tags?.includes('Hot')).length },
      ],
    },
    {
      id: 'useCase',
      title: 'Use Case',
      type: 'checkbox' as const,
      options: [
        {
          id: 'Curries',
          label: 'Curries',
          count: products.filter((p) => p.tags?.includes('Curries')).length,
        },
        {
          id: 'Rice',
          label: 'Rice',
          count: products.filter((p) => p.tags?.includes('Rice')).length,
        },
        {
          id: 'Tea',
          label: 'Tea/Beverage',
          count: products.filter((p) => p.tags?.includes('Tea')).length,
        },
        {
          id: 'Tandoor',
          label: 'Tandoor',
          count: products.filter((p) => p.tags?.includes('Tandoor')).length,
        },
      ],
    },
    {
      id: 'price',
      title: 'Price Range',
      type: 'slider' as const,
      minValue: 0,
      maxValue: 2000,
    },
    {
      id: 'rating',
      title: 'Rating',
      type: 'checkbox' as const,
      options: [
        { id: '4', label: '4★ & above' },
        { id: '3', label: '3★ & above' },
      ],
    },
  ];

  return (
    <div className="bg-white dark:bg-neutral-900 min-h-screen pb-20">
      {/* Header Strip */}
      <div className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-2">
            <Link to="/" className="hover:text-brand-primary transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-neutral-900 dark:text-white font-medium">{displayCategory}</span>
          </div>
          <div className="flex items-baseline gap-4">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 dark:text-white">
              {displayCategory}
            </h1>
            <span className="text-neutral-500 dark:text-neutral-400 text-lg">
              {productCount} products
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <FilterSidebar
              groups={filterGroups}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAllFilters}
            />
          </div>

          {/* Mobile Filter Drawer */}
          <FilterSidebar
            groups={filterGroups}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAllFilters}
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
          />

          {/* Mobile Filter Backdrop */}
          {isMobileFilterOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMobileFilterOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls Toolbar */}
            <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
              <button
                className="md:hidden flex items-center gap-2 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg font-medium text-neutral-900 dark:text-white hover:border-brand-primary transition-colors"
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <span>Filters</span>
                {activeFilters.length > 0 && (
                  <span className="bg-brand-primary text-white text-xs px-2 py-0.5 rounded-full">
                    {activeFilters.length}
                  </span>
                )}
              </button>

              <p className="text-sm text-neutral-500 dark:text-neutral-400 hidden md:block">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(currentPage * ITEMS_PER_PAGE, productCount)} of {productCount}
              </p>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Sort by:</span>
                <select
                  className="border-none bg-transparent font-medium text-neutral-900 dark:text-white focus:ring-0 cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                >
                  <option value="popular">Popular</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {activeFilters.map((filter, index) => (
                  <button
                    key={`${filter.groupId}-${filter.value}-${index}`}
                    onClick={() => {
                      if (filter.groupId === 'price') {
                        setPriceRange([0, 2000]);
                      } else {
                        handleRemoveFilter(filter.groupId, filter.value);
                      }
                    }}
                    className="group flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-medium hover:bg-brand-primary/20 transition-colors"
                  >
                    <span>{filter.label}</span>
                    <XMarkIcon className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                  </button>
                ))}
                <button
                  onClick={handleClearAllFilters}
                  className="text-sm text-neutral-500 hover:text-brand-primary underline transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Product Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-neutral-100 dark:bg-neutral-800 aspect-[4/5] rounded-xl mb-4"></div>
                    <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-500">
                Failed to load products. Please try again.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id.toString()}
                      name={product.name}
                      price={product.variants[0]?.salePrice ?? product.variants[0]?.price ?? 0}
                      originalPrice={
                        product.variants[0]?.salePrice ? product.variants[0]?.price : undefined
                      }
                      image={product.images[0] || ''}
                      rating={
                        product.reviews?.length
                          ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
                          product.reviews.length
                          : 4.5
                      }
                      reviewCount={product.reviews?.length ?? 0}
                      heatLevel={
                        product.tags?.includes('Hot')
                          ? 'hot'
                          : product.tags?.includes('Medium')
                            ? 'medium'
                            : 'mild'
                      }
                      useCase={
                        product.tags?.find((t) =>
                          ['Curries', 'Rice', 'Tea', 'Tandoor', 'Desserts'].includes(t)
                        ) || 'Everyday'
                      }
                      onAddToCart={() => handleAddToCart(product)}
                      onWishlist={() => handleWishlist(product.id.toString())}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    className="mt-12"
                  />
                )}
              </>
            )}

            {/* Empty State */}
            {!isLoading && productCount === 0 && (
              <div className="text-center py-20">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                  Try adjusting your filters.
                </p>
                <button
                  onClick={handleClearAllFilters}
                  className="text-brand-primary hover:underline font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
