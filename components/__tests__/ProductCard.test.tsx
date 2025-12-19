import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductCard from '../ProductCard';
import { Product, Variant } from '../../types';

// Mock framer-motion to avoid animation issues in tests
// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  const motion = {
    div: ({ children, ...props }: React.ComponentProps<'div'> & Record<string, unknown>) => (
      <div {...props}>{children}</div>
    ),
    button: ({
      children,
      onClick,
      className,
      disabled,
      ...props
    }: React.ComponentProps<'button'> & Record<string, unknown>) => (
      <button onClick={onClick} className={className} disabled={disabled} {...props}>
        {children}
      </button>
    ),
    span: ({ children, ...props }: React.ComponentProps<'span'> & Record<string, unknown>) => (
      <span {...props}>{children}</span>
    ),
    a: ({ children, ...props }: React.ComponentProps<'a'> & Record<string, unknown>) => (
      <a {...props}>{children}</a>
    ),
    p: ({ children, ...props }: React.ComponentProps<'p'> & Record<string, unknown>) => (
      <p {...props}>{children}</p>
    ),
  };

  const AnimatePresence = ({ children }: { children: React.ReactNode }) => <>{children}</>;

  return {
    motion,
    AnimatePresence,
    useAnimation: () => ({
      start: jest.fn(),
      stop: jest.fn(),
      set: jest.fn(),
    }),
  };
});

// Mock OptimizedImage to simplify testing
jest.mock('../OptimizedImage', () => ({
  OptimizedImage: ({
    src,
    alt,
    onError,
    className,
  }: {
    src: string;
    alt: string;
    onError?: () => void;
    className?: string;
  }) => (
    <img
      src={src}
      alt={alt}
      onError={onError}
      className={className}
      data-testid="optimized-image"
    />
  ),
}));

