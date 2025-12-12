import { Product } from '../types';

/**
 * Get highly relevant recommendations for "Frequently Bought Together"
 * Limit: 2 items
 */
export const getBundleSuggestions = (
  currentProduct: Product,
  allProducts: Product[]
): Product[] => {
  if (!allProducts || allProducts.length === 0) return [];

  // Exclude current product
  const candidates = allProducts.filter((p) => p.id !== currentProduct.id);

  // Scoring Logic
  const scored = candidates.map((candidate) => {
    let score = 0;

    // 1. Cross-Category Synergy (e.g., Spices + Nuts is good)
    if (candidate.category !== currentProduct.category) {
      score += 2; // Encourage variety
    } else {
      score += 1; // Same category is also okay but less priority for "bundle"
    }

    // 2. Tag Intersection
    const sharedTags = candidate.tags.filter((tag) => currentProduct.tags.includes(tag));
    score += sharedTags.length;

    // 3. Price Range (Suggest items ~50% of current price or similar, avoiding wild mismatches)
    const p1Price = currentProduct.variants[0].price;
    const p2Price = candidate.variants[0].price;
    if (p2Price < p1Price * 1.5 && p2Price > p1Price * 0.2) {
      score += 1;
    }

    return { product: candidate, score };
  });

  // Sort and take top 2
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((s) => s.product);
};
