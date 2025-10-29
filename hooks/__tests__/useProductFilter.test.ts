import { renderHook } from '@testing-library/react';
import { useProductFilter, useCategories, usePriceRange, FilterOptions } from '../useProductFilter';
import { Product } from '../../types';

describe('useProductFilter', () => {
  // Mock product data
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Premium Saffron',
      description: 'Finest quality saffron from Kashmir',
      category: 'Spices',
      images: ['/images/products/saffron-1.svg'],
      variants: [{ id: 1, name: '5g', price: 2999, salePrice: 2499, stock: 10 }],
      reviews: [
        { id: 1, author: 'John', rating: 5, comment: 'Excellent!' },
        { id: 2, author: 'Jane', rating: 4, comment: 'Good quality' },
      ],
      tags: ['organic', 'premium', 'kashmiri'],
    },
    {
      id: 2,
      name: 'Black Pepper',
      description: 'Organic black pepper powder',
      category: 'Spices',
      images: ['/images/products/pepper-1.svg'],
      variants: [{ id: 2, name: '100g', price: 299, salePrice: 249, stock: 25 }],
      reviews: [{ id: 3, author: 'Bob', rating: 5, comment: 'Great!' }],
      tags: ['organic', 'fresh'],
    },
    {
      id: 3,
      name: 'Turmeric Powder',
      description: 'Pure turmeric powder for health',
      category: 'Spices',
      images: ['/images/products/turmeric-1.svg'],
      variants: [{ id: 3, name: '200g', price: 199, stock: 0 }], // Out of stock
      reviews: [
        { id: 4, author: 'Alice', rating: 3, comment: 'OK' },
        { id: 5, author: 'Charlie', rating: 4, comment: 'Good' },
      ],
      tags: ['natural', 'health'],
    },
    {
      id: 4,
      name: 'Basmati Rice',
      description: 'Premium basmati rice',
      category: 'Grains',
      images: ['/images/products/rice-1.svg'],
      variants: [{ id: 4, name: '1kg', price: 599, salePrice: 499, stock: 50 }],
      reviews: [],
      tags: ['premium', 'aromatic'],
    },
    {
      id: 5,
      name: 'Organic Honey',
      description: 'Pure organic honey',
      category: 'Sweeteners',
      images: ['/images/products/honey-1.svg'],
      variants: [{ id: 5, name: '500g', price: 799, stock: 15 }],
      reviews: [
        { id: 6, author: 'Dave', rating: 5, comment: 'Perfect!' },
        { id: 7, author: 'Eve', rating: 5, comment: 'Loved it!' },
        { id: 8, author: 'Frank', rating: 5, comment: 'Amazing!' },
      ],
      tags: ['organic', 'natural', 'raw'],
    },
    {
      id: 6,
      name: 'Ginger Powder',
      description: 'Aromatic ginger powder',
      category: 'Spices',
      images: ['/images/products/ginger-1.svg'],
      variants: [
        { id: 6, name: '50g', price: 250, stock: 30 },
        { id: 7, name: '250g', price: 900, stock: 15 },
        { id: 8, name: '1kg', price: 3200, salePrice: 2800, stock: 5 },
      ],
      reviews: [],
      tags: ['natural', 'fresh'],
    },
  ];

  describe('Multi-Variant Product Filtering', () => {
    it('should include a product if any of its variants are within the price range', () => {
      const filters: FilterOptions = {
        category: 'All',
        searchQuery: '',
        priceRange: [800, 1000],
      };

      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      // Current buggy implementation will fail this test
      // It checks only the first variant (price: 250), so Ginger Powder is excluded.
      // The correct implementation should check all variants and include it because of the 250g variant (price: 900).
      const names = result.current.filteredProducts.map((p) => p.name);
      expect(names).toContain('Ginger Powder');
      expect(names).not.toContain('Organic Honey'); // price: 799 - should be out of range
    });

    it('should sort multi-variant products based on their lowest price', () => {
      const filters: FilterOptions = {
        category: 'All',
        searchQuery: '',
        sortBy: 'price-asc',
      };

      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      const names = result.current.filteredProducts.map((p) => p.name);

      // Current buggy implementation will use the first variant's price (250) for Ginger Powder.
      // This will place it incorrectly before Black Pepper (salePrice: 249).
      const indexOfGinger = names.indexOf('Ginger Powder');
      const indexOfPepper = names.indexOf('Black Pepper');
      expect(indexOfGinger).toBeGreaterThan(indexOfPepper);
    });
  });

  describe('Basic Filtering', () => {
    it('should return all products when no filters applied', () => {
      const filters: FilterOptions = {
        category: 'All',
        searchQuery: '',
      };

      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(5);
      expect(result.current.productCount).toBe(5);
    });

    it('should filter by category', () => {
      const filters: FilterOptions = {
        category: 'Spices',
        searchQuery: '',
      };

      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(3);
      expect(result.current.filteredProducts.every((p) => p.category === 'Spices')).toBe(true);
    });

    it('should return all products when category is "All"', () => {
      const filters: FilterOptions = {
        category: 'All',
        searchQuery: '',
      };

      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(5);
    });

    it('should filter by search query in name', () => {
      const filters: FilterOptions = {
        category: 'All',
        searchQuery: 'saffron',
      };

      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(1);
      expect(result.current.filteredProducts[0].name).toBe('Premium Saffron');
    });

    it('should filter by search query in description', () => {
      const filters: FilterOptions = {
        category: 'All',
        searchQuery: 'health',
      };

      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(1);
      expect(result.current.filteredProducts[0].name).toBe('Turmeric Powder');
    });

    it('should filter by search query in tags', () => {
      const filters: FilterOptions = {
        category: 'All',
        searchQuery: 'organic',
      };

      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(3);
    });

    it('should be case-insensitive for search', () => {
      const filters: FilterOptions = {
        category: 'All',
        searchQuery: 'SAFFRON',
      };

      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(1);
    });
  });

  describe('Price Range Filtering', () => {
    it('should filter by price range', () => {
      const filters: FilterOptions = {
        category: 'All',
        searchQuery: '',
        priceRange: [200, 500],
      };

      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      // Black Pepper (249), Basmati (499) - Turmeric is out of range (199 < 200)
      expect(result.current.filteredProducts).toHaveLength(2);
      const names = result.current.filteredProducts.map((p) => p.name);
      expect(names).toContain('Black Pepper');
      expect(names).toContain('Basmati Rice');
    });

    it('should use salePrice when available for price filtering', () => {
      const filters: FilterOptions = {
        category: 'All',
        searchQuery: '',
        priceRange: [2400, 2500],
      };

      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(1);
      expect(result.current.filteredProducts[0].name).toBe('Premium Saffron');
    });

    it('should handle exact price boundaries', () => {
      const filters: FilterOptions = {
        category: 'All',
        searchQuery: '',
        priceRange: [249, 249],
      };

      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(1);
      expect(result.current.filteredProducts[0].name).toBe('Black Pepper');
    });
  });

  describe('Rating Filtering', () => {
    it('should filter by minimum rating', () => {
      const filters: FilterOptions = {
        category: 'All',
        searchQuery: '',
        minRating: 4.5,
      };

      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      // Premium Saffron (4.5), Black Pepper (5), Organic Honey (5)
      expect(result.current.filteredProducts).toHaveLength(3);
    });

    it('should exclude products below minimum rating', () => {
      const filters: FilterOptions = {
        category: 'All',
        searchQuery: '',
        minRating: 4,
      };

      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      // Should exclude Turmeric (3.5 avg rating)
      expect(result.current.filteredProducts.some((p) => p.name === 'Turmeric Powder')).toBe(false);
    });

    it('should include products with no reviews when minRating is 0', () => {
      const filters: FilterOptions = {
        category: 'All',
        searchQuery: '',
        minRating: 0,
      };

      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(5);
    });

    it('should exclude products with no reviews when minRating > 0', () => {
      const filters: FilterOptions = {
        category: 'All',
        searchQuery: '',
        minRating: 1,
      };

      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      // Basmati Rice has no reviews
      expect(result.current.filteredProducts.some((p) => p.name === 'Basmati Rice')).toBe(false);
    });
  });

  describe('Stock Filtering', () => {
    it('should filter in-stock products only', () => {
      const filters: FilterOptions = {
        category: 'All',
        searchQuery: '',
        inStockOnly: true,
      };

      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(4);
      expect(
        result.current.filteredProducts.every((p) => p.variants.some((v) => v.stock > 0))
      ).toBe(true);
    });

    it('should exclude out-of-stock products', () => {
      const filters: FilterOptions = {
        category: 'All',
        searchQuery: '',
        inStockOnly: true,
      };

      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts.some((p) => p.name === 'Turmeric Powder')).toBe(false);
    });

    it('should include all products when inStockOnly is false', () => {
      const filters: FilterOptions = {
        category: 'All',
        searchQuery: '',
        inStockOnly: false,
      };

      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(5);
    });
  });

  describe('Sorting', () => {
    it('should sort by name alphabetically', () => {
      const filters: FilterOptions = {
        category: 'All',
        searchQuery: '',
        sortBy: 'name',
      };

      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      const names = result.current.filteredProducts.map((p) => p.name);
      expect(names).toEqual([
        'Basmati Rice',
        'Black Pepper',
        'Organic Honey',
        'Premium Saffron',
        'Turmeric Powder',
      ]);
    });

    it('should sort by price ascending', () => {
      const filters: FilterOptions = {
        category: 'All',
        searchQuery: '',
        sortBy: 'price-asc',
      };

      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      const prices = result.current.filteredProducts.map(
        (p) => p.variants[0].salePrice ?? p.variants[0].price
      );
      expect(prices).toEqual([199, 249, 499, 799, 2499]);
    });

    it('should sort by price descending', () => {
      const filters: FilterOptions = {
        category: 'All',
        searchQuery: '',
        sortBy: 'price-desc',
      };

      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      const prices = result.current.filteredProducts.map(
        (p) => p.variants[0].salePrice ?? p.variants[0].price
      );
      expect(prices).toEqual([2499, 799, 499, 249, 199]);
    });

    it('should sort by rating descending', () => {
      const filters: FilterOptions = {
        category: 'All',
        searchQuery: '',
        sortBy: 'rating',
      };

      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      // Organic Honey (5), Black Pepper (5), Premium Saffron (4.5), Turmeric (3.5), Basmati (0)
      const names = result.current.filteredProducts.map((p) => p.name);
      expect(names[0]).toMatch(/Organic Honey|Black Pepper/); // Both have 5 rating
      expect(names[names.length - 1]).toBe('Basmati Rice'); // No reviews = 0 rating
    });

    it('should sort by newest (ID descending)', () => {
      const filters: FilterOptions = {
        category: 'All',
        searchQuery: '',
        sortBy: 'newest',
      };

      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      const ids = result.current.filteredProducts.map((p) => p.id);
      expect(ids).toEqual([5, 4, 3, 2, 1]);
    });
  });

  describe('Combined Filters', () => {
    it('should apply category and search query together', () => {
      const filters: FilterOptions = {
        category: 'Spices',
        searchQuery: 'pepper',
      };

      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(1);
      expect(result.current.filteredProducts[0].name).toBe('Black Pepper');
    });

    it('should apply all filters together', () => {
      const filters: FilterOptions = {
        category: 'Spices',
        searchQuery: '',
        priceRange: [200, 300],
        minRating: 4,
        inStockOnly: true,
        sortBy: 'price-asc',
      };

      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      // Only Black Pepper matches all criteria
      expect(result.current.filteredProducts).toHaveLength(1);
      expect(result.current.filteredProducts[0].name).toBe('Black Pepper');
    });

    it('should return empty array when no products match', () => {
      const filters: FilterOptions = {
        category: 'Spices',
        searchQuery: 'rice',
      };

      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.filteredProducts).toHaveLength(0);
      expect(result.current.productCount).toBe(0);
    });

    it('should filter, sort, and count correctly', () => {
      const filters: FilterOptions = {
        category: 'Spices',
        searchQuery: '',
        sortBy: 'name',
      };

      const { result } = renderHook(() => useProductFilter(mockProducts, filters));

      expect(result.current.productCount).toBe(3);
      expect(result.current.filteredProducts.map((p) => p.name)).toEqual([
        'Black Pepper',
        'Premium Saffron',
        'Turmeric Powder',
      ]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty product array', () => {
      const filters: FilterOptions = {
        category: 'All',
        searchQuery: '',
      };

      const { result } = renderHook(() => useProductFilter([], filters));

      expect(result.current.filteredProducts).toEqual([]);
      expect(result.current.productCount).toBe(0);
    });

    it('should handle products without variants (no price filter)', () => {
      const productWithoutVariants: Product = {
        ...mockProducts[0],
        variants: [],
      };

      const filters: FilterOptions = {
        category: 'All',
        searchQuery: '',
        // No price filter - avoids accessing variants[0]
      };

      const { result } = renderHook(() => useProductFilter([productWithoutVariants], filters));

      // Product should pass through if no variant-dependent filters
      expect(result.current.filteredProducts).toHaveLength(1);
    });

    it('should handle undefined or empty tags', () => {
      const productNoTags: Product = {
        ...mockProducts[0],
        tags: [],
      };

      const filters: FilterOptions = {
        category: 'All',
        searchQuery: 'organic',
      };

      const { result } = renderHook(() => useProductFilter([productNoTags], filters));

      expect(result.current.filteredProducts).toHaveLength(0);
    });

    it('should memoize results - same filters return same reference', () => {
      const filters: FilterOptions = {
        category: 'Spices',
        searchQuery: '',
      };

      const { result, rerender } = renderHook(() => useProductFilter(mockProducts, filters));

      const firstResult = result.current.filteredProducts;
      rerender();
      const secondResult = result.current.filteredProducts;

      expect(firstResult).toBe(secondResult);
    });
  });
});

