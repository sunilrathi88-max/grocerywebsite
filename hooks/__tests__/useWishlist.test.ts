import { renderHook, act, waitFor } from '@testing-library/react';
import { useWishlist } from '../useWishlist';
import { Product } from '../../types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
  Wrapper.displayName = 'QueryClientWrapper';
  return Wrapper;
};

describe('useWishlist', () => {
  // Mock product data
  const mockProduct1: Product = {
    id: 1,
    name: 'Premium Saffron',
    description: 'Finest quality saffron',
    category: 'spices',
    images: ['/images/products/saffron-1.svg'],
    variants: [],
    reviews: [],
    origin: 'Kashmir',
    tags: ['organic', 'premium'],
  };

  const mockProduct2: Product = {
    id: 2,
    name: 'Black Pepper',
    description: 'Organic black pepper',
    category: 'spices',
    images: ['/images/products/pepper-1.svg'],
    variants: [],
    reviews: [],
  };

  const mockProduct3: Product = {
    id: 3,
    name: 'Turmeric Powder',
    description: 'Pure turmeric powder',
    category: 'spices',
    images: ['/images/products/turmeric-1.svg'],
    variants: [],
    reviews: [],
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with empty wishlist', () => {
      const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

      expect(result.current.wishlistItems).toEqual([]);
      expect(result.current.wishlistItemCount).toBe(0);
    });

    it('should load wishlist from localStorage on initialization', async () => {
      const savedWishlist = [mockProduct1, mockProduct2];
      // Set up localStorage before creating the hook
      localStorage.setItem('tattva_wishlist', JSON.stringify(savedWishlist));

      const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(result.current.wishlistItems).toHaveLength(2);
      });
      expect(result.current.wishlistItems).toEqual(savedWishlist);
      expect(result.current.wishlistItemCount).toBe(2);
    });

    it('should handle invalid JSON in localStorage gracefully', () => {
      // Temporarily override getItem to return invalid JSON
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = jest.fn().mockReturnValue('invalid json');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

      // Should initialize with empty array and not crash
      expect(result.current.wishlistItems).toEqual([]);
      // Console.error might or might not be called depending on JSON.parse error handling

      consoleSpy.mockRestore();
      localStorage.getItem = originalGetItem;
    });

    it('should initialize empty wishlist when localStorage is empty', () => {
      // localStorage is already clear from beforeEach
      const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

      expect(result.current.wishlistItems).toEqual([]);
    });
  });

  describe('toggleWishlist', () => {
    it('should add product to wishlist when not present', async () => {
      const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });

      await waitFor(() => {
        expect(result.current.wishlistItems).toHaveLength(1);
      });
      expect(result.current.wishlistItems[0]).toEqual(mockProduct1);
    });

    it('should remove product from wishlist when already present', async () => {
      const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });

      await waitFor(() => {
        expect(result.current.wishlistItems).toHaveLength(1);
      });

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });

      await waitFor(() => {
        expect(result.current.wishlistItems).toHaveLength(0);
      });
    });

    it('should add multiple products to wishlist', async () => {
      const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });
      await waitFor(() => expect(result.current.wishlistItems).toHaveLength(1));

      act(() => {
        result.current.toggleWishlist(mockProduct2);
      });
      await waitFor(() => expect(result.current.wishlistItems).toHaveLength(2));

      act(() => {
        result.current.toggleWishlist(mockProduct3);
      });
      await waitFor(() => {
        expect(result.current.wishlistItems).toHaveLength(3);
      });
      expect(result.current.wishlistItems).toEqual([mockProduct1, mockProduct2, mockProduct3]);
    });

    it('should only remove specified product', async () => {
      const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });
      await waitFor(() => expect(result.current.wishlistItems).toHaveLength(1));

      act(() => {
        result.current.toggleWishlist(mockProduct2);
      });
      await waitFor(() => expect(result.current.wishlistItems).toHaveLength(2));

      act(() => {
        result.current.toggleWishlist(mockProduct3);
      });
      await waitFor(() => {
        expect(result.current.wishlistItems).toHaveLength(3);
      });

      act(() => {
        result.current.toggleWishlist(mockProduct2);
      });

      await waitFor(() => {
        expect(result.current.wishlistItems).toHaveLength(2);
      });
      expect(result.current.wishlistItems).toEqual([mockProduct1, mockProduct3]);
    });

    it('should persist wishlist to localStorage when adding', async () => {
      const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });

      await waitFor(() => {
        // Check that data was persisted
        const saved = localStorage.getItem('tattva_wishlist');
        expect(saved).toBeTruthy();
        expect(JSON.parse(saved!)).toEqual([mockProduct1]);
      });
    });

    it('should persist wishlist to localStorage when removing', async () => {
      const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });
      await waitFor(() => expect(result.current.wishlistItems).toHaveLength(1));

      act(() => {
        result.current.toggleWishlist(mockProduct2);
      });
      await waitFor(
        () => {
          expect(result.current.wishlistItems).toHaveLength(2);
        },
        { timeout: 2000 }
      );

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });

      await waitFor(() => {
        const saved = localStorage.getItem('tattva_wishlist');
        expect(saved).toBeTruthy();
        expect(JSON.parse(saved!)).toEqual([mockProduct2]);
      });
    });
  });

  describe('isInWishlist', () => {
    it('should return true for product in wishlist', async () => {
      const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });

      await waitFor(() => {
        expect(result.current.isInWishlist(mockProduct1.id)).toBe(true);
      });
    });

    it('should return false for product not in wishlist', () => {
      const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

      expect(result.current.isInWishlist(mockProduct1.id)).toBe(false);
    });

    it('should return false after product is removed', async () => {
      const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });

      await waitFor(() => {
        expect(result.current.isInWishlist(mockProduct1.id)).toBe(true);
      });

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });

      await waitFor(() => {
        expect(result.current.isInWishlist(mockProduct1.id)).toBe(false);
      });
    });

    it('should correctly identify multiple products', async () => {
      const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });
      await waitFor(() => expect(result.current.isInWishlist(mockProduct1.id)).toBe(true));

      act(() => {
        result.current.toggleWishlist(mockProduct3);
      });
      await waitFor(() => {
        expect(result.current.isInWishlist(mockProduct1.id)).toBe(true);
        expect(result.current.isInWishlist(mockProduct2.id)).toBe(false);
        expect(result.current.isInWishlist(mockProduct3.id)).toBe(true);
      });
    });
  });

  describe('clearWishlist', () => {
    it('should remove all items from wishlist', async () => {
      const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });
      await waitFor(() => expect(result.current.wishlistItems).toHaveLength(1));

      act(() => {
        result.current.toggleWishlist(mockProduct2);
      });
      await waitFor(() => expect(result.current.wishlistItems).toHaveLength(2));

      act(() => {
        result.current.toggleWishlist(mockProduct3);
      });
      await waitFor(() => {
        expect(result.current.wishlistItems).toHaveLength(3);
      });

      act(() => {
        result.current.clearWishlist();
      });

      await waitFor(() => {
        expect(result.current.wishlistItems).toHaveLength(0);
        expect(result.current.wishlistItemCount).toBe(0);
      });
    });

    it('should persist empty wishlist to localStorage', async () => {
      const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });

      act(() => {
        result.current.clearWishlist();
      });

      await waitFor(() => {
        const saved = localStorage.getItem('tattva_wishlist');
        expect(saved).toBeTruthy();
        expect(JSON.parse(saved!)).toEqual([]);
      });
    });

    it('should work on already empty wishlist', async () => {
      const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

      act(() => {
        result.current.clearWishlist();
      });

      await waitFor(() => {
        expect(result.current.wishlistItems).toEqual([]);
      });
    });
  });

  describe('wishlistItemCount', () => {
    it('should return correct count of items', async () => {
      const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

      expect(result.current.wishlistItemCount).toBe(0);

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });
      await waitFor(() => {
        expect(result.current.wishlistItemCount).toBe(1);
      });

      act(() => {
        result.current.toggleWishlist(mockProduct2);
      });
      await waitFor(() => {
        expect(result.current.wishlistItemCount).toBe(2);
      });

      act(() => {
        result.current.toggleWishlist(mockProduct3);
      });
      await waitFor(() => {
        expect(result.current.wishlistItemCount).toBe(3);
      });
    });

    it('should update count when items are removed', async () => {
      const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });
      await waitFor(() => expect(result.current.wishlistItemCount).toBe(1));

      act(() => {
        result.current.toggleWishlist(mockProduct2);
      });
      await waitFor(() => {
        expect(result.current.wishlistItemCount).toBe(2);
      });

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });

      await waitFor(() => {
        expect(result.current.wishlistItemCount).toBe(1);
      });
    });

    it('should be 0 after clearing wishlist', async () => {
      const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });
      await waitFor(() => expect(result.current.wishlistItemCount).toBe(1));

      act(() => {
        result.current.toggleWishlist(mockProduct2);
      });
      await waitFor(() => {
        expect(result.current.wishlistItemCount).toBe(2);
      });

      act(() => {
        result.current.clearWishlist();
      });

      await waitFor(() => {
        expect(result.current.wishlistItemCount).toBe(0);
      });
    });
  });

  describe('LocalStorage Integration', () => {
    it('should handle localStorage errors gracefully when saving', async () => {
      const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const originalSetItem = localStorage.setItem;

      try {
        // Temporarily break setItem
        localStorage.setItem = jest.fn().mockImplementation(() => {
          throw new Error('Storage quota exceeded');
        });

        act(() => {
          result.current.toggleWishlist(mockProduct1);
        });

        // Current implementation requires storage to succeed for state update
        await waitFor(() => {
          expect(result.current.wishlistItems).toHaveLength(0);
        });
      } finally {
        consoleSpy.mockRestore();
        localStorage.setItem = originalSetItem;
      }
    });

    it('should persist complete wishlist state', async () => {
      const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });
      await waitFor(() => expect(result.current.wishlistItems).toHaveLength(1));

      act(() => {
        result.current.toggleWishlist(mockProduct2);
      });
      await waitFor(() => {
        // Check localStorage directly
        const saved = localStorage.getItem('tattva_wishlist');
        expect(saved).toBeTruthy();
        const savedData = JSON.parse(saved!);
        expect(savedData).toEqual([mockProduct1, mockProduct2]);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle toggling same product multiple times', async () => {
      const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });
      await waitFor(() => expect(result.current.wishlistItems).toHaveLength(1));

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });
      await waitFor(() => expect(result.current.wishlistItems).toHaveLength(0));

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });

      await waitFor(() => {
        expect(result.current.wishlistItems).toHaveLength(1);
        expect(result.current.isInWishlist(mockProduct1.id)).toBe(true);
      });
    });

    it('should maintain wishlist state across multiple operations', async () => {
      const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

      // Add items
      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });
      await waitFor(() => expect(result.current.wishlistItems).toHaveLength(1));

      act(() => {
        result.current.toggleWishlist(mockProduct2);
      });
      await waitFor(() => expect(result.current.wishlistItems).toHaveLength(2));

      act(() => {
        result.current.toggleWishlist(mockProduct3);
      });

      await waitFor(() => {
        expect(result.current.wishlistItems).toHaveLength(3);
      });

      // Remove one
      act(() => {
        result.current.toggleWishlist(mockProduct2);
      });

      await waitFor(() => {
        expect(result.current.wishlistItems).toHaveLength(2);
      });

      // Add it back
      act(() => {
        result.current.toggleWishlist(mockProduct2);
      });

      await waitFor(() => {
        expect(result.current.wishlistItems).toHaveLength(3);
        expect(result.current.isInWishlist(mockProduct1.id)).toBe(true);
        expect(result.current.isInWishlist(mockProduct2.id)).toBe(true);
        expect(result.current.isInWishlist(mockProduct3.id)).toBe(true);
      });
    });

    it('should handle product with same properties but different ID', async () => {
      const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });
      const similarProduct: Product = {
        ...mockProduct1,
        id: 999,
      };

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });
      await waitFor(() => expect(result.current.wishlistItems).toHaveLength(1));

      act(() => {
        result.current.toggleWishlist(similarProduct);
      });

      await waitFor(() => {
        expect(result.current.wishlistItems).toHaveLength(2);
        expect(result.current.isInWishlist(mockProduct1.id)).toBe(true);
        expect(result.current.isInWishlist(similarProduct.id)).toBe(true);
      });
    });
  });
});
