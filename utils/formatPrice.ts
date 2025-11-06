/**
 * Utility functions for formatting prices in INR currency
 * TattvaCo - Indian Spice Store
 */

/**
 * Format price with Indian Rupee symbol
 * @param price - Price value from database (already in INR)
 * @param currency - Currency code (default: 'INR')
 * @param symbol - Currency symbol (default: '₹')
 * @returns Formatted price string (e.g., "₹120.00")
 */
export function formatPrice(
  price: number,
  currency: string = 'INR',
  symbol: string = '₹'
): string {
  // Round to 2 decimal places
  const roundedPrice = Math.round(price * 100) / 100;
  
  // For Indian prices, we don't need decimal places for whole numbers
  if (roundedPrice % 1 === 0) {
    return `${symbol}${roundedPrice.toFixed(0)}`;
  }
  
  return `${symbol}${roundedPrice.toFixed(2)}`;
}

/**
 * Format price using Intl.NumberFormat for proper Indian formatting
 * Includes proper comma placement (e.g., 1,00,000 not 100,000)
 * @param price - Price value in INR
 * @returns Formatted price with proper Indian number format
 */
export function formatPriceIndian(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Format price per unit (e.g., price per 100g)
 * @param price - Total price
 * @param weight - Weight in grams
 * @param standardUnit - Standard unit for comparison (default: 100g)
 * @returns Formatted price per standard unit
 */
export function formatPricePerUnit(
  price: number,
  weight: number,
  standardUnit: number = 100
): string {
  const pricePerUnit = (price / weight) * standardUnit;
  return `${formatPrice(pricePerUnit)}/${standardUnit}g`;
}

/**
 * Parse price string to number (remove currency symbols)
 * @param priceString - Price string with currency symbol
 * @returns Numeric price value
 */
export function parsePrice(priceString: string): number {
  // Remove currency symbols and commas
  const cleaned = priceString.replace(/[^₹$\d.]/g, '');
  return parseFloat(cleaned) || 0;
}
