/**
 * Single source of truth for shipping pricing.
 * Referenced by cart, checkout, mini-cart, shop drawer, and SEO copy —
 * change the values here and every surface stays consistent.
 */
export const FREE_SHIPPING_THRESHOLD = 1000;
export const SHIPPING_FEE = 50;

/** Shipping cost for a given order subtotal (free at 0 and at/over the threshold). */
export function getShippingCost(subtotal: number): number {
  if (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return SHIPPING_FEE;
}
