import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useSearchParams, Navigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useProductFilter, FilterOptions } from '../hooks/useProductFilter';
import { FilterSidebar } from '../components/FilterSidebar';
import { UniversalProductCard } from '../components/UniversalProductCard';
import { Pagination } from '../components/Pagination';
import { useCartStore } from '../store/cartStore';
import { useWishlist } from '../hooks/useWishlist';
import { Product, Variant } from '../types';
import { ChevronRight, SlidersHorizontal, PackageOpen } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

const CollectionsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, isLoading, error } = useProducts({ useMockData: true });
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlist();

  // State Management
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get('sort') as SortOption) || 'popular'
  );

  const displayTitle = useMemo(() => {
    if (!slug || slug === 'all') return 'Shop All Spices';
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, [slug]);

  const filterOptions: FilterOptions = useMemo(
    () => ({
      category: !slug || slug === 'all' ? 'All' : displayTitle,
      sortBy: sortBy,
      searchQuery: '',
    }),
    [slug, displayTitle, sortBy]
  );

  const { filteredProducts, productCount } = useProductFilter(products, filterOptions);

  const totalPages = Math.ceil(productCount / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleAddToCart = (product: Product) => {
    const variant = product.variants[0];
    addItem({
      id: `${product.id}-${variant.name}`,
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      price: variant.salePrice || variant.price,
      quantity: 1,
      weight: variant.name,
      image: product.images[0],
      stock: variant.stock,
    });
  };

  const filterGroups = [
    {
      id: 'heatLevel',
      title: 'Heat Level',
      type: 'checkbox' as const,
      options: [
        { id: 'Mild', label: 'Mild' },
        { id: 'Medium', label: 'Medium' },
        { id: 'Hot', label: 'Hot' },
      ],
    },
    {
      id: 'price',
      title: 'Price Range',
      type: 'slider' as const,
      minValue: 0,
      maxValue: 2000,
    },
  ];

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Premium Breadcrumb Header */}
      <div className="bg-white border-b border-stone-100 py-12">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 mb-4">
            <Link to="/" className="hover:text-brand-primary transition-colors">
              Home
            </Link>
            <ChevronRight size={10} />
            <Link to="/collections/all" className="hover:text-brand-primary transition-colors">
              Collections
            </Link>
            <ChevronRight size={10} />
            <span className="text-stone-900">{displayTitle}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-serif font-black text-[#42210B] leading-tight">
                {displayTitle}
              </h1>
              <p className="text-stone-500 font-medium">
                Discover our hand-picked selection of premium results ({productCount} products)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                Sort By
              </span>
              <select
                className="bg-stone-50 border-none rounded-xl text-xs font-bold text-stone-900 px-4 py-2.5 focus:ring-2 focus:ring-brand-primary/20 cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <option value="popular">Most Popular</option>
                <option value="newest">New Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-24 space-y-8">
              <div className="flex items-center justify-between lg:hidden mb-4">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl shadow-sm border border-stone-100 font-bold text-xs uppercase tracking-widest text-[#42210B]"
                >
                  <SlidersHorizontal size={14} /> Filters
                </button>
              </div>

              <div className="hidden lg:block">
                <FilterSidebar
                  groups={filterGroups}
                  onFilterChange={() => {}}
                  onClearAll={() => {}}
                />
              </div>
            </div>
          </aside>

          {/* Result Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white rounded-3xl h-[500px]" />
                ))}
              </div>
            ) : productCount > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {paginatedProducts.map((product) => (
                    <UniversalProductCard
                      key={product.id}
                      id={product.id.toString()}
                      name={product.name}
                      price={product.variants[0]?.salePrice || product.variants[0]?.price}
                      originalPrice={
                        product.variants[0]?.salePrice ? product.variants[0]?.price : undefined
                      }
                      image={product.images[0]}
                      rating={
                        product.reviews?.length
                          ? product.reviews.reduce((s, r) => s + r.rating, 0) /
                            product.reviews.length
                          : 4.8
                      }
                      reviewCount={product.reviews?.length || 0}
                      spiceLevel={
                        product.tags?.includes('Hot') ? 9 : product.tags?.includes('Medium') ? 6 : 3
                      }
                      useCases={product.tags?.filter((t) => ['Curries', 'Rice', 'Tea'].includes(t))}
                      onAddToCart={() => handleAddToCart(product)}
                      onToggleWishlist={() => toggleWishlist(product)}
                      isWishlisted={isInWishlist(product.id)}
                      isNew={product.isNew}
                      isBestseller={product.reviews?.length > 40}
                      isPure={true}
                      isOrganic={product.tags?.includes('Organic')}
                      weight={product.variants[0]?.name}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-16 flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-stone-100 shadow-sm text-center px-6">
                <div className="w-20 h-20 bg-stone-50 rounded-3xl flex items-center justify-center mb-6">
                  <PackageOpen size={40} className="text-stone-300" />
                </div>
                <h3 className="text-2xl font-serif font-black text-[#42210B] mb-2">
                  No items found
                </h3>
                <p className="text-stone-500 mb-8 max-w-sm">
                  We couldn&apos;t find any products in the &ldquo;{displayTitle}&rdquo; collection
                  that match your filters.
                </p>
                <Link to="/collections/all">
                  <button className="bg-brand-primary text-brand-dark px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-all">
                    Reset All Filters
                  </button>
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer Placeholder logic same as CategoryPage */}
    </div>
  );
};

export default CollectionsPage;
