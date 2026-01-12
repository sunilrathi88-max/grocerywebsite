/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SubscriptionPage from '../../pages/SubscriptionPage';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockAddItem = jest.fn();
jest.mock('../../store/cartStore', () => ({
  useCartStore: (selector: any) => selector({ addItem: mockAddItem }),
}));

describe('SubscriptionPage', () => {
  beforeEach(() => {
    mockAddItem.mockClear();
    mockNavigate.mockClear();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <SubscriptionPage />
      </BrowserRouter>
    );

  it('renders subscription plans', () => {
    renderComponent();
    expect(screen.getByText('INTRODUCING TATTVA FRESH MONTHLY')).toBeInTheDocument();
    // Case insensitive text match
    expect(screen.getByText(/INTRODUCING TATTVA FRESH MONTHLY/i)).toBeInTheDocument();
    expect(screen.getByText('Starter Box')).toBeInTheDocument();
    expect(screen.getByText('Chef’s Collection')).toBeInTheDocument();
  });

  it('adds plan to cart when subscribe clicked', () => {
    renderComponent();

    // Find button for first plan (Starter Box)
    // SubscriptionCard renders "Subscribe Now" button. Since there are multiple, get all.
    const subscribeButtons = screen.getAllByText('Subscribe Now');
    fireEvent.click(subscribeButtons[0]);

    expect(mockAddItem).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'sub-starter',
        name: 'Tattva Fresh: Starter Box',
        price: 999,
        isSubscription: true,
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith('/cart');
  });
});
