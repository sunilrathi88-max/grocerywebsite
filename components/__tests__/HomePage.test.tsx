/* eslint-disable react/display-name, @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../../pages/HomePage';
import { Product } from '../../types';

// Mock dependencies
jest.mock('../../src/context/ABTestContext', () => ({
  useABTest: () => ({ variant: 'control', trackConversion: jest.fn() }),
}));

jest.mock('../HeroCarousel', () => () => <div data-testid="hero-carousel" />);
jest.mock('../WhyChooseUs', () => () => <div data-testid="why-choose-us" />);
jest.mock('../ShopByCategory', () => () => <div data-testid="shop-by-category" />);
jest.mock('../ShopByUseCase', () => () => <div data-testid="shop-by-use-case" />);
jest.mock('../BrandStory', () => () => <div data-testid="brand-story" />);
jest.mock('../BlogStrip', () => () => <div data-testid="blog-strip" />);
jest.mock('../FAQPreview', () => () => <div data-testid="faq-preview" />);
jest.mock('../Newsletter', () => () => <div data-testid="newsletter" />);
jest.mock('../ProductGrid', () => () => <div data-testid="product-grid" />);
jest.mock('../TrustBadges', () => ({ TrustBadges: () => <div data-testid="trust-badges" /> }));
jest.mock('../LoyaltyWidget', () => () => <div data-testid="loyalty-widget" />);
jest.mock('../RecentlyViewed', () => () => <div data-testid="recently-viewed" />);

// Mock Verified Components with Props Inspection
jest.mock('../FeaturedCollection', () => ({ title, products }: any) => (
  <div data-testid={`featured-collection-${title}`}>
    {title} ({products.length} products)
    {products.map((p: any) => p.name).join(', ')}
  </div>
));

jest.mock('../CookingContextWidget', () => () => <div data-testid="cooking-context-widget" />);

describe('HomePage UX Redesign Verification', () => {
  // Create sample products including the IDs we care about: 4, 12, 29, 28
  // and some extras
  const mockProducts: Product[] = [
    { id: 4, name: 'Target Spices 1', variants: [] } as any,
    { id: 12, name: 'Target Spices 2', variants: [] } as any,
    { id: 29, name: 'Target Spices 3', variants: [] } as any,
    { id: 28, name: 'Target Spices 4', variants: [] } as any,
    { id: 99, name: 'Other Spice', variants: [] } as any,
  ];

  const defaultProps = {
    products: mockProducts,
    selectedCategory: 'All',
    setSelectedCategory: jest.fn(),
    searchQuery: '',
    selectedTags: [],
    finalFilteredProducts: mockProducts,
    productsLoading: false,
    wishlistedIds: new Set([4]),
    comparisonIds: new Set(),
    handleAddToCart: jest.fn(),
    handleToggleWishlist: jest.fn(),
    setSelectedProduct: jest.fn(),
    handleNotifyMe: jest.fn(),
    handleToggleCompare: jest.fn(),
    handleClearFilters: jest.fn(),
    setIsFilterOpen: jest.fn(),
    setSortOrder: jest.fn(),
    sortOrder: 'name',
    showOnSale: false,
    setShowOnSale: jest.fn(),
    showInStock: true,
    setShowInStock: jest.fn(),
    availableTags: [],
    selectedTagsState: [],
    handleToggleTag: jest.fn(),
    priceRange: { min: 0, max: 1000 },
    setPriceRange: jest.fn(),
    maxPrice: 1000,
    selectedOrigins: [],
    handleToggleOrigin: jest.fn(),
    availableOrigins: [],
    selectedHeatLevels: [],
    handleToggleHeatLevel: jest.fn(),
    availableHeatLevels: [],
    selectedCuisines: [],
    handleToggleCuisine: jest.fn(),
    availableCuisines: [],
    selectedSizes: [],
    handleToggleSize: jest.fn(),
    availableSizes: [],
    selectedGrinds: [],
    handleToggleGrind: jest.fn(),
    availableGrinds: [],
    selectedGrades: [],
    handleToggleGrade: jest.fn(),
    availableGrades: [],
    addToast: jest.fn(),
  };

  it('renders "Our Most Loved Masalas" with exactly 4 curated products', () => {
    render(<HomePage {...defaultProps} />);

    // Check if the specific FeaturedCollection is rendered with correct count
    const lovedSection = screen.getByTestId('featured-collection-Our Most Loved Masalas');
    expect(lovedSection).toHaveTextContent('Our Most Loved Masalas (4 products)');

    // Verify it doesn't include the "Other Spice" (ID 99)
    expect(lovedSection).toHaveTextContent('Target Spices 1');
    expect(lovedSection).not.toHaveTextContent('Other Spice');
  });

  it('renders the "Cook What You\'re Craving" widget', () => {
    render(<HomePage {...defaultProps} />);
    expect(screen.getByTestId('cooking-context-widget')).toBeInTheDocument();
  });
});