describe('ProductCard', () => {
  // Mock functions
  const mockOnAddToCart = jest.fn();
  const mockOnToggleWishlist = jest.fn();
  const mockOnSelectProduct = jest.fn();
  const mockOnToggleCompare = jest.fn();
  const mockOnNotifyMe = jest.fn();

  // Mock product data
  const mockVariant: Variant = {
    id: 1,
    name: '100g',
    price: 299,
    salePrice: 249,
    stock: 10,
  };

  const mockProduct: Product = {
    id: 1,
    name: 'Premium Saffron',
    description: 'Finest quality saffron from Kashmir',
    category: 'Spices',
    images: ['/images/products/saffron-1.svg'],
    variants: [mockVariant],
    reviews: [
      { id: 1, author: 'John', rating: 5, comment: 'Excellent!' },
      { id: 2, author: 'Jane', rating: 4, comment: 'Good quality' },
    ],
    tags: ['organic', 'premium'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.log from ProductCard
    jest.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render product card with basic information', () => {
      render(
        <ProductCard
          product={mockProduct}
          onAddToCart={mockOnAddToCart}
          onToggleWishlist={mockOnToggleWishlist}
          isWishlisted={false}
          onSelectProduct={mockOnSelectProduct}
          onToggleCompare={mockOnToggleCompare}
          isCompared={false}
          onNotifyMe={mockOnNotifyMe}
        />
      );

      expect(screen.getByText('Premium Saffron')).toBeInTheDocument();
      expect(screen.getByAltText('Premium Saffron')).toBeInTheDocument();
    });

    it('should render product image with correct src', () => {
      render(
        <ProductCard
          product={mockProduct}
          onAddToCart={mockOnAddToCart}
          onToggleWishlist={mockOnToggleWishlist}
          isWishlisted={false}
          onSelectProduct={mockOnSelectProduct}
          onToggleCompare={mockOnToggleCompare}
          isCompared={false}
          onNotifyMe={mockOnNotifyMe}
        />
      );

      const image = screen.getByTestId('optimized-image');
      expect(image).toHaveAttribute('src', '/images/products/saffron-1.svg');
    });

    it('should use placeholder image when product images are empty', () => {
      const productNoImages = { ...mockProduct, images: [] };

      render(
        <ProductCard
          product={productNoImages}
          onAddToCart={mockOnAddToCart}
          onToggleWishlist={mockOnToggleWishlist}
          isWishlisted={false}
          onSelectProduct={mockOnSelectProduct}
          onToggleCompare={mockOnToggleCompare}
          isCompared={false}
          onNotifyMe={mockOnNotifyMe}
        />
      );

      const image = screen.getByTestId('optimized-image');
      expect(image).toHaveAttribute('src', '/images/fallbacks/product-fallback.svg');
    });
  });

  describe('Price Display', () => {
    it('should display sale price when available', () => {
      render(
        <ProductCard
          product={mockProduct}
          onAddToCart={mockOnAddToCart}
          onToggleWishlist={mockOnToggleWishlist}
          isWishlisted={false}
          onSelectProduct={mockOnSelectProduct}
          onToggleCompare={mockOnToggleCompare}
          isCompared={false}
          onNotifyMe={mockOnNotifyMe}
        />
      );

      expect(screen.getByText(/249/)).toBeInTheDocument();
      expect(screen.getByText(/299/)).toBeInTheDocument();
    });

    it('should display only regular price when no sale', () => {
      const productNoSale = {
        ...mockProduct,
        variants: [{ ...mockVariant, salePrice: undefined }],
      };

      render(
        <ProductCard
          product={productNoSale}
          onAddToCart={mockOnAddToCart}
          onToggleWishlist={mockOnToggleWishlist}
          isWishlisted={false}
          onSelectProduct={mockOnSelectProduct}
          onToggleCompare={mockOnToggleCompare}
          isCompared={false}
          onNotifyMe={mockOnNotifyMe}
        />
      );

      expect(screen.getByText(/299/)).toBeInTheDocument();
      expect(screen.queryByText(/249/)).not.toBeInTheDocument();
    });

    it('should show "From" prefix when multiple variants exist', () => {
      const productMultipleVariants = {
        ...mockProduct,
        variants: [mockVariant, { id: 2, name: '200g', price: 499, stock: 5 }],
      };

      render(
        <ProductCard
          product={productMultipleVariants}
          onAddToCart={mockOnAddToCart}
          onToggleWishlist={mockOnToggleWishlist}
          isWishlisted={false}
          onSelectProduct={mockOnSelectProduct}
          onToggleCompare={mockOnToggleCompare}
          isCompared={false}
          onNotifyMe={mockOnNotifyMe}
        />
      );

      expect(screen.getByText(/From/i)).toBeInTheDocument();
    });
  });

  describe('Badges', () => {
    it('should display SALE badge when product is on sale', () => {
      render(
        <ProductCard
          product={mockProduct}
          onAddToCart={mockOnAddToCart}
          onToggleWishlist={mockOnToggleWishlist}
          isWishlisted={false}
          onSelectProduct={mockOnSelectProduct}
          onToggleCompare={mockOnToggleCompare}
          isCompared={false}
          onNotifyMe={mockOnNotifyMe}
        />
      );

      expect(screen.getByText(/sale/i)).toBeInTheDocument();
    });

    it('should display LOW STOCK badge when stock is low', () => {
      const productLowStock = {
        ...mockProduct,
        variants: [{ ...mockVariant, stock: 3 }],
      };

      render(
        <ProductCard
          product={productLowStock}
          onAddToCart={mockOnAddToCart}
          onToggleWishlist={mockOnToggleWishlist}
          isWishlisted={false}
          onSelectProduct={mockOnSelectProduct}
          onToggleCompare={mockOnToggleCompare}
          isCompared={false}
          onNotifyMe={mockOnNotifyMe}
        />
      );

      expect(screen.getByText('Low Stock')).toBeInTheDocument();
    });

    it('should display Out of Stock overlay when stock is zero', () => {
      const productOutOfStock = {
        ...mockProduct,
        variants: [{ ...mockVariant, stock: 0 }],
      };

      render(
        <ProductCard
          product={productOutOfStock}
          onAddToCart={mockOnAddToCart}
          onToggleWishlist={mockOnToggleWishlist}
          isWishlisted={false}
          onSelectProduct={mockOnSelectProduct}
          onToggleCompare={mockOnToggleCompare}
          isCompared={false}
          onNotifyMe={mockOnNotifyMe}
        />
      );

      expect(screen.getAllByText('Out of Stock')).toHaveLength(1);
    });
  });

  describe('Reviews and Ratings', () => {
    it('should display star rating based on average reviews', () => {
      render(
        <ProductCard
          product={mockProduct}
          onAddToCart={mockOnAddToCart}
          onToggleWishlist={mockOnToggleWishlist}
          isWishlisted={false}
          onSelectProduct={mockOnSelectProduct}
          onToggleCompare={mockOnToggleCompare}
          isCompared={false}
          onNotifyMe={mockOnNotifyMe}
        />
      );

      // Average rating: (5 + 4) / 2 = 4.5 → rounded to 5
      expect(screen.getByText('(2)')).toBeInTheDocument();
    });

    it('should display "No reviews yet" when no reviews exist', () => {
      const productNoReviews = {
        ...mockProduct,
        reviews: [],
      };

      render(
        <ProductCard
          product={productNoReviews}
          onAddToCart={mockOnAddToCart}
          onToggleWishlist={mockOnToggleWishlist}
          isWishlisted={false}
          onSelectProduct={mockOnSelectProduct}
          onToggleCompare={mockOnToggleCompare}
          isCompared={false}
          onNotifyMe={mockOnNotifyMe}
        />
      );

      expect(screen.getByText('No reviews yet')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onAddToCart when Add button is clicked', () => {
      render(
        <ProductCard
          product={mockProduct}
          onAddToCart={mockOnAddToCart}
          onToggleWishlist={mockOnToggleWishlist}
          isWishlisted={false}
          onSelectProduct={mockOnSelectProduct}
          onToggleCompare={mockOnToggleCompare}
          isCompared={false}
          onNotifyMe={mockOnNotifyMe}
        />
      );

      const addButton = screen.getByRole('button', { name: /Add Premium Saffron to cart/i });
      fireEvent.click(addButton);

      expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct, mockVariant);
      expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
    });

    it('should call onToggleWishlist when wishlist button is clicked', () => {
      render(
        <ProductCard
          product={mockProduct}
          onAddToCart={mockOnAddToCart}
          onToggleWishlist={mockOnToggleWishlist}
          isWishlisted={false}
          onSelectProduct={mockOnSelectProduct}
          onToggleCompare={mockOnToggleCompare}
          isCompared={false}
          onNotifyMe={mockOnNotifyMe}
        />
      );

      const wishlistButton = screen.getByRole('button', { name: /Add to wishlist/i });
      fireEvent.click(wishlistButton);

      expect(mockOnToggleWishlist).toHaveBeenCalledWith(mockProduct);
      expect(mockOnToggleWishlist).toHaveBeenCalledTimes(1);
    });

    it('should call onSelectProduct when Quick View button is clicked', () => {
      render(
        <ProductCard
          product={mockProduct}
          onAddToCart={mockOnAddToCart}
          onToggleWishlist={mockOnToggleWishlist}
          isWishlisted={false}
          onSelectProduct={mockOnSelectProduct}
          onToggleCompare={mockOnToggleCompare}
          isCompared={false}
          onNotifyMe={mockOnNotifyMe}
        />
      );

      const quickViewButton = screen.getByRole('button', { name: /Quick view Premium Saffron/i });
      fireEvent.click(quickViewButton);

      expect(mockOnSelectProduct).toHaveBeenCalledWith(mockProduct);
      expect(mockOnSelectProduct).toHaveBeenCalledTimes(1);
    });

    it('should call onSelectProduct when product title is clicked', () => {
      render(
        <ProductCard
          product={mockProduct}
          onAddToCart={mockOnAddToCart}
          onToggleWishlist={mockOnToggleWishlist}
          isWishlisted={false}
          onSelectProduct={mockOnSelectProduct}
          onToggleCompare={mockOnToggleCompare}
          isCompared={false}
          onNotifyMe={mockOnNotifyMe}
        />
      );

      const titleButton = screen.getByRole('button', { name: /View details for Premium Saffron/i });
      fireEvent.click(titleButton);

      expect(mockOnSelectProduct).toHaveBeenCalledWith(mockProduct);
      expect(mockOnSelectProduct).toHaveBeenCalledTimes(1);
    });

    it('should call onToggleCompare when compare button is clicked', () => {
      render(
        <ProductCard
          product={mockProduct}
          onAddToCart={mockOnAddToCart}
          onToggleWishlist={mockOnToggleWishlist}
          isWishlisted={false}
          onSelectProduct={mockOnSelectProduct}
          onToggleCompare={mockOnToggleCompare}
          isCompared={false}
          onNotifyMe={mockOnNotifyMe}
        />
      );

      const compareButton = screen.getByRole('button', { name: /Add to comparison/i });
      fireEvent.click(compareButton);

      expect(mockOnToggleCompare).toHaveBeenCalledWith(mockProduct);
      expect(mockOnToggleCompare).toHaveBeenCalledTimes(1);
    });

    it('should call onNotifyMe when product is out of stock and Notify Me is clicked', () => {
      const productOutOfStock = {
        ...mockProduct,
        variants: [{ ...mockVariant, stock: 0 }],
      };

      render(
        <ProductCard
          product={productOutOfStock}
          onAddToCart={mockOnAddToCart}
          onToggleWishlist={mockOnToggleWishlist}
          isWishlisted={false}
          onSelectProduct={mockOnSelectProduct}
          onToggleCompare={mockOnToggleCompare}
          isCompared={false}
          onNotifyMe={mockOnNotifyMe}
        />
      );

      const notifyButton = screen.getByRole('button', { name: /Notify/i });
      fireEvent.click(notifyButton);

      expect(mockOnNotifyMe).toHaveBeenCalledWith('Premium Saffron');
      expect(mockOnNotifyMe).toHaveBeenCalledTimes(1);
      expect(mockOnAddToCart).not.toHaveBeenCalled();
    });
  });

  describe('Wishlist State', () => {
    it('should show filled heart icon when product is wishlisted', () => {
      render(
        <ProductCard
          product={mockProduct}
          onAddToCart={mockOnAddToCart}
          onToggleWishlist={mockOnToggleWishlist}
          isWishlisted={true}
          onSelectProduct={mockOnSelectProduct}
          onToggleCompare={mockOnToggleCompare}
          isCompared={false}
          onNotifyMe={mockOnNotifyMe}
        />
      );

      const wishlistButton = screen.getByRole('button', { name: /Remove from wishlist/i });
      expect(wishlistButton).toBeInTheDocument();

      // Check for the filled heart styling
      const heartIcon = wishlistButton.querySelector('svg');
      expect(heartIcon).toHaveClass('text-brand-secondary');
      expect(heartIcon).toHaveClass('fill-brand-secondary');
    });

    it('should show outline heart icon when product is not wishlisted', () => {
      render(
        <ProductCard
          product={mockProduct}
          onAddToCart={mockOnAddToCart}
          onToggleWishlist={mockOnToggleWishlist}
          isWishlisted={false}
          onSelectProduct={mockOnSelectProduct}
          onToggleCompare={mockOnToggleCompare}
          isCompared={false}
          onNotifyMe={mockOnNotifyMe}
        />
      );

      const wishlistButton = screen.getByRole('button', { name: /Add to wishlist/i });
      expect(wishlistButton).toBeInTheDocument();

      const heartIcon = wishlistButton.querySelector('svg');
      expect(heartIcon).toHaveClass('fill-transparent');
    });
  });

  describe('Compare State', () => {
    it('should apply active styling when product is in comparison', () => {
      render(
        <ProductCard
          product={mockProduct}
          onAddToCart={mockOnAddToCart}
          onToggleWishlist={mockOnToggleWishlist}
          isWishlisted={false}
          onSelectProduct={mockOnSelectProduct}
          onToggleCompare={mockOnToggleCompare}
          isCompared={true}
          onNotifyMe={mockOnNotifyMe}
        />
      );

      const compareButton = screen.getByRole('button', { name: /Remove from comparison/i });
      expect(compareButton).toHaveClass('text-brand-primary');
      expect(compareButton).toHaveClass('bg-brand-primary/10');
    });

    it('should apply default styling when product is not in comparison', () => {
      render(
        <ProductCard
          product={mockProduct}
          onAddToCart={mockOnAddToCart}
          onToggleWishlist={mockOnToggleWishlist}
          isWishlisted={false}
          onSelectProduct={mockOnSelectProduct}
          onToggleCompare={mockOnToggleCompare}
          isCompared={false}
          onNotifyMe={mockOnNotifyMe}
        />
      );

      const compareButton = screen.getByRole('button', { name: /Add to comparison/i });
      expect(compareButton).toHaveClass('text-neutral-600');
    });
  });

  describe('Edge Cases', () => {
    it('should handle product with multiple variants correctly', () => {
      const productMultipleVariants = {
        ...mockProduct,
        variants: [
          mockVariant,
          { id: 2, name: '200g', price: 499, stock: 5 },
          { id: 3, name: '500g', price: 999, stock: 2 },
        ],
      };

      render(
        <ProductCard
          product={productMultipleVariants}
          onAddToCart={mockOnAddToCart}
          onToggleWishlist={mockOnToggleWishlist}
          isWishlisted={false}
          onSelectProduct={mockOnSelectProduct}
          onToggleCompare={mockOnToggleCompare}
          isCompared={false}
          onNotifyMe={mockOnNotifyMe}
        />
      );

      // Should use first variant for add to cart
      const addButton = screen.getByRole('button', { name: /Add Premium Saffron to cart/i });
      fireEvent.click(addButton);

      expect(mockOnAddToCart).toHaveBeenCalledWith(productMultipleVariants, mockVariant);
    });

    it('should calculate total stock correctly across variants', () => {
      const productMultipleVariants = {
        ...mockProduct,
        variants: [
          { id: 1, name: '100g', price: 299, stock: 2 },
          { id: 2, name: '200g', price: 499, stock: 3 },
        ],
      };

      render(
        <ProductCard
          product={productMultipleVariants}
          onAddToCart={mockOnAddToCart}
          onToggleWishlist={mockOnToggleWishlist}
          isWishlisted={false}
          onSelectProduct={mockOnSelectProduct}
          onToggleCompare={mockOnToggleCompare}
          isCompared={false}
          onNotifyMe={mockOnNotifyMe}
        />
      );

      // Total stock is 5, should show LOW STOCK badge
      expect(screen.getByText('Low Stock')).toBeInTheDocument();
    });

    it('should handle product with no tags gracefully', () => {
      const productNoTags = {
        ...mockProduct,
        tags: undefined,
      };

      expect(() => {
        render(
          <ProductCard
            product={productNoTags}
            onAddToCart={mockOnAddToCart}
            onToggleWishlist={mockOnToggleWishlist}
            isWishlisted={false}
            onSelectProduct={mockOnSelectProduct}
            onToggleCompare={mockOnToggleCompare}
            isCompared={false}
            onNotifyMe={mockOnNotifyMe}
          />
        );
      }).not.toThrow();
    });

    it('should memoize component - same props return same render', () => {
      const { rerender } = render(
        <ProductCard
          product={mockProduct}
          onAddToCart={mockOnAddToCart}
          onToggleWishlist={mockOnToggleWishlist}
          isWishlisted={false}
          onSelectProduct={mockOnSelectProduct}
          onToggleCompare={mockOnToggleCompare}
          isCompared={false}
          onNotifyMe={mockOnNotifyMe}
        />
      );

      const firstRender = screen.getByText('Premium Saffron');

      // Rerender with same props
      rerender(
        <ProductCard
          product={mockProduct}
          onAddToCart={mockOnAddToCart}
          onToggleWishlist={mockOnToggleWishlist}
          isWishlisted={false}
          onSelectProduct={mockOnSelectProduct}
          onToggleCompare={mockOnToggleCompare}
          isCompared={false}
          onNotifyMe={mockOnNotifyMe}
        />
      );

      const secondRender = screen.getByText('Premium Saffron');
      expect(firstRender).toBe(secondRender);
    });
  });
});
