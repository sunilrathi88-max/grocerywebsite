import { useState, useCallback, useEffect } from 'react';
import { Product } from '../types';

export interface UseWishlistReturn {
  wishlistItems: Product[];
  wishlistItemCount: number;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
}

const WISHLIST_STORAGE_KEY = 'tattva_wishlist';

/**
 * Custom hook for managing wishlist state with localStorage persistence
 *
 * @returns {UseWishlistReturn} Wishlist state and methods
 *
 * @example
 * const { wishlistItems, toggleWishlist, isInWishlist } = useWishlist();
 * toggleWishlist(product);
 */
export const useWishlist = (): UseWishlistReturn => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>(() => {
    // Initialize from localStorage
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
      } catch (_error) {
        console.error('Failed to load wishlist from localStorage:', _error);
        return [];
      }
    }
    return [];
  });

  /**
   * Persist wishlist to localStorage whenever it changes
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
      } catch (_error) {
        console.error('Failed to save wishlist to localStorage:', _error);
      }
    }
  }, [wishlistItems]);

  /**
   * Get count of items in wishlist
   */
  const wishlistItemCount = wishlistItems.length;

  /**
   * Toggle product in wishlist (add if not present, remove if present)
   */
  const toggleWishlist = useCallback((product: Product) => {
    setWishlistItems((prev) => {
      const isPresent = prev.some((item) => item.id === product.id);

      if (isPresent) {
        // Remove from wishlist
        return prev.filter((item) => item.id !== product.id);
      } else {
        // Add to wishlist
        return [...prev, product];
      }
    });
  }, []);

  /**
   * Check if a product is in the wishlist
   */
  const isInWishlist = useCallback(
    (productId: number): boolean => {
      return wishlistItems.some((item) => item.id === productId);
    },
    [wishlistItems]
  );

  /**
   * Clear all items from wishlist
   */
  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
  }, []);

  return {
    wishlistItems,
    wishlistItemCount,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
  };
};
