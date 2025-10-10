import { describe, it, expect } from 'vitest';
import { toNum, getProductPrice, getAverageRating, isVariantOnSale, isAnyVariantOnSale, isAnyVariantInStock } from '../utils/sorting';
import type { Product } from '../types';

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 999,
  name: 'Test',
  description: 'Test product',
  images: ['https://example.com/img.jpg'],
  category: 'Spices',
  variants: [
    { id: 1, name: '100g', price: 10 as unknown as number, stock: 5 as unknown as number },
  ],
  reviews: [],
  ...overrides,
});

describe('sorting utils coercion', () => {
  it('toNum coerces number-like strings and preserves numbers', () => {
    expect(toNum('12.5')).toBe(12.5);
    expect(toNum(7)).toBe(7);
    expect(Number.isNaN(toNum('not-a-number'))).toBe(true);
  });

  it('getProductPrice handles string salePrice/price', () => {
    const product = makeProduct({
      variants: [
        { id: 1, name: '100g', price: '12.5' as unknown as number, salePrice: '9.99' as unknown as number, stock: '3' as unknown as number },
        { id: 2, name: '200g', price: '20' as unknown as number, stock: '0' as unknown as number },
      ],
    });
    expect(getProductPrice(product)).toBe(9.99);
  });

  it('getAverageRating handles string ratings', () => {
    const product = makeProduct({
      reviews: [
        { id: 1, author: 'A', rating: '5' as unknown as number, comment: 'x' },
        { id: 2, author: 'B', rating: '3' as unknown as number, comment: 'y' },
      ],
    });
    expect(getAverageRating(product.reviews)).toBe(4);
  });

  it('isVariantOnSale works with string prices', () => {
    const p = makeProduct({
      variants: [ { id: 1, name: '100g', price: '10' as unknown as number, salePrice: '8' as unknown as number, stock: '1' as unknown as number } ],
    });
    expect(isVariantOnSale(p.variants[0])).toBe(true);
    expect(isAnyVariantOnSale(p)).toBe(true);
  });

  it('isAnyVariantInStock treats numeric strings > 0 as in stock', () => {
    const p = makeProduct({
      variants: [ { id: 1, name: '100g', price: '10' as unknown as number, stock: '2' as unknown as number } ],
    });
    expect(isAnyVariantInStock(p)).toBe(true);
  });
});
