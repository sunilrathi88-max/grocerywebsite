import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { LoyaltyPointsTracker } from '../LoyaltyPointsTracker';
import { useLoyaltyStore } from '../../store/loyaltyStore';

// Mock localStorage
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('LoyaltyPointsTracker', () => {
  beforeEach(() => {
    // Reset store state before each test
    useLoyaltyStore.setState({
      points: {
        current: 1250,
        lifetime: 3800,
        tier: 'Silver',
        nextTierPoints: 5000,
      },
      history: [],
    });
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders current points', () => {
    render(<LoyaltyPointsTracker />);
    expect(screen.getByText('1,250 Points')).toBeInTheDocument();
    expect(screen.getByText('Silver')).toBeInTheDocument();
  });

  it('allows redeeming points if balance is sufficient', () => {
    render(<LoyaltyPointsTracker />);
    const redeemButton = screen.getAllByText('Redeem')[0]; // First button is for 500 points

    fireEvent.click(redeemButton);

    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Successfully redeemed'));
    expect(screen.getByText('750 Points')).toBeInTheDocument(); // 1250 - 500
  });

  it('disables redeem button if balance is insufficient', () => {
    // Set points to low value
    act(() => {
      useLoyaltyStore.setState({
        points: { current: 100, lifetime: 100, tier: 'Bronze', nextTierPoints: 2000 },
      });
    });

    render(<LoyaltyPointsTracker />);

    // Buttons should be disabled or show 'Not Available'
    expect(screen.getAllByText('Not Available').length).toBeGreaterThan(0);
  });
});
