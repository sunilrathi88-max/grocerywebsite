import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
 * Custom hook for managing wishlist state with localStorage persistence via React Query
 */
export const useWishlist = (): UseWishlistReturn => {
  const queryClient = useQueryClient();

  const { data: wishlistItems = [] } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      if (typeof window === 'undefined') return [];
      try {
        const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
        return saved ? (JSON.parse(saved) as Product[]) : [];
      } catch (error) {
        console.error('Failed to load wishlist:', error);
        return [];
      }
    },
    staleTime: Infinity, // Local data doesn't expire unless we mutate it
  });

  const updateWishlistMutation = useMutation({
    mutationFn: async (newWishlist: Product[]) => {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newWishlist));
      return newWishlist;
    },
    onSuccess: (newWishlist) => {
      queryClient.setQueryData(['wishlist'], newWishlist);
    },
  });

  const toggleWishlist = (product: Product) => {
    const isPresent = wishlistItems.some((item) => item.id === product.id);
    let newWishlist: Product[];

    if (isPresent) {
      newWishlist = wishlistItems.filter((item) => item.id !== product.id);
    } else {
      newWishlist = [...wishlistItems, product];
    }
    updateWishlistMutation.mutate(newWishlist);
  };

  const isInWishlist = (productId: number) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const clearWishlist = () => {
    updateWishlistMutation.mutate([]);
  };

  return {
    wishlistItems,
    wishlistItemCount: wishlistItems.length,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
  };
};
