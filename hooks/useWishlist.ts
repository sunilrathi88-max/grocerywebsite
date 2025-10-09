import { useState, useMemo, useCallback } from 'react';
import { Product } from '../types';

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist(prevWishlist => {
      const isInWishlist = prevWishlist.some(item => item.id === product.id);
      if (isInWishlist) {
        return prevWishlist.filter(item => item.id !== product.id);
      } else {
        return [...prevWishlist, product];
      }
    });
  }, []);

  const wishlistedIds = useMemo(() => new Set(wishlist.map(p => p.id)), [wishlist]);

  return {
    wishlist,
    toggleWishlist,
    wishlistedIds,
  };
};
