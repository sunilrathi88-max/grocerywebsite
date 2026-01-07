import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductCard from '../ProductCard';
import { BrowserRouter } from 'react-router-dom';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('ProductCard', () => {
  // Mock functions
  const mockOnAddToCart = jest.fn();
  const mockOnWishlist = jest.fn();

  // Mock product data props
  const defaultProps = {
    id: '1',
    name: 'Premium Saffron',
    price: 249,
    originalPrice: 299,
    image: '/images/products/saffron-1.svg',
    rating: 5,
    reviewCount: 2,
    heatLevel: 'mild' as const,
    useCase: 'Spices',
    sizes: [{ size: '100g', price: 249 }],
    onAddToCart: mockOnAddToCart,
    onWishlist: mockOnWishlist,
  };

  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render product card with basic information', () => {
      renderWithRouter(<ProductCard {...defaultProps} />);

      expect(screen.getByText('Premium Saffron')).toBeInTheDocument();
      expect(screen.getByAltText('Premium Saffron')).toBeInTheDocument();
      expect(screen.getByText('₹249')).toBeInTheDocument();
      expect(screen.getByText('₹299')).toBeInTheDocument();
    });

    it('should render product image with correct src', () => {
      renderWithRouter(<ProductCard {...defaultProps} />);
      const image = screen.getByAltText('Premium Saffron');
      expect(image).toHaveAttribute('src', '/images/products/saffron-1.svg');
    });
  });

  describe('Badges', () => {
    it('should display NEW badge', () => {
      renderWithRouter(<ProductCard {...defaultProps} badge="new" />);
      expect(screen.getByText('NEW')).toBeInTheDocument();
    });

    it('should display DISCOUNT badge', () => {
      renderWithRouter(<ProductCard {...defaultProps} badge="discount" />);
      expect(screen.getByText(/OFF/)).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onAddToCart when Add button is clicked', () => {
      renderWithRouter(<ProductCard {...defaultProps} />);

      const addButton = screen.getByText('Add to Cart');
      fireEvent.click(addButton);

      expect(mockOnAddToCart).toHaveBeenCalledWith('1');
    });

    it('should call onWishlist when wishlist button is clicked', () => {
      renderWithRouter(<ProductCard {...defaultProps} />);

      const wishlistButton = screen.getByText(/Wishlist/);
      fireEvent.click(wishlistButton);

      expect(mockOnWishlist).toHaveBeenCalledWith('1');
    });
  });
});
