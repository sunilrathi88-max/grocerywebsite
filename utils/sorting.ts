// Numeric coercion helper
export const toNum = (val: unknown): number => {
  if (typeof val === 'number') return val;
  const n = Number(val);
  return Number.isNaN(n) ? NaN : n;
};

// Compute the minimum effective price across variants, preferring salePrice when present
import type { Product, Review, Variant } from '../types';

export const getProductPrice = (product: Product): number => {
  const prices = product.variants
    .map((v: Variant) => (v.salePrice != null ? toNum(v.salePrice as unknown) : toNum(v.price as unknown)))
    .filter((n) => !Number.isNaN(n));
  return prices.length ? Math.min(...prices) : Number.POSITIVE_INFINITY;
};

export const getAverageRating = (reviews: Review[]): number => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + toNum(r.rating as unknown), 0);
  const avg = sum / reviews.length;
  return Number.isNaN(avg) ? 0 : avg;
};

export const isVariantOnSale = (v: Variant): boolean => {
  if (v.salePrice == null) return false;
  const price = toNum(v.price as unknown);
  const sale = toNum((v.salePrice as unknown));
  return !Number.isNaN(price) && !Number.isNaN(sale) && sale < price;
};

export const isAnyVariantOnSale = (product: Product): boolean => product.variants.some(isVariantOnSale);

export const isAnyVariantInStock = (product: Product): boolean => product.variants.some(v => toNum(v.stock as unknown) > 0);
