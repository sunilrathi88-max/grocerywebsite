import {
  getBundleSuggestions,
  getSimilarProducts,
  getPersonalizedSuggestions,
} from '../recommendations';
import { Product } from '../../types';

// Mock product data for testing
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Turmeric Powder',
    category: 'Spices',
    tags: ['spice', 'cooking', 'healthy', 'yellow'],
    description: '',
    images: [],
    reviews: [
      { id: 1, author: 'A', rating: 5, comment: '', date: '', helpful: 0, verifiedPurchase: true },
    ],
    variants: [{ id: 11, name: '100g', price: 100, stock: 50 }],
  },
  {
    id: 2,
    name: 'Coriander Powder',
    category: 'Spices',
    tags: ['spice', 'cooking', 'essential'],
    description: '',
    images: [],
    reviews: [
      { id: 2, author: 'A', rating: 4, comment: '', date: '', helpful: 0, verifiedPurchase: true },
    ],
    variants: [{ id: 21, name: '100g', price: 80, stock: 50 }],
  },
  {
    id: 3,
    name: 'Almonds',
    category: 'Nuts',
    tags: ['nut', 'healthy', 'snack'],
    description: '',
    images: [],
    reviews: [
      { id: 3, author: 'A', rating: 5, comment: '', date: '', helpful: 0, verifiedPurchase: true },
    ],
    variants: [{ id: 31, name: '100g', price: 500, stock: 50 }],
  },
  {
    id: 4,
    name: 'Chili Powder',
    category: 'Spices',
    tags: ['spice', 'cooking', 'spicy', 'red'],
    description: '',
    images: [],
    reviews: [
      { id: 4, author: 'A', rating: 3, comment: '', date: '', helpful: 0, verifiedPurchase: true },
    ],
    variants: [{ id: 41, name: '100g', price: 120, stock: 50 }],
  },
];

describe('Recommendation Engine Algorithms', () => {
  describe('getBundleSuggestions', () => {
    it('returns empty array if no products provided', () => {
      expect(getBundleSuggestions(mockProducts[0], [])).toEqual([]);
    });

    it('excludes the current product from suggestions', () => {
      const suggestions = getBundleSuggestions(mockProducts[0], mockProducts);
      expect(suggestions.find((p) => p.id === mockProducts[0].id)).toBeUndefined();
    });

    it('limits suggestions to top 2 items', () => {
      const suggestions = getBundleSuggestions(mockProducts[0], mockProducts);
      expect(suggestions.length).toBeLessThanOrEqual(2);
    });

    it('prioritizes cross-category items with shared tags for bundles', () => {
      // Turmeric (Spices, 'healthy') -> should bundle with Almonds (Nuts, 'healthy')
      // Note: Almonds score = 2 (diff category) + 1 (shared 'healthy') + 0 (price too high) = 3
      // Coriander score = 1 (same category) + 2 (shared 'spice', 'cooking') + 1 (price match) = 4
      // Chili score = 1 (same category) + 2 (shared 'spice', 'cooking') + 1 (price match) = 4

      const suggestions = getBundleSuggestions(mockProducts[0], mockProducts);
      // Both Coriander and Chili have score 4, Almonds has 3. So Coriander and Chili are top 2.
      expect(suggestions).toContainEqual(mockProducts[1]);
      expect(suggestions).toContainEqual(mockProducts[3]);
    });
  });

  describe('getSimilarProducts', () => {
    it('prioritizes products in the same category', () => {
      const suggestions = getSimilarProducts(mockProducts[0], mockProducts, 2);
      // Turmeric -> Coriander, Chili (Both Spices)
      expect(suggestions).toContainEqual(mockProducts[1]);
      expect(suggestions).toContainEqual(mockProducts[3]);
    });

    it('limits output to specified limit', () => {
      const suggestions = getSimilarProducts(mockProducts[0], mockProducts, 1);
      expect(suggestions.length).toBe(1);
    });
  });

  describe('getPersonalizedSuggestions', () => {
    it('builds taste profile from viewed items and suggests relevant new items', () => {
      // User viewed Turmeric and Coriander (Spices, cooking)
      const viewed = [mockProducts[0], mockProducts[1]];
      const suggestions = getPersonalizedSuggestions(viewed, mockProducts, 2);

      // They haven't viewed Almonds (Nuts) or Chili (Spices).
      // Chili should be suggested first due to category 'Spices' (score: 2 views * 3 = 6)
      // plus tag 'spice' (2 views * 1.5 = 3) + 'cooking' (2 views * 1.5 = 3)
      // Almonds will only get rating boost + 0 for category/tags.

      expect(suggestions[0].id).toBe(4); // Chili Powder
      expect(suggestions[1].id).toBe(3); // Almonds
    });

    it('returns empty array if viewed products list is empty', () => {
      expect(getPersonalizedSuggestions([], mockProducts)).toEqual([]);
    });
  });
});
