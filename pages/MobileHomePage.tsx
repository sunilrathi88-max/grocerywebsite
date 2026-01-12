import React from 'react';
import { Product, Variant, ToastMessage } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  MobileHeader,
  MobileHero,
  MobileTrustBar,
  MobileFeaturedSection,
  MobileCookingWidget,
  MobileValuePack,
} from '../components/mobile';
import MobileBottomNavMinimal from '../components/mobile/MobileBottomNavMinimal';

interface MobileHomePageProps {
  products: Product[];
  wishlistedIds: Set<number>;
  cartItemCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  handleAddToCart: (product: Product, variant: Variant, quantity?: number) => void;
  handleToggleWishlist: (product: Product) => void;
  setSelectedProduct: (product: Product | null) => void;
  onMenuClick: () => void;
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
  setSelectedProduct,
  onMenuClick,
  onCartClick,
  addToast,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get most loved products (IDs 4, 12, 29, 28)
  const mostLovedProducts = products.filter((p) => [4, 12, 29, 28].includes(p.id));

  // Hero image - use first product image or fallback
  const heroImage = products[0]?.images[0] || '/images/hero-spices.jpg';

  // Value pack image
  const valuePackImage = products[2]?.images[0] || '/images/masala-combo.jpg';

  // Handle cooking option selection
  const handleCookingOption = (optionId: string) => {
    const kitNames: Record<string, string> = {
      dal: 'Dal Tadka Kit',
      chai: 'Masala Chai Kit',
      curry: 'Rich Curry Kit',
      biryani: 'Biryani Masala Kit',
    };

    // Find related products and add to cart
    const kitName = kitNames[optionId] || 'Spice Kit';
    addToast(`Added ${kitName} to cart!`, 'success');
  };

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-stone-900 pb-24">
      {/* Header */}
      <MobileHeader
        cartItemCount={cartItemCount}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onMenuClick={onMenuClick}
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
        onSelectProduct={setSelectedProduct}
        wishlistedIds={wishlistedIds}
        onViewAll={() => navigate('/shop')}
      />

      {/* Cook Your Cravings */}
      <MobileCookingWidget onSelectOption={handleCookingOption} />

      {/* Value Pack Promo */}
      <MobileValuePack
        badge="Value Pack"
        title="Essential Masala Combo"
        description="The 4 basic spices every Indian kitchen needs."
        linkText="View Bundle"
        onLinkClick={() => navigate('/shop?category=combos')}
        imageUrl={valuePackImage}
      />

      {/* Bottom Navigation */}
      <MobileBottomNavMinimal currentPath={location.pathname} />
    </div>
  );
};

export default MobileHomePage;
