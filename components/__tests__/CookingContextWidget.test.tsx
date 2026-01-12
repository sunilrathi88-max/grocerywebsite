import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CookingContextWidget from '../CookingContextWidget';

describe('CookingContextWidget', () => {
  const mockOnAddBundleToCart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the widget title and description', () => {
    render(<CookingContextWidget />);
    expect(screen.getByText(/Cook What You're Craving Today/i)).toBeInTheDocument();
    // Use distinct part of the description
    expect(screen.getByText(/exclusive bundle discounts/i)).toBeInTheDocument();
  });

  it('renders all cooking options', () => {
    render(<CookingContextWidget />);
    expect(screen.getByText('Making Dal?')).toBeInTheDocument();
    expect(screen.getByText('Making Chai?')).toBeInTheDocument();
    expect(screen.getByText('Making Curry?')).toBeInTheDocument();
    expect(screen.getByText('Biryani Night?')).toBeInTheDocument();
  });

  it('displays the kit details when an option is selected', () => {
    render(<CookingContextWidget />);

    // Click on "Making Dal?"
    fireEvent.click(screen.getByText('Making Dal?'));

    // Check if Dal kit details appear
    expect(screen.getByText('Complete Dal Tadka Kit')).toBeInTheDocument();
    expect(screen.getByText('Turmeric Powder')).toBeInTheDocument();
    expect(screen.getByText('Cumin Seeds')).toBeInTheDocument();
  });

  it('calls onAddBundleToCart when "Add Complete Kit" is clicked', () => {
    render(<CookingContextWidget onAddBundleToCart={mockOnAddBundleToCart} />);

    // Select a kit first
    fireEvent.click(screen.getByText('Making Chai?'));

    // Click add to cart
    const addButton = screen.getByText('Add Complete Kit to Cart');
    fireEvent.click(addButton);

    expect(mockOnAddBundleToCart).toHaveBeenCalledTimes(1);
    // Verify it was called with the Chai kit
    expect(mockOnAddBundleToCart).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'chai',
        name: "Chai Lover's Pack",
      })
    );
  });

  it('toggles selection off when clicking the same option again', () => {
    render(<CookingContextWidget />);

    const dalOption = screen.getByText('Making Dal?');

    // Select
    fireEvent.click(dalOption);
    expect(screen.getByText('Complete Dal Tadka Kit')).toBeInTheDocument();

    // Deselect
    fireEvent.click(dalOption);
    expect(screen.queryByText('Complete Dal Tadka Kit')).not.toBeInTheDocument();
    // Use the empty state hint specific text
    expect(screen.getByText(/perfect spice kit!/i)).toBeInTheDocument();
  });
});
