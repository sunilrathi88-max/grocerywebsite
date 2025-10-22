import { useState, useEffect, useCallback } from 'react';
import { Product, Review, QnA } from '../types';
import { productAPI } from '../utils/apiService';
import { MOCK_PRODUCTS } from '../data';

interface UseProductsOptions {
  useMockData?: boolean; // Toggle between API and mock data
  autoFetch?: boolean;
}

interface UseProductsReturn {
  products: Product[];
  isLoading: boolean;
  error: { message: string; code?: string; status?: number } | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product | null>;
  updateProduct: (id: number, updates: Partial<Product>) => Promise<Product | null>;
  deleteProduct: (id: number) => Promise<boolean>;
  addReview: (productId: number, review: Review) => Promise<void>;
  addQuestion: (productId: number, question: QnA) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

/**
 * Custom hook for managing products with API integration
 * Falls back to mock data when useMockData is true or API fails
 */
export const useProducts = (options: UseProductsOptions = {}): UseProductsReturn => {
  const { useMockData = false, autoFetch = true } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<{ message: string; code?: string; status?: number } | null>(
    null
  );

  /**
   * Fetch products from API or use mock data
   */
  const fetchProducts = useCallback(async () => {
    if (useMockData) {
      // Use mock data immediately
      setProducts(MOCK_PRODUCTS);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await productAPI.getAll();
      setProducts(data);
    } catch (err) {
      // Fallback to mock data on error
      console.error('Failed to fetch products from API, using mock data:', err);
      setProducts(MOCK_PRODUCTS);
      setError({
        message: err instanceof Error ? err.message : 'Failed to fetch products',
        code: (err as { code?: string }).code,
        status: (err as { status?: number }).status,
      });
    } finally {
      setIsLoading(false);
    }
  }, [useMockData]);

  /**
   * Add a new product (admin function)
   */
  const addProduct = useCallback(
    async (product: Omit<Product, 'id'>): Promise<Product | null> => {
      if (useMockData) {
        // Mock mode: generate ID and add locally
        const newProduct: Product = {
          ...product,
          id: Date.now(), // Generate numeric ID
        };
        setProducts((prev) => [...prev, newProduct]);
        return newProduct;
      }

      setIsLoading(true);
      try {
        const newProduct = await productAPI.create(product);
        setProducts((prev) => [...prev, newProduct]);
        return newProduct;
      } catch (err) {
        console.error('Failed to add product:', err);
        setError({
          message: err instanceof Error ? err.message : 'Failed to add product',
          code: (err as { code?: string }).code,
          status: (err as { status?: number }).status,
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [useMockData]
  );

  /**
   * Update an existing product (admin function)
   */
  const updateProduct = useCallback(
    async (id: number, updates: Partial<Product>): Promise<Product | null> => {
      if (useMockData) {
        // Mock mode: update locally
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
        );
        return products.find((p) => p.id === id) || null;
      }

      setIsLoading(true);
      try {
        const updatedProduct = await productAPI.update(id, updates);
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? updatedProduct : p))
        );
        return updatedProduct;
      } catch (err) {
        console.error('Failed to update product:', err);
        setError({
          message: err instanceof Error ? err.message : 'Failed to update product',
          code: (err as { code?: string }).code,
          status: (err as { status?: number }).status,
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [useMockData, products]
  );

  /**
   * Delete a product (admin function)
   */
  const deleteProduct = useCallback(
    async (id: number): Promise<boolean> => {
      if (useMockData) {
        // Mock mode: delete locally
        setProducts((prev) => prev.filter((p) => p.id !== id));
        return true;
      }

      setIsLoading(true);
      try {
        await productAPI.delete(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        return true;
      } catch (err) {
        console.error('Failed to delete product:', err);
        setError({
          message: err instanceof Error ? err.message : 'Failed to delete product',
          code: (err as { code?: string }).code,
          status: (err as { status?: number }).status,
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [useMockData]
  );

  /**
   * Add a review to a product
   */
  const addReview = useCallback(
    async (productId: number, review: Review): Promise<void> => {
      if (useMockData) {
        // Mock mode: update product locally
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, reviews: [...p.reviews, review] } : p
          )
        );
        return;
      }

      try {
        await productAPI.addReview(productId, review);
        // Refresh the specific product
        const updatedProduct = await productAPI.getById(productId);
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? updatedProduct : p))
        );
      } catch (err) {
        console.error('Failed to add review:', err);
        throw err;
      }
    },
    [useMockData]
  );

  /**
   * Add a question to a product
   */
  const addQuestion = useCallback(
    async (productId: number, question: QnA): Promise<void> => {
      if (useMockData) {
        // Mock mode: update product locally
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, qna: [...p.qna, question] } : p
          )
        );
        return;
      }

      try {
        await productAPI.addQuestion(productId, question);
        // Refresh the specific product
        const updatedProduct = await productAPI.getById(productId);
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? updatedProduct : p))
        );
      } catch (err) {
        console.error('Failed to add question:', err);
        throw err;
      }
    },
    [useMockData]
  );

  /**
   * Refresh products (force re-fetch)
   */
  const refreshProducts = useCallback(async () => {
    await fetchProducts();
  }, [fetchProducts]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, [autoFetch, fetchProducts]);

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    addReview,
    addQuestion,
    refreshProducts,
  };
};
