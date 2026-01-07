import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Cart from '../Cart';
import { CartItem } from '../../store/cartStore';

// Mock framer-motion
// Mock framer-motion
jest.mock('framer-motion', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  const motion = {
    div: ({
      children,
      layout: _layout,
      initial: _initial,
      animate: _animate,
      exit: _exit,
      transition: _transition,
      whileHover: _whileHover,
      whileTap: _whileTap,
      ...props
    }: React.ComponentProps<'div'> & Record<string, unknown>) => <div {...props}>{children}</div>,
    button: ({
      children,
      onClick,
      className,
      disabled,
      layout: _layout,
      initial: _initial,
      animate: _animate,
      exit: _exit,
      transition: _transition,
      whileHover: _whileHover,
      whileTap: _whileTap,
      ...props
    }: React.ComponentProps<'button'> & Record<string, unknown>) => (
      <button onClick={onClick} className={className} disabled={disabled} {...props}>
        {children}
      </button>
    ),
    span: ({
      children,
      layout: _layout,
      initial: _initial,
      animate: _animate,
      exit: _exit,
      transition: _transition,
      whileHover: _whileHover,
      whileTap: _whileTap,
      key: _key,
      ...props
    }: React.ComponentProps<'span'> & Record<string, unknown>) => (
      <span {...props}>{children}</span>
    ),
    a: ({
      children,
      layout: _layout,
      initial: _initial,
      animate: _animate,
      exit: _exit,
      transition: _transition,
      whileHover: _whileHover,
      whileTap: _whileTap,
      ...props
    }: React.ComponentProps<'a'> & Record<string, unknown>) => <a {...props}>{children}</a>,
    p: ({
      children,
      layout: _layout,
      initial: _initial,
      animate: _animate,
      exit: _exit,
      transition: _transition,
      whileHover: _whileHover,
      whileTap: _whileTap,
      ...props
    }: React.ComponentProps<'p'> & Record<string, unknown>) => <p {...props}>{children}</p>,
  };

  const AnimatePresence = ({ children }: { children: React.ReactNode }) => <>{children}</>;

  return {
    motion,
    m: motion,
    AnimatePresence,
    useAnimation: () => ({
      start: jest.fn(),
      stop: jest.fn(),
      set: jest.fn(),
    }),
  };
});

// Mock OptimizedImage

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

describe('Cart', () => {
  // Mock functions
  const mockOnUpdateQuantity = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnPromoCodeChange = jest.fn();
  const mockOnApplyPromoCode = jest.fn();

  // Mock data using store/cartStore CartItem structure
  const mockCartItem1: CartItem = {
    id: '1-100g',
    name: 'Premium Saffron',
    price: 249,
    quantity: 2,
    weight: '100g',
    image: '/images/products/saffron-1.svg',
    stock: 10,
  };

  const mockCartItem2: CartItem = {
    id: '2-200g',
    name: 'Black Pepper',
    price: 499,
    quantity: 1,
    weight: '200g',
    image: '/images/products/pepper-1.svg',
    stock: 5,
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
    subtotal: 997, // (249 * 2) + 499
    shippingCost: 0,
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
        expect(mockOnUpdateQuantity).toHaveBeenCalledWith('1-100g', 3);
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
        expect(mockOnUpdateQuantity).toHaveBeenCalledWith('1-100g', 1);
      });
    });

    it('should disable plus button when quantity reaches stock limit', () => {
      const itemAtLimit: CartItem = {
        id: '1-100g',
        name: 'Premium Saffron',
        price: 249,
        quantity: 10, // Same as stock
        weight: '100g',
        image: '/images/products/saffron-1.svg',
        stock: 10,
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

      const removeButtons = screen.getAllByRole('button', { name: /remove/i });

      fireEvent.click(removeButtons[0]);

      expect(confirmSpy).toHaveBeenCalledWith(
        'Are you sure you want to remove "Premium Saffron" from your cart?'
      );

      confirmSpy.mockRestore();
    });

    it('should remove item when trash button is clicked and confirmed', async () => {
      jest.spyOn(window, 'confirm').mockReturnValue(true);

      render(<Cart {...defaultProps} />);

      const removeButtons = screen.getAllByRole('button', { name: /remove/i });

      fireEvent.click(removeButtons[0]);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(mockOnUpdateQuantity).toHaveBeenCalledWith('1-100g', 0);
      });
    });

    it('should not remove item when confirmation is cancelled', () => {
      jest.spyOn(window, 'confirm').mockReturnValue(false);

      render(<Cart {...defaultProps} />);

      const removeButtons = screen.getAllByRole('button', { name: /remove/i });

      fireEvent.click(removeButtons[0]);

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
      expect(screen.getByText('₹997.00')).toBeInTheDocument();
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
      // Tax = (subtotal - discount) * 0.08 = (997 - 0) * 0.08 = 79.76
      render(<Cart {...defaultProps} />);

      expect(screen.getByText('Taxes (8%)')).toBeInTheDocument();
      expect(screen.getByText('₹79.76')).toBeInTheDocument();
    });

    it('should calculate total correctly', () => {
      // Total = subtotal - discount + shipping + tax
      // 997 - 0 + 0 + 79.76 = 1076.76
      render(<Cart {...defaultProps} />);

      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('₹1076.76')).toBeInTheDocument();
    });

    it('should calculate total with discount and shipping', () => {
      // Total = 997 - 50 + 15 + ((997 - 50) * 0.08) = 997 - 50 + 15 + 75.76 = 1037.76
      render(<Cart {...defaultProps} discount={50} shippingCost={15} />);

      const totalText = screen.getByText('₹1037.76');
      expect(totalText).toBeInTheDocument();
    });
  });

  describe('Checkout', () => {
    it('should display Proceed to Checkout button when items exist', () => {
      render(<Cart {...defaultProps} />);

      expect(screen.getByRole('button', { name: /Proceed to Checkout/i })).toBeInTheDocument();
    });

    it('should enable checkout button when items exist', () => {
      render(<Cart {...defaultProps} />);

      const checkoutButton = screen.getByRole('button', { name: /Proceed to Checkout/i });
      expect(checkoutButton).not.toBeDisabled();
      expect(checkoutButton).not.toHaveClass('cursor-not-allowed');
    });

    it('should call onCheckout when checkout button is clicked', () => {
      render(<Cart {...defaultProps} />);

      const checkoutButton = screen.getByRole('button', { name: /Proceed to Checkout/i });
      fireEvent.click(checkoutButton);

      expect(defaultProps.onCheckout).toHaveBeenCalledTimes(1);
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
      const cartItem3: CartItem = {
        id: '1-200g',
        name: 'Premium Saffron',
        price: 499,
        quantity: 1,
        weight: '200g',
        image: '/images/products/saffron-1.svg',
        stock: 5,
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
