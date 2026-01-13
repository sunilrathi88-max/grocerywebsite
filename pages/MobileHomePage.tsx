import React from 'react';
import { Product, Variant, ToastMessage } from '../types';
import { useNavigate } from 'react-router-dom';
import {
  MobileHeader,
  MobileHero,
  MobileTrustBar,
  MobileFeaturedSection,
  MobileCookingWidget,
} from '../components/mobile';

interface MobileHomePageProps {
  products: Product[];
  wishlistedIds: Set<number>;
  cartItemCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  handleAddToCart: (product: Product, variant: Variant, quantity?: number) => void;
  handleToggleWishlist: (product: Product) => void;
  setSelectedProduct: (product: Product | null) => void;
  onCartClick: () => void;
  addToast: (msg: string, type: ToastMessage['type']) => void;
}

const MobileHomePage: React.FC<MobileHomePageProps> = ({
  products,
  wishlistedIds,
  cartItemCount,
  searchQuery,
  onSearchChange,
  handleAddToCart,
  handleToggleWishlist,
  setSelectedProduct: _setSelectedProduct,
  onCartClick,
  addToast: _addToast,
}) => {
  const navigate = useNavigate();

  // Get most loved products (IDs 4, 12, 29, 28)
  const mostLovedProducts = products.filter((p) => [4, 12, 29, 28].includes(p.id));

  // Hero image - use first product image or fallback
  const heroImage = products[0]?.images[0] || '/images/hero-spices.jpg';

  // Handle cooking option selection
  const handleCookingOption = (optionId: string) => {
    const kitNames: Record<string, string> = {
      dal: 'Dal Tadka',
      chai: 'Masala Chai',
      curry: 'Curry Masala',
      biryani: 'Biryani Masala',
    };

    // Navigate to shop with search query
    const kitName = kitNames[optionId] || 'Spice Kit';
    navigate(`/shop?search=${encodeURIComponent(kitName)}`);
  };

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-stone-900 pb-24">
      {/* Header */}
      <MobileHeader
        cartItemCount={cartItemCount}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onCartClick={onCartClick}
      />

      {/* Hero Section */}
      <MobileHero
        badge="New Harvest"
        title="Authentic Spices,"
        subtitle="Delivered Daily"
        description="Freshly ground masalas brought straight from the farm to your pantry."
        ctaText="Shop Now"
        ctaAction={() => navigate('/shop')}
        imageUrl={heroImage}
        imageAlt="Fresh spices display"
      />

      {/* Trust Badges */}
      <MobileTrustBar />

      {/* Most Loved Products */}
      <MobileFeaturedSection
        title="Most Loved Masalas"
        products={mostLovedProducts}
        onAddToCart={(product, variant) => handleAddToCart(product, variant, 1)}
        onToggleWishlist={handleToggleWishlist}
        onSelectProduct={(product) => navigate(`/product/${product.id}`)}
        wishlistedIds={wishlistedIds}
        onViewAll={() => navigate('/shop')}
      />

      {/* Cook Your Cravings */}
      <MobileCookingWidget onSelectOption={handleCookingOption} />

      {/* Shop All Button */}
      <div className="px-4 py-8 mb-20 text-center">
        <button
          onClick={() => navigate('/shop')}
          className="w-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-stone-800 transition-colors"
        >
          Shop All Products
        </button>
      </div>
    </div>
  );
};

export default MobileHomePage;
