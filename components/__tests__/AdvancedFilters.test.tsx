import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdvancedFilters from '../AdvancedFilters';

describe('AdvancedFilters', () => {
  const mockToggleTag = jest.fn();
  const mockToggleOrigin = jest.fn();
  const mockToggleHeatLevel = jest.fn();
  // ... other mocks as needed

  const defaultProps = {
    showOnSale: false,
    onToggleOnSale: jest.fn(),
    showInStock: true,
    onToggleInStock: jest.fn(),
    availableTags: ['Tag1', 'Tag2'],
    selectedTags: [],
    onToggleTag: mockToggleTag,
    priceRange: { min: 0, max: 1000 },
    maxPrice: 1000,
    onPriceChange: jest.fn(),
    origins: ['India'],
    selectedOrigins: [],
    onToggleOrigin: mockToggleOrigin,
    heatLevels: ['mild', 'hot'],
    selectedHeatLevels: [],
    onToggleHeatLevel: mockToggleHeatLevel,
    cuisines: ['North Indian', 'South Indian'],
    selectedCuisines: [],
    onToggleCuisine: jest.fn(),
    sizes: ['100g', '500g'],
    selectedSizes: [],
    onToggleSize: jest.fn(),
    grinds: ['Whole', 'Powder'],
    selectedGrinds: [],
    onToggleGrind: jest.fn(),
    grades: ['Premium', 'Standard'],
    selectedGrades: [],
    onToggleGrade: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders essential filters in Beginner mode by default', () => {
    render(<AdvancedFilters {...defaultProps} />);

    // Quick filters should be visible
    expect(screen.getByText(/On Sale/i)).toBeInTheDocument();

    // Origin and Heat Level are essential
    expect(screen.getByText('Origin')).toBeInTheDocument();
    expect(screen.getByText('India')).toBeInTheDocument();

    // Advanced filters should NOT be visible
    // Categories (Tags) is marked advanced
    expect(screen.queryByText('Categories')).not.toBeInTheDocument();
    expect(screen.queryByText('Tag1')).not.toBeInTheDocument();

    // Cuisine is advanced
    expect(screen.queryByText('Cuisine')).not.toBeInTheDocument();
  });

  it('reveals advanced filters when switching to Advanced mode', () => {
    render(<AdvancedFilters {...defaultProps} />);

    const advancedButton = screen.getByRole('button', { name: /Advanced/i });
    fireEvent.click(advancedButton);

    // Now Categories/Tags should be visible
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Tag1')).toBeInTheDocument();

    // Cuisine should be visible
    expect(screen.getByText('Cuisine')).toBeInTheDocument();
    expect(screen.getByText('North Indian')).toBeInTheDocument();
  });

  it('collapses sections when header is clicked', () => {
    render(<AdvancedFilters {...defaultProps} />);

    const headerButton = screen.getByRole('button', { name: /Filters/i, expanded: true });
    expect(headerButton).toBeInTheDocument();

    // Content should be visible (opacity 1, max-h-[600px])
    // Hard to test CSS transitions in JSDOM, but we can check the aria-expanded attribute
    fireEvent.click(headerButton);
    expect(headerButton).toHaveAttribute('aria-expanded', 'false');
  });
});
