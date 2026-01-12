import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCartStore } from '../store/cartStore';
import { useWishlist } from '../hooks/useWishlist';
import { Product, Variant, ToastMessage } from '../types';
import {
  MobileSearchHeader,
  MobileFilterChips,
  MobileProductGrid,
  MobileSortFilterFAB,
  MobileBottomNavMinimal,
  FilterChip,
} from '../components/mobile';

interface MobileCategoryPageProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  cartItemCount?: number;
  onCartClick?: () => void;
  onMenuClick?: () => void;
  addToast?: (msg: string, type: ToastMessage['type']) => void;
  selectedProduct?: Product | null;
  setSelectedProduct?: (product: Product | null) => void;
}

const MobileCategoryPage: React.FC<MobileCategoryPageProps> = ({
  searchQuery: externalSearchQuery,
  onSearchChange: externalOnSearchChange,
  cartItemCount: externalCartCount,
  onCartClick,
  addToast,
  setSelectedProduct,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { products } = useProducts({ useMockData: true });
  const { wishlistItems, toggleWishlist } = useWishlist();
  const addToCart = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);

  // Local state
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery || '');
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [sortModalOpen, setSortModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc' | 'newest'>(
    'popularity'
  );

  const cartItemCount =
    externalCartCount ?? cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistedIds = useMemo(() => new Set(wishlistItems.map((p) => p.id)), [wishlistItems]);

  // Search handler
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    externalOnSearchChange?.(query);
  };

  // Filter chips data
  const filterChips: FilterChip[] = [
    { id: 'organic', label: 'Organic', isActive: activeFilters.has('organic') },
    { id: 'powder', label: 'Powder', isActive: activeFilters.has('powder') },
    { id: 'whole', label: 'Whole', isActive: activeFilters.has('whole') },
    { id: 'bestseller', label: 'Bestseller', isActive: activeFilters.has('bestseller') },
    { id: 'sale', label: 'On Sale', isActive: activeFilters.has('sale') },
  ];

  const handleChipClick = (chipId: string) => {
    setActiveFilters((prev) => {
      const newFilters = new Set(prev);
      if (newFilters.has(chipId)) {
        newFilters.delete(chipId);
      } else {
        newFilters.add(chipId);
      }
      return newFilters;
    });
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.tags?.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Tag filters
    if (activeFilters.size > 0) {
      result = result.filter((p) => {
        const tags = p.tags || [];
        return Array.from(activeFilters).some(
          (filter) =>
            tags.includes(filter) ||
            p.category.toLowerCase().includes(filter) ||
            (filter === 'sale' && p.variants[0]?.salePrice)
        );
      });
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort(
          (a, b) =>
            (a.variants[0]?.salePrice || a.variants[0]?.price || 0) -
            (b.variants[0]?.salePrice || b.variants[0]?.price || 0)
        );
        break;
      case 'price-desc':
        result = [...result].sort(
          (a, b) =>
            (b.variants[0]?.salePrice || b.variants[0]?.price || 0) -
            (a.variants[0]?.salePrice || a.variants[0]?.price || 0)
        );
        break;
      case 'newest':
        // Assume higher ID = newer
        result = [...result].sort((a, b) => b.id - a.id);
        break;
      default:
        // Popularity - by rating
        result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [products, searchQuery, activeFilters, sortBy]);

  // Handlers
  const handleAddToCart = useCallback(
    (product: Product, variant: Variant) => {
      addToCart({
        id: `${product.id}-${variant.name}`,
        name: product.name,
        price: variant.salePrice || variant.price,
        quantity: 1,
        weight: variant.name,
        image: product.images[0],
        stock: variant.stock,
      });
      addToast?.(`${product.name} added to cart!`, 'success');
    },
    [addToCart, addToast]
  );

  const handleToggleWishlist = useCallback(
    (product: Product) => {
      toggleWishlist(product);
    },
    [toggleWishlist]
  );

  const handleSelectProduct = useCallback(
    (product: Product) => {
      if (setSelectedProduct) {
        setSelectedProduct(product);
      } else {
        navigate(`/product/${product.id}`);
      }
    },
    [setSelectedProduct, navigate]
  );

  const getSortLabel = () => {
    switch (sortBy) {
      case 'price-asc':
        return 'Price: Low to High';
      case 'price-desc':
        return 'Price: High to Low';
      case 'newest':
        return 'Newest';
      default:
        return 'Popularity';
    }
  };

  const handleSortClick = () => {
    // Cycle through sort options
    const options: (typeof sortBy)[] = ['popularity', 'price-asc', 'price-desc', 'newest'];
    const currentIndex = options.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % options.length;
    setSortBy(options[nextIndex]);
  };

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-stone-900 pb-24">
      {/* Search Header */}
      <MobileSearchHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClearSearch={() => handleSearchChange('')}
        onBack={() => navigate(-1)}
        onCartClick={onCartClick || (() => navigate('/cart'))}
        cartItemCount={cartItemCount}
        placeholder="Search for spices, masalas..."
      />

      {/* Filter Chips */}
      <MobileFilterChips chips={filterChips} onChipClick={handleChipClick} />

      {/* Product Grid */}
      <MobileProductGrid
        products={filteredProducts}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        onSelectProduct={handleSelectProduct}
        wishlistedIds={wishlistedIds}
        resultCount={filteredProducts.length}
        sortLabel={getSortLabel()}
        onSortClick={handleSortClick}
      />

      {/* Floating Sort/Filter Button */}
      <MobileSortFilterFAB onPress={handleSortClick} />

      {/* Bottom Navigation */}
      <MobileBottomNavMinimal currentPath={location.pathname} />
    </div>
  );
};

export default MobileCategoryPage;
