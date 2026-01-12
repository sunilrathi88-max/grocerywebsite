import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MobileBottomNav from '../MobileBottomNav';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('MobileBottomNav', () => {
  const defaultProps = {
    cartItemCount: 0,
    wishlistItemCount: 0,
    onOpenCart: jest.fn(),
    onOpenWishlist: jest.fn(),
    onOpenMenu: jest.fn(),
    currentView: 'home',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('navigates to Home when Home icon is clicked', () => {
    render(<MobileBottomNav {...defaultProps} />);
    const homeButton = screen.getByLabelText('Home');
    fireEvent.click(homeButton);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates to Profile when Profile icon is clicked', () => {
    render(<MobileBottomNav {...defaultProps} />);
    const profileButton = screen.getByLabelText('Profile');
    fireEvent.click(profileButton);
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('calls onOpenCart when Cart icon is clicked', () => {
    render(<MobileBottomNav {...defaultProps} />);
    const cartButton = screen.getByLabelText('Cart');
    fireEvent.click(cartButton);
    expect(defaultProps.onOpenCart).toHaveBeenCalled();
  });

  it('calls onOpenWishlist when Wishlist icon is clicked', () => {
    render(<MobileBottomNav {...defaultProps} />);
    const wishlistButton = screen.getByLabelText('Wishlist');
    fireEvent.click(wishlistButton);
    expect(defaultProps.onOpenWishlist).toHaveBeenCalled();
  });

  it('calls onOpenMenu when Shop icon is clicked', () => {
    render(<MobileBottomNav {...defaultProps} />);
    const shopButton = screen.getByLabelText('Shop');
    fireEvent.click(shopButton);
    expect(defaultProps.onOpenMenu).toHaveBeenCalled();
  });

  it('displays badge count for Cart when items exist', () => {
    render(<MobileBottomNav {...defaultProps} cartItemCount={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('displays badge count for Wishlist when items exist', () => {
    render(<MobileBottomNav {...defaultProps} wishlistItemCount={3} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
