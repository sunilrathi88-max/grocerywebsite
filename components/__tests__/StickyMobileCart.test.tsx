/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StickyMobileCart } from '../StickyMobileCart';

// Mock OptimizedImage
jest.mock('../OptimizedImage', () => ({ OptimizedImage: () => <img alt="product" /> }));

describe('StickyMobileCart', () => {
  const defaultProps = {
    product: { id: 1, name: 'Test Product' } as any,
    price: 100,
    onAddToCart: jest.fn(),
    isVisible: true,
    image: 'test.jpg',
  };

  it('renders when visible', () => {
    render(<StickyMobileCart {...defaultProps} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('₹100')).toBeInTheDocument();
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });

  it('does not render when hidden', () => {
    render(<StickyMobileCart {...defaultProps} isVisible={false} />);
    expect(screen.queryByText('Test Product')).not.toBeInTheDocument();
  });

  it('calls onAddToCart when button clicked', () => {
    render(<StickyMobileCart {...defaultProps} />);
    fireEvent.click(screen.getByText('Add to Cart'));
    expect(defaultProps.onAddToCart).toHaveBeenCalled();
  });
});
