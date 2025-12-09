import { useMemo } from 'react';
import { Product } from '../types';

export interface FilterOptions {
  category: string;
  searchQuery: string;
  priceRange?: [number, number];
  minRating?: number;
  inStockOnly?: boolean;
  sortBy?: 'name' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  origin?: string[];
  heatLevel?: string[];
  cuisine?: string[];
  size?: string[];
  grind?: string[];
  grade?: string[];
  showOnSale?: boolean;
  tags?: string[];
}

export interface UseProductFilterReturn {
  filteredProducts: Product[];
  productCount: number;
}

/**
 * Custom hook for filtering and sorting products
 *
 * @param products - Array of products to filter
 * @param filters - Filter options object
 * @returns {UseProductFilterReturn} Filtered products and count
 *
 * @example
 * const { filteredProducts, productCount } = useProductFilter(allProducts, {
 *   category: 'Spices',
 *   minRating: 4,
 *   sortBy: 'price-asc'
 * });
 */
export const useProductFilter = (
  products: Product[],
  filters: FilterOptions
): UseProductFilterReturn => {
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (filters.category && filters.category !== 'All') {
      result = result.filter((product) => product.category === filters.category);
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by price range
    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange;
      result = result.filter((product) => {
        // Check if ANY variant falls within the price range
        return product.variants.some((variant) => {
          const price = variant.salePrice ?? variant.price;
          return price >= minPrice && price <= maxPrice;
        });
      });
    }

    // Filter by minimum rating
    if (filters.minRating !== undefined) {
      result = result.filter((product) => {
        const avgRating =
          product.reviews.length > 0
            ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
            : 0;
        return avgRating >= filters.minRating!;
      });
    }

    // Filter by stock availability
    if (filters.inStockOnly) {
      result = result.filter((product) => product.variants.some((variant) => variant.stock > 0));
    }

    // Filter by On Sale
    if (filters.showOnSale) {
      result = result.filter((product) =>
        product.variants.some((variant) => variant.salePrice && variant.salePrice < variant.price)
      );
    }

    // Filter by Tags (Generic)
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter((product) =>
        filters.tags?.every((tag) => product.tags?.includes(tag))
      );
    }

    // Filter by Origin
    if (filters.origin && filters.origin.length > 0) {
      result = result.filter(
        (product) => product.origin && filters.origin?.includes(product.origin)
      );
    }

    // Filter by Heat Level (Tags)
    if (filters.heatLevel && filters.heatLevel.length > 0) {
      result = result.filter((product) =>
        product.tags?.some((tag) => filters.heatLevel?.includes(tag))
      );
    }

    // Filter by Cuisine (Tags)
    if (filters.cuisine && filters.cuisine.length > 0) {
      result = result.filter((product) =>
        product.tags?.some((tag) => filters.cuisine?.includes(tag))
      );
    }

    // Filter by Size (Variants)
    if (filters.size && filters.size.length > 0) {
      result = result.filter((product) =>
        product.variants.some((variant) => filters.size?.includes(variant.name))
      );
    }

    // Filter by Grind
    if (filters.grind && filters.grind.length > 0) {
      result = result.filter((product) => product.grind && filters.grind?.includes(product.grind));
    }

    // Filter by Grade
    if (filters.grade && filters.grade.length > 0) {
      result = result.filter((product) => product.grade && filters.grade?.includes(product.grade));
    }

    // Sort products
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'name':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'price-asc':
          result.sort((a, b) => {
            // For ascending sort, use the lowest price available for the product
            const minPriceA = Math.min(...a.variants.map((v) => v.salePrice ?? v.price));
            const minPriceB = Math.min(...b.variants.map((v) => v.salePrice ?? v.price));
            return minPriceA - minPriceB;
          });
          break;
        case 'price-desc':
          result.sort((a, b) => {
            // For descending sort, use the highest price available for the product
            const maxPriceA = Math.max(...a.variants.map((v) => v.salePrice ?? v.price));
            const maxPriceB = Math.max(...b.variants.map((v) => v.salePrice ?? v.price));
            return maxPriceB - maxPriceA;
          });
          break;
        case 'rating':
          result.sort((a, b) => {
            const ratingA =
              a.reviews.length > 0
                ? a.reviews.reduce((sum, r) => sum + r.rating, 0) / a.reviews.length
                : 0;
            const ratingB =
              b.reviews.length > 0
                ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length
                : 0;
            return ratingB - ratingA;
          });
          break;
        case 'newest':
          result.sort((a, b) => b.id - a.id);
          break;
      }
    }

    return result;
  }, [products, filters]);

  return {
    filteredProducts,
    productCount: filteredProducts.length,
  };
};

/**
 * Get unique categories from products
 */
export const useCategories = (products: Product[]): string[] => {
  return useMemo(() => {
    const categories = products.map((p) => p.category);
    return ['All', ...Array.from(new Set(categories))];
  }, [products]);
};

/**
 * Get price range from products
 */
export const usePriceRange = (products: Product[]): [number, number] => {
  return useMemo(() => {
    if (products.length === 0) return [0, 100];

    const allPrices = products.flatMap((p) => p.variants.map((v) => v.salePrice ?? v.price));
    const minPrice = Math.floor(Math.min(...allPrices));
    const maxPrice = Math.ceil(Math.max(...allPrices));

    return [minPrice, maxPrice];
  }, [products]);
};