describe('useCategories', () => {
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Product 1',
      description: 'Test',
      category: 'Spices',
      images: [],
      variants: [],
      reviews: [],
      tags: [],
    },
    {
      id: 2,
      name: 'Product 2',
      description: 'Test',
      category: 'Spices',
      images: [],
      variants: [],
      reviews: [],
      tags: [],
    },
    {
      id: 3,
      name: 'Product 3',
      description: 'Test',
      category: 'Grains',
      images: [],
      variants: [],
      reviews: [],
      tags: [],
    },
  ];

  it('should return unique categories with "All" prepended', () => {
    const { result } = renderHook(() => useCategories(mockProducts));

    expect(result.current).toEqual(['All', 'Spices', 'Grains']);
  });

  it('should handle single category', () => {
    const singleCategory = [mockProducts[0]];
    const { result } = renderHook(() => useCategories(singleCategory));

    expect(result.current).toEqual(['All', 'Spices']);
  });

  it('should handle empty product array', () => {
    const { result } = renderHook(() => useCategories([]));

    expect(result.current).toEqual(['All']);
  });

  it('should remove duplicate categories', () => {
    const { result } = renderHook(() => useCategories(mockProducts));

    // "Spices" appears twice in mockProducts
    expect(result.current.filter((c) => c === 'Spices')).toHaveLength(1);
  });
});

