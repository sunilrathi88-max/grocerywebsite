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

/**
 * Get similar products for "You Might Also Like" section
 * Logic: Same Category (High Weight) + Tag Overlap (Medium Weight)
 */
export const getSimilarProducts = (
  currentProduct: Product,
  allProducts: Product[],
  limit: number = 4
): Product[] => {
  if (!allProducts || allProducts.length === 0) return [];

  const candidates = allProducts.filter((p) => p.id !== currentProduct.id);

  const scored = candidates.map((candidate) => {
    let score = 0;

    // 1. Same Category (Strong Signal)
    if (candidate.category === currentProduct.category) {
      score += 5;
    }

    // 2. Tag Overlap
    const sharedTags = candidate.tags.filter((tag) => currentProduct.tags.includes(tag));
    score += sharedTags.length * 2;

    return { product: candidate, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.product);
};

/**
 * Get personalized suggestions based on viewing history
 * Logic: Build a "User Taste Profile" from viewed products' tags and find matching unviewed products.
 */
export const getPersonalizedSuggestions = (
  viewedProducts: Product[],
  allProducts: Product[],
  limit: number = 8
): Product[] => {
  if (!viewedProducts || viewedProducts.length === 0 || !allProducts) return [];

  const viewedIds = new Set(viewedProducts.map((p) => p.id));
  const candidates = allProducts.filter((p) => !viewedIds.has(p.id));

  // 1. Build User Taste Profile
  const tagFrequency: Record<string, number> = {};
  const categoryFrequency: Record<string, number> = {};

  viewedProducts.forEach((p) => {
    // Weight logic: Recent views could be weighted higher if we had timestamps,
    // but for now simple frequency is enough.

    // Category Affinity
    categoryFrequency[p.category] = (categoryFrequency[p.category] || 0) + 1;

    // Tag Affinity
    p.tags.forEach((tag) => {
      tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
    });
  });

  // 2. Score Candidates against Profile
  const scored = candidates.map((candidate) => {
    let score = 0;

    // Category Match
    if (categoryFrequency[candidate.category]) {
      score += categoryFrequency[candidate.category] * 3;
    }

    // Tag Match
    candidate.tags.forEach((tag) => {
      if (tagFrequency[tag]) {
        score += tagFrequency[tag] * 1.5;
      }
    });

    // Rating Boost
    const avgRating =
      candidate.reviews.reduce((acc, r) => acc + r.rating, 0) / (candidate.reviews.length || 1);
    score += avgRating * 0.5;

    return { product: candidate, score };
  });

  return scored
    .sort((a, b) => b.score - a.score) // Descending score
    .slice(0, limit)
    .map((s) => s.product);
};
