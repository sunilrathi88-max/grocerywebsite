import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types';

const HISTORY_KEY = 'tattva_viewing_history';
const MAX_HISTORY = 6;

export const useViewingHistory = () => {
  const [viewedProducts, setViewedProducts] = useState<Product[]>([]);

  // Load history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) {
        setViewedProducts(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load viewing history', e);
    }
  }, []);

  const addToHistory = useCallback((product: Product) => {
    setViewedProducts((prev) => {
      // Remove if already exists to move to top
      const filtered = prev.filter((p) => p.id !== product.id);
      // Add to front
      const newHistory = [product, ...filtered].slice(0, MAX_HISTORY);

      // Save to local storage
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      } catch (e) {
        console.error('Failed to save viewing history', e);
      }

      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setViewedProducts([]);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  return { viewedProducts, addToHistory, clearHistory };
};
