/* eslint-disable react/display-name, @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CheckoutPage from '../CheckoutPage';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
jest.mock('../TrustBadges', () => ({ TrustBadges: () => <div data-testid="trust-badges" /> }));
jest.mock('../CheckoutStepper', () => (props: any) => (
  <div data-testid="checkout-stepper">{props.currentStep}</div>
));
jest.mock('../OptimizedImage', () => ({ OptimizedImage: () => <img /> }));
jest.mock('../ShippingRateSelector', () => () => <div data-testid="shipping-rate-selector" />);

describe('CheckoutPage', () => {
  const defaultProps = {
    cartItems: [], // Mock as needed
    user: null,
    onPlaceOrder: jest.fn(),
    addToast: jest.fn(),
    discount: 0,
    promoCode: '',
    onApplyPromoCode: jest.fn(),
    onRemovePromoCode: jest.fn(),
    subtotal: 100,
    shippingCost: 0,
  };

  it('renders Auth step for guest user initially', () => {
    render(
      <BrowserRouter>
        <CheckoutPage {...defaultProps} />
      </BrowserRouter>
    );
    expect(screen.getByText('Returning Customer?')).toBeInTheDocument();
    expect(screen.getByText('Guest Checkout')).toBeInTheDocument();
    expect(screen.getByTestId('checkout-stepper')).toHaveTextContent('auth');
  });

  it('renders Shipping step immediately for logged-in user', () => {
    render(
      <BrowserRouter>
        <CheckoutPage
          {...defaultProps}
          user={{ id: 1, name: 'Test User', email: 'test@test.com', addresses: [] } as any}
        />
      </BrowserRouter>
    );
    expect(screen.queryByText('Returning Customer?')).not.toBeInTheDocument();
    expect(screen.getByText('Checkout')).toBeInTheDocument(); // Header for shipping step
    expect(screen.getByTestId('checkout-stepper')).toHaveTextContent('shipping');
  });

  it('allows guest to proceed to shipping', () => {
    render(
      <BrowserRouter>
        <CheckoutPage {...defaultProps} />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('john@example.com');
    fireEvent.change(emailInput, { target: { value: 'guest@example.com' } });

    const continueButton = screen.getByText('Continue as Guest');
    fireEvent.click(continueButton);

    expect(screen.getByText('Checkout')).toBeInTheDocument();
    expect(screen.getByTestId('checkout-stepper')).toHaveTextContent('shipping');

    // Check if email is preserved (in read-only view or state)
    // Implementation detail: we show "Contact: guest@example.com"
    expect(screen.getByText('guest@example.com')).toBeInTheDocument();
  });
});
