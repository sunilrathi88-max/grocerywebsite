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

// Mock all child components used by current HomePage
jest.mock('../Hero', () => () => <div data-testid="hero" />);
jest.mock('../ui/MarqueeStrip', () => () => <div data-testid="marquee-strip" />);
jest.mock('../ui/PhilosophySection', () => () => <div data-testid="philosophy-section" />);
jest.mock('../ui/PinnedProcessSection', () => () => <div data-testid="pinned-process" />);
jest.mock('../TrustSignals', () => () => <div data-testid="trust-signals" />);
jest.mock('../HarvestCollection', () => () => <div data-testid="harvest-collection" />);
jest.mock('../ProductGrid', () => () => <div data-testid="product-grid" />);
jest.mock('../SortDropdown', () => () => <div data-testid="sort-dropdown" />);
jest.mock('../AdvancedFilters', () => () => <div data-testid="advanced-filters" />);
jest.mock('../Testimonials', () => () => <div data-testid="testimonials" />);
jest.mock('../QuizModule', () => () => <div data-testid="quiz-module" />);
jest.mock('../CookingContextWidget', () => () => <div data-testid="cooking-context" />);
jest.mock('../BlogHighlights', () => () => <div data-testid="blog-highlights" />);
jest.mock('../NewsletterSection', () => () => <div data-testid="newsletter" />);
jest.mock('../RecommendedProducts', () => () => <div data-testid="recommended-products" />);
jest.mock('../SEO', () => () => null);
jest.mock('../../utils/seo', () => ({
  pageSEO: { home: () => ({ title: 'Test', description: 'Test' }) },
  generateOrganizationSchema: jest.fn(() => ({})),
  generateWebsiteSchema: jest.fn(() => ({})),
}));
jest.mock('../../data/testimonials', () => ({
  FEATURED_TESTIMONIALS: [],
}));
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: Object.assign(jest.fn(), {
    success: jest.fn(),
    error: jest.fn(),
  }),
}));

describe('HomePage UX Redesign Verification', () => {
  const mockProducts: Product[] = [
    { id: 4, name: 'Target Spices 1', variants: [] } as any,
    { id: 12, name: 'Target Spices 2', variants: [] } as any,
    { id: 29, name: 'Target Spices 3', variants: [] } as any,
    { id: 28, name: 'Target Spices 4', variants: [] } as any,
    { id: 99, name: 'Other Spice', variants: [] } as any,
  ];

  const defaultProps = {
    products: mockProducts,
    _selectedCategory: 'All',
    _setSelectedCategory: jest.fn(),
    _searchQuery: '',
    _selectedTags: [],
    finalFilteredProducts: mockProducts,
    productsLoading: false,
    _wishlistedIds: new Set<number>([4]),
    _comparisonIds: new Set<number>(),
    handleAddToCart: jest.fn(),
    handleToggleWishlist: jest.fn(),
    setSelectedProduct: jest.fn(),
    handleNotifyMe: jest.fn(),
    handleToggleCompare: jest.fn(),
    _handleClearFilters: jest.fn(),
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
    _addToast: jest.fn(),
  };

  it('renders the harvest collection sections', async () => {
    render(
      <React.Suspense fallback={<div>Loading...</div>}>
        <HomePage {...defaultProps} />
      </React.Suspense>
    );
    const collections = await screen.findAllByTestId('harvest-collection');
    expect(collections.length).toBe(2); // Best Sellers + New Arrivals
  });

  it('renders core page sections', async () => {
    render(
      <React.Suspense fallback={<div>Loading...</div>}>
        <HomePage {...defaultProps} />
      </React.Suspense>
    );
    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(await screen.findByTestId('trust-signals')).toBeInTheDocument();
    expect(await screen.findByTestId('testimonials')).toBeInTheDocument();
    expect(await screen.findByTestId('newsletter')).toBeInTheDocument();
  });
});
