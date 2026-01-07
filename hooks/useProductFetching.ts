import { useState, useEffect } from 'react';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
}

interface UseProductsOptions {
  category?: string;
  sortBy?: 'popular' | 'price' | 'rating' | 'new';
  filters?: Record<string, string[] | string>;
}

export const useProductFetching = (options?: UseProductsOptions) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Note: This endpoint might not exist in the current setup, standardizing on what user asked.
        const response = await axios.get('/api/products', { params: options });
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [options]);

  return { products, loading, error };
};

export default useProductFetching;
