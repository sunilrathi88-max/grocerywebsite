import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Cart from '../Cart';
import { CartItem, Product, Variant } from '../../types';

// Mock framer-motion
// Mock framer-motion
jest.mock('framer-motion', () => {
  const React = require('react');
  const motion = {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, onClick, className, disabled, ...props }: any) => (
      <button onClick={onClick} className={className} disabled={disabled} {...props}>
        {children}
      </button>
    ),
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  };

  const AnimatePresence = ({ children }: any) => <>{children}</>;

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

// Mock OptimizedImage
/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('../OptimizedImage', () => ({
  OptimizedImage: ({ src, alt, onError, className }: any) => (
    <img
      src={src}
      alt={alt}
      onError={onError}
      className={className}
      data-testid="optimized-image"
    />
  ),
}));
/* eslint-enable @typescript-eslint/no-explicit-any */

describe('Cart', () => {
  // Mock functions
  const mockOnUpdateQuantity = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnPromoCodeChange = jest.fn();
  const mockOnApplyPromoCode = jest.fn();

  // Mock data
  const mockVariant1: Variant = {
    id: 1,
    name: '100g',
    price: 299,
    salePrice: 249,
    stock: 10,
  };

  const mockVariant2: Variant = {
    id: 2,
    name: '200g',
    price: 499,
    stock: 5,
  };

  const mockProduct1: Product = {
    id: 1,
    name: 'Premium Saffron',
    description: 'Finest quality saffron',
    category: 'Spices',
    images: ['/images/products/saffron-1.svg'],
    variants: [mockVariant1],
    reviews: [],
    tags: [],
  };

  const mockProduct2: Product = {
    id: 2,
    name: 'Black Pepper',
    description: 'Organic black pepper',
    category: 'Spices',
    images: ['/images/products/pepper-1.svg'],
    variants: [mockVariant2],
    reviews: [],
    tags: [],
  };

  const mockCartItem1: CartItem = {
    product: mockProduct1,
    selectedVariant: mockVariant1,
    quantity: 2,
  };

  const mockCartItem2: CartItem = {
    product: mockProduct2,
    selectedVariant: mockVariant2,
    quantity: 1,
  };

  const defaultProps = {
    items: [mockCartItem1, mockCartItem2],
    onUpdateQuantity: mockOnUpdateQuantity,
    onClose: mockOnClose,
    isLoggedIn: true,
    promoCode: '',
    onPromoCodeChange: mockOnPromoCodeChange,
    onApplyPromoCode: mockOnApplyPromoCode,
    discount: 0,
    subtotal: 747, // (249 * 2) + 499
    shippingCost: 0,
    onRemoveItem: jest.fn(),
    onCheckout: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(async () => {
    // Wrap timer cleanup in act to avoid warnings
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  describe('Empty Cart', () => {
    it('should display empty cart message when no items', () => {
      render(<Cart {...defaultProps} items={[]} subtotal={0} />);

      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    });

    it('should show Continue Shopping button in empty cart', () => {
      render(<Cart {...defaultProps} items={[]} subtotal={0} />);

      const continueButton = screen.getByRole('button', { name: /Start Shopping/i });
      expect(continueButton).toBeInTheDocument();
    });

    it('should call onClose when Continue Shopping is clicked', () => {
      render(<Cart {...defaultProps} items={[]} subtotal={0} />);

      const continueButton = screen.getByRole('button', { name: /Start Shopping/i });
      fireEvent.click(continueButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Cart with Items', () => {
    it('should render all cart items', () => {
      render(<Cart {...defaultProps} />);

      expect(screen.getByText('Premium Saffron')).toBeInTheDocument();
      expect(screen.getByText('Black Pepper')).toBeInTheDocument();
    });

    it('should display item variant names', () => {
      render(<Cart {...defaultProps} />);

      expect(screen.getByText('100g')).toBeInTheDocument();
      expect(screen.getByText('200g')).toBeInTheDocument();
    });

    it('should display item prices', () => {
      render(<Cart {...defaultProps} />);

      expect(screen.getByText('₹249.00')).toBeInTheDocument();
      expect(screen.getByText('₹499.00')).toBeInTheDocument();
    });

    it('should display item quantities', () => {
      render(<Cart {...defaultProps} />);

      const quantities = screen.getAllByText(/^[0-9]+$/);
      expect(quantities).toHaveLength(2);
      expect(quantities[0]).toHaveTextContent('2');
      expect(quantities[1]).toHaveTextContent('1');
    });

    it('should render product images', () => {
      render(<Cart {...defaultProps} />);

      const images = screen.getAllByTestId('optimized-image');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute('src', '/images/products/saffron-1.svg');
      expect(images[1]).toHaveAttribute('src', '/images/products/pepper-1.svg');
    });
  });

  describe('Quantity Management', () => {
    it('should increase quantity when plus button is clicked', async () => {
      render(<Cart {...defaultProps} />);

      const plusButtons = screen.getAllByRole('button', { name: '' }).filter((btn) => {
        const svg = btn.querySelector('svg');
        return svg && btn.className.includes('hover:bg-gray-200');
      });

      // Click plus button for first item
      fireEvent.click(plusButtons[1]); // Second button is plus for first item

      // Wait for simulated delay wrapped in act
      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(mockOnUpdateQuantity).toHaveBeenCalledWith(1, 1, 3);
      });
    });

    it('should decrease quantity when minus button is clicked', async () => {
      render(<Cart {...defaultProps} />);

      const minusButtons = screen.getAllByRole('button', { name: '' }).filter((btn) => {
        const svg = btn.querySelector('svg');
        return svg && btn.className.includes('hover:bg-gray-200');
      });

      // Click minus button for first item
      fireEvent.click(minusButtons[0]);

      // Wait for simulated delay wrapped in act
      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(mockOnUpdateQuantity).toHaveBeenCalledWith(1, 1, 1);
      });
    });

    it('should disable plus button when quantity reaches stock limit', () => {
      const itemAtLimit: CartItem = {
        product: mockProduct1,
        selectedVariant: mockVariant1,
        quantity: 10, // Same as stock
      };

      render(<Cart {...defaultProps} items={[itemAtLimit]} subtotal={2490} />);

      const plusButtons = screen.getAllByRole('button', { name: '' }).filter((btn) => {
        const svg = btn.querySelector('svg');
        return svg && (btn as HTMLButtonElement).disabled;
      });

      expect(plusButtons.length).toBeGreaterThan(0);
    });

    it('should show loading spinner during quantity update', () => {
      render(<Cart {...defaultProps} />);

      const minusButtons = screen.getAllByRole('button', { name: '' }).filter((btn) => {
        const svg = btn.querySelector('svg');
        return svg && btn.className.includes('hover:bg-gray-200');
      });

      fireEvent.click(minusButtons[0]);

      // Spinner SVG should appear immediately
      const spinners = document.querySelectorAll('.animate-spin');
      expect(spinners.length).toBeGreaterThan(0);
    });
  });

  describe('Item Removal', () => {
    it('should show confirmation dialog when decreasing quantity to zero', () => {
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

      render(<Cart {...defaultProps} />);

      const trashButtons = screen.getAllByRole('button', { name: '' }).filter((btn) => {
        return btn.className.includes('text-red-500');
      });

      fireEvent.click(trashButtons[0]);

      expect(confirmSpy).toHaveBeenCalledWith(
        'Are you sure you want to remove "Premium Saffron" from your cart?'
      );

      confirmSpy.mockRestore();
    });

    it('should remove item when trash button is clicked and confirmed', async () => {
      jest.spyOn(window, 'confirm').mockReturnValue(true);

      render(<Cart {...defaultProps} />);

      const trashButtons = screen.getAllByRole('button', { name: '' }).filter((btn) => {
        return btn.className.includes('text-red-500');
      });

      fireEvent.click(trashButtons[0]);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(mockOnUpdateQuantity).toHaveBeenCalledWith(1, 1, 0);
      });
    });

    it('should not remove item when confirmation is cancelled', () => {
      jest.spyOn(window, 'confirm').mockReturnValue(false);

      render(<Cart {...defaultProps} />);

      const trashButtons = screen.getAllByRole('button', { name: '' }).filter((btn) => {
        return btn.className.includes('text-red-500');
      });

      fireEvent.click(trashButtons[0]);

      expect(mockOnUpdateQuantity).not.toHaveBeenCalled();
    });
  });

  describe('Promo Code', () => {
    it('should render promo code input', () => {
      render(<Cart {...defaultProps} />);

      expect(screen.getByLabelText('Promo Code')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('TATTVA10')).toBeInTheDocument();
    });

    it('should call onPromoCodeChange when input value changes', () => {
      render(<Cart {...defaultProps} />);

      const input = screen.getByPlaceholderText('TATTVA10');
      fireEvent.change(input, { target: { value: 'SAVE20' } });

      expect(mockOnPromoCodeChange).toHaveBeenCalledWith('SAVE20');
    });

    it('should display current promo code value', () => {
      render(<Cart {...defaultProps} promoCode="DISCOUNT10" />);

      const input = screen.getByPlaceholderText('TATTVA10') as HTMLInputElement;
      expect(input.value).toBe('DISCOUNT10');
    });

    it('should call onApplyPromoCode when Apply button is clicked', async () => {
      render(<Cart {...defaultProps} promoCode="SAVE20" />);

      const applyButton = screen.getByRole('button', { name: /Apply/i });
      fireEvent.click(applyButton);

      await act(async () => {
        jest.advanceTimersByTime(800);
      });

      await waitFor(() => {
        expect(mockOnApplyPromoCode).toHaveBeenCalledWith('SAVE20');
      });
    });

    it('should disable promo input and button during loading', () => {
      render(<Cart {...defaultProps} promoCode="TEST" />);

      const applyButton = screen.getByRole('button', { name: /Apply/i });
      fireEvent.click(applyButton);

      const input = screen.getByPlaceholderText('TATTVA10');
      expect(input).toBeDisabled();
      expect(applyButton).toBeDisabled();
    });
  });

  describe('Price Calculations', () => {
    it('should display subtotal correctly', () => {
      render(<Cart {...defaultProps} />);

      expect(screen.getByText('Subtotal')).toBeInTheDocument();
      expect(screen.getByText('₹747.00')).toBeInTheDocument();
    });

    it('should display discount when applied', () => {
      render(<Cart {...defaultProps} discount={50} />);

      expect(screen.getByText('Discount')).toBeInTheDocument();
      expect(screen.getByText('-₹50.00')).toBeInTheDocument();
    });

    it('should not display discount row when discount is zero', () => {
      render(<Cart {...defaultProps} discount={0} />);

      expect(screen.queryByText('Discount')).not.toBeInTheDocument();
    });

    it('should display Free shipping when shipping cost is zero', () => {
      render(<Cart {...defaultProps} shippingCost={0} />);

      expect(screen.getByText('Shipping')).toBeInTheDocument();
      expect(screen.getByText('Free')).toBeInTheDocument();
    });

    it('should display shipping cost when not free', () => {
      render(<Cart {...defaultProps} shippingCost={10} />);

      expect(screen.getByText('Shipping')).toBeInTheDocument();
      expect(screen.getByText('₹10.00')).toBeInTheDocument();
    });

    it('should calculate and display tax (8%)', () => {
      // Tax = (subtotal - discount) * 0.08 = (747 - 0) * 0.08 = 59.76
      render(<Cart {...defaultProps} />);

      expect(screen.getByText('Taxes (8%)')).toBeInTheDocument();
      expect(screen.getByText('₹59.76')).toBeInTheDocument();
    });

    it('should calculate total correctly', () => {
      // Total = subtotal - discount + shipping + tax
      // 747 - 0 + 0 + 59.76 = 806.76
      render(<Cart {...defaultProps} />);

      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('₹806.76')).toBeInTheDocument();
    });

    it('should calculate total with discount and shipping', () => {
      // Total = 747 - 50 + 15 + ((747 - 50) * 0.08) = 747 - 50 + 15 + 55.76 = 767.76
      render(<Cart {...defaultProps} discount={50} shippingCost={15} />);

      const totalText = screen.getByText('₹767.76');
      expect(totalText).toBeInTheDocument();
    });
  });

  describe('Checkout', () => {
    it('should display Proceed to Checkout button when items exist', () => {
      render(<Cart {...defaultProps} />);

      expect(screen.getByText('Proceed to Checkout')).toBeInTheDocument();
    });

    it('should enable checkout button when items exist', () => {
      render(<Cart {...defaultProps} />);

      const checkoutLink = screen.getByText('Proceed to Checkout').closest('a');
      expect(checkoutLink).not.toHaveClass('cursor-not-allowed');
      expect(checkoutLink).toHaveAttribute('href', '#/checkout');
    });

    it('should call onClose when checkout button is clicked', () => {
      render(<Cart {...defaultProps} />);

      const checkoutLink = screen.getByText('Proceed to Checkout');
      fireEvent.click(checkoutLink);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should show guest checkout message when not logged in', () => {
      render(<Cart {...defaultProps} isLoggedIn={false} />);

      expect(screen.getByText(/You can check out as a guest or log in/i)).toBeInTheDocument();
    });

    it('should not show guest message when logged in', () => {
      render(<Cart {...defaultProps} isLoggedIn={true} />);

      expect(screen.queryByText(/You can check out as a guest or log in/i)).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single item in cart', () => {
      render(<Cart {...defaultProps} items={[mockCartItem1]} subtotal={498} />);

      expect(screen.getByText('Premium Saffron')).toBeInTheDocument();
      expect(screen.queryByText('Black Pepper')).not.toBeInTheDocument();
    });

    it('should handle items with same product but different variants', () => {
      const variant2: Variant = { ...mockVariant1, id: 3, name: '200g', price: 499 };
      const cartItem3: CartItem = {
        product: mockProduct1,
        selectedVariant: variant2,
        quantity: 1,
      };

      render(<Cart {...defaultProps} items={[mockCartItem1, cartItem3]} subtotal={997} />);

      const productNames = screen.getAllByText('Premium Saffron');
      expect(productNames).toHaveLength(2);
      expect(screen.getByText('100g')).toBeInTheDocument();
      expect(screen.getByText('200g')).toBeInTheDocument();
    });

    it('should not break with large quantities', () => {
      const largeQuantityItem: CartItem = {
        ...mockCartItem1,
        quantity: 99,
      };

      render(<Cart {...defaultProps} items={[largeQuantityItem]} subtotal={24651} />);

      expect(screen.getByText('99')).toBeInTheDocument();
    });

    it('should handle very large subtotals', () => {
      render(<Cart {...defaultProps} subtotal={9999.99} />);

      expect(screen.getByText('₹9999.99')).toBeInTheDocument();
    });

    it('should format decimal prices correctly', () => {
      render(<Cart {...defaultProps} subtotal={123.456} />);

      expect(screen.getByText('₹123.46')).toBeInTheDocument();
    });
  });
});
