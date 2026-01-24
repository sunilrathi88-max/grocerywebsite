/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductDetailPage from '../../pages/ProductDetailPage';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mocks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn(),
}));

const mockAddItem = jest.fn();
jest.mock('../../store/cartStore', () => ({
  useCartStore: (selector: any) => selector({ addItem: mockAddItem }),
}));

jest.mock('../../data/recipes', () => ({
  MOCK_RECIPES: [],
}));

jest.mock('../../hooks/useWishlist', () => ({
  useWishlist: () => ({ wishlistItems: [], toggleWishlist: jest.fn() }),
}));

jest.mock('../../src/context/ABTestContext', () => ({
  useABTest: () => ({ variant: 'A', trackConversion: jest.fn() }),
}));

// Mock ImageGallery to avoid react-slick issues in tests
jest.mock('../../components/ImageGallery', () => {
  return function MockImageGallery() {
    return <div data-testid="image-gallery">Mock Gallery</div>;
  };
});

jest.mock('../../hooks/useProducts', () => ({
  useProducts: () => ({
    products: [
      {
        id: 1,
        name: 'Test Spice',
        variants: [{ name: '100g', price: 100, stock: 50, salePrice: undefined }],
        images: ['img.jpg'],
        rating: 5,
        reviews: [],
        tags: ['spice'],
        category: 'Spices',
        description: 'Test Description',
      },
      {
        id: 2,
        name: 'Related Spice',
        variants: [{ name: '100g', price: 200, stock: 50, salePrice: undefined }],
        images: ['img2.jpg'],
        rating: 4,
        reviews: [],
        tags: ['spice'],
        category: 'Spices',
      },
    ],
  }),
}));

describe('ProductDetailPage', () => {
  beforeEach(() => {
    mockAddItem.mockClear();
    window.alert = jest.fn();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <ProductDetailPage />
      </BrowserRouter>
    );

  it('renders product details correctly', () => {
    renderComponent();
    // Use getAllByText since product name may appear in multiple places (title, breadcrumb, etc.)
    const productNameElements = screen.getAllByText('Test Spice');
    expect(productNameElements.length).toBeGreaterThan(0);
  });

  it('shows related products in slider', () => {
    renderComponent();
    expect(screen.getByText('You Might Also Like')).toBeInTheDocument();
    // Related spice should be visible (as it shares category/tags)
    expect(screen.getByText('Related Spice')).toBeInTheDocument();
  });

  it('allows adding one-time purchase to cart', () => {
    renderComponent();
    const addButtons = screen.getAllByText('Add to Cart');
    fireEvent.click(addButtons[0]);

    expect(mockAddItem).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1-100g',
        name: 'Test Spice',
        price: 100,
        isSubscription: false,
      })
    );
  });

  it('allows toggling to Subscribe & Save and adding to cart', () => {
    renderComponent();

    // Find subscription radio/label
    const subOption = screen.getByText(/Subscribe & Save/i);
    fireEvent.click(subOption);

    const addButtons = screen.getAllByText('Add to Cart');
    fireEvent.click(addButtons[0]);

    // Should have 10% discount: 100 * 0.9 = 90
    expect(mockAddItem).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1-100g-sub',
        name: 'Test Spice (Sub)',
        price: 90,
        isSubscription: true,
        subscriptionInterval: 'monthly',
      })
    );
  });
});
