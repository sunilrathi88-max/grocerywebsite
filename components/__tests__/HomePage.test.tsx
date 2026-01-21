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

jest.mock('../HeroSection', () => () => <div data-testid="hero-section" />);
jest.mock('../TrustSignals', () => () => <div data-testid="trust-signals" />);
jest.mock('../JourneyTimeline', () => () => <div data-testid="journey-timeline" />);
jest.mock('../HarvestCollection', () => () => <div data-testid="harvest-collection" />);
jest.mock('../CategoryShowcase', () => () => <div data-testid="category-showcase" />);
jest.mock('../ProductGrid', () => () => <div data-testid="product-grid" />);
jest.mock('../SortDropdown', () => () => <div data-testid="sort-dropdown" />);
jest.mock('../AdvancedFilters', () => () => <div data-testid="advanced-filters" />);

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

  it('renders the harvest collection', () => {
    render(<HomePage {...defaultProps} />);
    expect(screen.getByTestId('harvest-collection')).toBeInTheDocument();
  });
});
