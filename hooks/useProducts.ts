import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, Review, QnA } from '../types';
import { productAPI } from '../utils/apiService';
import { MOCK_PRODUCTS } from '../data';

interface UseProductsOptions {
  useMockData?: boolean; // Toggle between API and mock data
  autoFetch?: boolean; // Kept for backward compatibility, but React Query handles this via 'enabled'
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
 * Custom hook for managing products with API integration using React Query
 */
export const useProducts = (options: UseProductsOptions = {}): UseProductsReturn => {
  const { useMockData = false, autoFetch = true } = options;
  const queryClient = useQueryClient();

  // --- Queries ---

  const {
    data: products = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      if (useMockData) {
        return MOCK_PRODUCTS;
      }
      try {
        return await productAPI.getAll();
      } catch (err) {
        // Log error and rethrow or handle fallback
        console.error('Failed to fetch products from API:', err);
        throw err;
      }
    },
    enabled: autoFetch,
    initialData: useMockData ? MOCK_PRODUCTS : undefined,
    // If mock data is used, we might wan to prevent refetching
    staleTime: useMockData ? Infinity : 1000 * 60 * 5, // 5 mins
  });

  // Map React Query error to our custom error format
  const error = queryError
    ? {
        message: queryError instanceof Error ? queryError.message : 'Failed to fetch products',
      }
    : null;

  // --- Mutations ---

  const addProductMutation = useMutation({
    mutationFn: async (product: Omit<Product, 'id'>) => {
      if (useMockData) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        const newProduct: Product = { ...product, id: Date.now() };
        // We can't easily persist to MOCK_PRODUCTS import, so we'd normally update cache
        return newProduct;
      }
      return await productAPI.create(product);
    },
    onSuccess: (newProduct) => {
      // Optimistically update or invalidate
      if (useMockData) {
        queryClient.setQueryData(['products'], (old: Product[] = []) => [...old, newProduct]);
      } else {
        queryClient.invalidateQueries({ queryKey: ['products'] });
      }
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Product> }) => {
      if (useMockData) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        // Return a mock updated product (incomplete, but sufficient for strict types if careful)
        // In reality, we need the old product to merge.
        // For mock mode, let's just assume we return the merged result by finding it first?
        // Simpler: Just return the updates merged with a "fake" base if needed, or trust the API contract.
        // Actually, let's find it in cache for better mock behavior
        const current = queryClient.getQueryData<Product[]>(['products'])?.find((p) => p.id === id);
        if (!current) throw new Error('Product not found in mock cache');
        return { ...current, ...updates };
      }
      return await productAPI.update(id, updates);
    },
    onSuccess: (updatedProduct) => {
      if (useMockData && updatedProduct) {
        queryClient.setQueryData(['products'], (old: Product[] = []) =>
          old.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
        );
      } else {
        queryClient.invalidateQueries({ queryKey: ['products'] });
      }
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      if (useMockData) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return true;
      }
      await productAPI.delete(id);
      return true;
    },
    onSuccess: (_, id) => {
      if (useMockData) {
        queryClient.setQueryData(['products'], (old: Product[] = []) =>
          old.filter((p) => p.id !== id)
        );
      } else {
        queryClient.invalidateQueries({ queryKey: ['products'] });
      }
    },
  });

  const addReviewMutation = useMutation({
    mutationFn: async ({ productId, review }: { productId: number; review: Review }) => {
      if (useMockData) {
        // Mock update cache directly in onSuccess
        return;
      }
      await productAPI.addReview(productId, review);
    },
    onSuccess: (_, { productId, review }) => {
      if (useMockData) {
        queryClient.setQueryData(['products'], (old: Product[] = []) =>
          old.map((p) => (p.id === productId ? { ...p, reviews: [...p.reviews, review] } : p))
        );
      } else {
        queryClient.invalidateQueries({ queryKey: ['products'] });
      }
    },
  });

  const addQuestionMutation = useMutation({
    mutationFn: async ({ productId, question }: { productId: number; question: QnA }) => {
      if (useMockData) return;
      await productAPI.addQuestion(productId, question);
    },
    onSuccess: (_, { productId, question }) => {
      if (useMockData) {
        queryClient.setQueryData(['products'], (old: Product[] = []) =>
          old.map((p) => (p.id === productId ? { ...p, qna: [...p.qna, question] } : p))
        );
      } else {
        queryClient.invalidateQueries({ queryKey: ['products'] });
      }
    },
  });

  // --- Interface Implementation ---

  const fetchProducts = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const addProduct = useCallback(
    async (product: Omit<Product, 'id'>) => {
      try {
        return await addProductMutation.mutateAsync(product);
      } catch (e) {
        console.error(e);
        return null;
      }
    },
    [addProductMutation]
  );

  const updateProduct = useCallback(
    async (id: number, updates: Partial<Product>) => {
      try {
        return await updateProductMutation.mutateAsync({ id, updates });
      } catch (e) {
        console.error(e);
        return null;
      }
    },
    [updateProductMutation]
  );

  const deleteProduct = useCallback(
    async (id: number) => {
      try {
        return await deleteProductMutation.mutateAsync(id);
      } catch (e) {
        console.error(e);
        return false;
      }
    },
    [deleteProductMutation]
  );

  const addReview = useCallback(
    async (productId: number, review: Review) => {
      await addReviewMutation.mutateAsync({ productId, review });
    },
    [addReviewMutation]
  );

  const addQuestion = useCallback(
    async (productId: number, question: QnA) => {
      await addQuestionMutation.mutateAsync({ productId, question });
    },
    [addQuestionMutation]
  );

  const refreshProducts = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['products'] });
  }, [queryClient]);

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
