import { renderHook, act } from '@testing-library/react';
import { useWishlist } from '../useWishlist';
import { Product } from '../../types';

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
      const { result } = renderHook(() => useWishlist());

      expect(result.current.wishlistItems).toEqual([]);
      expect(result.current.wishlistItemCount).toBe(0);
    });

    it('should load wishlist from localStorage on initialization', () => {
      const savedWishlist = [mockProduct1, mockProduct2];
      // Set up localStorage before creating the hook
      localStorage.setItem('tattva_wishlist', JSON.stringify(savedWishlist));

      const { result } = renderHook(() => useWishlist());

      expect(result.current.wishlistItems).toEqual(savedWishlist);
      expect(result.current.wishlistItemCount).toBe(2);
    });

    it('should handle invalid JSON in localStorage gracefully', () => {
      // Temporarily override getItem to return invalid JSON
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = jest.fn().mockReturnValue('invalid json');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useWishlist());

      // Should initialize with empty array and not crash
      expect(result.current.wishlistItems).toEqual([]);
      // Console.error might or might not be called depending on JSON.parse error handling
      
      consoleSpy.mockRestore();
      localStorage.getItem = originalGetItem;
    });

    it('should initialize empty wishlist when localStorage is empty', () => {
      // localStorage is already clear from beforeEach
      const { result } = renderHook(() => useWishlist());

      expect(result.current.wishlistItems).toEqual([]);
    });
  });

  describe('toggleWishlist', () => {
    it('should add product to wishlist when not present', () => {
      const { result } = renderHook(() => useWishlist());

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });

      expect(result.current.wishlistItems).toHaveLength(1);
      expect(result.current.wishlistItems[0]).toEqual(mockProduct1);
    });

    it('should remove product from wishlist when already present', () => {
      const { result } = renderHook(() => useWishlist());

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });

      expect(result.current.wishlistItems).toHaveLength(1);

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });

      expect(result.current.wishlistItems).toHaveLength(0);
    });

    it('should add multiple products to wishlist', () => {
      const { result } = renderHook(() => useWishlist());

      act(() => {
        result.current.toggleWishlist(mockProduct1);
        result.current.toggleWishlist(mockProduct2);
        result.current.toggleWishlist(mockProduct3);
      });

      expect(result.current.wishlistItems).toHaveLength(3);
      expect(result.current.wishlistItems).toEqual([
        mockProduct1,
        mockProduct2,
        mockProduct3,
      ]);
    });

    it('should only remove specified product', () => {
      const { result } = renderHook(() => useWishlist());

      act(() => {
        result.current.toggleWishlist(mockProduct1);
        result.current.toggleWishlist(mockProduct2);
        result.current.toggleWishlist(mockProduct3);
      });

      act(() => {
        result.current.toggleWishlist(mockProduct2);
      });

      expect(result.current.wishlistItems).toHaveLength(2);
      expect(result.current.wishlistItems).toEqual([mockProduct1, mockProduct3]);
    });

    it('should persist wishlist to localStorage when adding', () => {
      const { result } = renderHook(() => useWishlist());

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });

      // Check that data was persisted
      const saved = localStorage.getItem('tattva_wishlist');
      expect(saved).toBeTruthy();
      expect(JSON.parse(saved!)).toEqual([mockProduct1]);
    });

    it('should persist wishlist to localStorage when removing', () => {
      const { result } = renderHook(() => useWishlist());

      act(() => {
        result.current.toggleWishlist(mockProduct1);
        result.current.toggleWishlist(mockProduct2);
      });

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });

      const saved = localStorage.getItem('tattva_wishlist');
      expect(saved).toBeTruthy();
      expect(JSON.parse(saved!)).toEqual([mockProduct2]);
    });
  });

  describe('isInWishlist', () => {
    it('should return true for product in wishlist', () => {
      const { result } = renderHook(() => useWishlist());

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });

      expect(result.current.isInWishlist(mockProduct1.id)).toBe(true);
    });

    it('should return false for product not in wishlist', () => {
      const { result } = renderHook(() => useWishlist());

      expect(result.current.isInWishlist(mockProduct1.id)).toBe(false);
    });

    it('should return false after product is removed', () => {
      const { result } = renderHook(() => useWishlist());

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });

      expect(result.current.isInWishlist(mockProduct1.id)).toBe(true);

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });

      expect(result.current.isInWishlist(mockProduct1.id)).toBe(false);
    });

    it('should correctly identify multiple products', () => {
      const { result } = renderHook(() => useWishlist());

      act(() => {
        result.current.toggleWishlist(mockProduct1);
        result.current.toggleWishlist(mockProduct3);
      });

      expect(result.current.isInWishlist(mockProduct1.id)).toBe(true);
      expect(result.current.isInWishlist(mockProduct2.id)).toBe(false);
      expect(result.current.isInWishlist(mockProduct3.id)).toBe(true);
    });
  });

  describe('clearWishlist', () => {
    it('should remove all items from wishlist', () => {
      const { result } = renderHook(() => useWishlist());

      act(() => {
        result.current.toggleWishlist(mockProduct1);
        result.current.toggleWishlist(mockProduct2);
        result.current.toggleWishlist(mockProduct3);
      });

      expect(result.current.wishlistItems).toHaveLength(3);

      act(() => {
        result.current.clearWishlist();
      });

      expect(result.current.wishlistItems).toHaveLength(0);
      expect(result.current.wishlistItemCount).toBe(0);
    });

    it('should persist empty wishlist to localStorage', () => {
      const { result } = renderHook(() => useWishlist());

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });

      act(() => {
        result.current.clearWishlist();
      });

      const saved = localStorage.getItem('tattva_wishlist');
      expect(saved).toBeTruthy();
      expect(JSON.parse(saved!)).toEqual([]);
    });

    it('should work on already empty wishlist', () => {
      const { result } = renderHook(() => useWishlist());

      act(() => {
        result.current.clearWishlist();
      });

      expect(result.current.wishlistItems).toEqual([]);
    });
  });

  describe('wishlistItemCount', () => {
    it('should return correct count of items', () => {
      const { result } = renderHook(() => useWishlist());

      expect(result.current.wishlistItemCount).toBe(0);

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });

      expect(result.current.wishlistItemCount).toBe(1);

      act(() => {
        result.current.toggleWishlist(mockProduct2);
        result.current.toggleWishlist(mockProduct3);
      });

      expect(result.current.wishlistItemCount).toBe(3);
    });

    it('should update count when items are removed', () => {
      const { result } = renderHook(() => useWishlist());

      act(() => {
        result.current.toggleWishlist(mockProduct1);
        result.current.toggleWishlist(mockProduct2);
      });

      expect(result.current.wishlistItemCount).toBe(2);

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });

      expect(result.current.wishlistItemCount).toBe(1);
    });

    it('should be 0 after clearing wishlist', () => {
      const { result } = renderHook(() => useWishlist());

      act(() => {
        result.current.toggleWishlist(mockProduct1);
        result.current.toggleWishlist(mockProduct2);
      });

      act(() => {
        result.current.clearWishlist();
      });

      expect(result.current.wishlistItemCount).toBe(0);
    });
  });

  describe('LocalStorage Integration', () => {
    it('should handle localStorage errors gracefully when saving', () => {
      const { result } = renderHook(() => useWishlist());
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Temporarily break setItem
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn().mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      act(() => {
        result.current.toggleWishlist(mockProduct1);
      });

      // Should not crash - wishlist state should still update in memory
      expect(result.current.wishlistItems).toHaveLength(1);
      // Console.error might be called depending on error handling
      
      consoleSpy.mockRestore();
      localStorage.setItem = originalSetItem;
    });

    it('should persist complete wishlist state', () => {
      const { result } = renderHook(() => useWishlist());

      act(() => {
        result.current.toggleWishlist(mockProduct1);
        result.current.toggleWishlist(mockProduct2);
      });

      // Check localStorage directly
      const saved = localStorage.getItem('tattva_wishlist');
      expect(saved).toBeTruthy();
      const savedData = JSON.parse(saved!);
      expect(savedData).toEqual([mockProduct1, mockProduct2]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle toggling same product multiple times', () => {
      const { result } = renderHook(() => useWishlist());

      act(() => {
        result.current.toggleWishlist(mockProduct1);
        result.current.toggleWishlist(mockProduct1);
        result.current.toggleWishlist(mockProduct1);
      });

      expect(result.current.wishlistItems).toHaveLength(1);
      expect(result.current.isInWishlist(mockProduct1.id)).toBe(true);
    });

    it('should maintain wishlist state across multiple operations', () => {
      const { result } = renderHook(() => useWishlist());

      // Add items
      act(() => {
        result.current.toggleWishlist(mockProduct1);
        result.current.toggleWishlist(mockProduct2);
        result.current.toggleWishlist(mockProduct3);
      });

      // Remove one
      act(() => {
        result.current.toggleWishlist(mockProduct2);
      });

      // Add it back
      act(() => {
        result.current.toggleWishlist(mockProduct2);
      });

      expect(result.current.wishlistItems).toHaveLength(3);
      expect(result.current.isInWishlist(mockProduct1.id)).toBe(true);
      expect(result.current.isInWishlist(mockProduct2.id)).toBe(true);
      expect(result.current.isInWishlist(mockProduct3.id)).toBe(true);
    });

    it('should handle product with same properties but different ID', () => {
      const { result } = renderHook(() => useWishlist());
      const similarProduct: Product = {
        ...mockProduct1,
        id: 999,
      };

      act(() => {
        result.current.toggleWishlist(mockProduct1);
        result.current.toggleWishlist(similarProduct);
      });

      expect(result.current.wishlistItems).toHaveLength(2);
      expect(result.current.isInWishlist(mockProduct1.id)).toBe(true);
      expect(result.current.isInWishlist(similarProduct.id)).toBe(true);
    });
  });
});