describe('usePriceRange', () => {
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Cheap Product',
      description: 'Test',
      category: 'Test',
      images: [],
      variants: [{ id: 1, name: '100g', price: 150, stock: 10 }],
      reviews: [],
      tags: [],
    },
    {
      id: 2,
      name: 'Mid Product',
      description: 'Test',
      category: 'Test',
      images: [],
      variants: [{ id: 2, name: '100g', price: 500, salePrice: 400, stock: 10 }],
      reviews: [],
      tags: [],
    },
    {
      id: 3,
      name: 'Expensive Product',
      description: 'Test',
      category: 'Test',
      images: [],
      variants: [{ id: 3, name: '100g', price: 2999, salePrice: 2500, stock: 10 }],
      reviews: [],
      tags: [],
    },
  ];

  it('should return min and max prices', () => {
    const { result } = renderHook(() => usePriceRange(mockProducts));

    expect(result.current).toEqual([150, 2500]);
  });

  it('should use salePrice when available', () => {
    const { result } = renderHook(() => usePriceRange(mockProducts));

    // Min should be 150 (no sale), Max should be 2500 (sale price)
    expect(result.current[1]).toBe(2500);
  });

  it('should floor min and ceil max', () => {
    const productsWithDecimals: Product[] = [
      {
        ...mockProducts[0],
        variants: [{ id: 1, name: '100g', price: 149.99, stock: 10 }],
      },
      {
        ...mockProducts[1],
        variants: [{ id: 2, name: '100g', price: 500.5, stock: 10 }],
      },
    ];

    const { result } = renderHook(() => usePriceRange(productsWithDecimals));

    expect(result.current[0]).toBe(149);
    expect(result.current[1]).toBe(501);
  });

  it('should return [0, 100] for empty product array', () => {
    const { result } = renderHook(() => usePriceRange([]));

    expect(result.current).toEqual([0, 100]);
  });

  it('should handle single product', () => {
    const { result } = renderHook(() => usePriceRange([mockProducts[0]]));

    expect(result.current).toEqual([150, 150]);
  });
});
