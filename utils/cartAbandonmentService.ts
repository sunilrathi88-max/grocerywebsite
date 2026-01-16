/**
 * Cart Abandonment Service
 * Tracks cart state for abandoned cart recovery and notifications.
 * Stores cart data with timestamps for follow-up reminder logic.
 */

const CART_ABANDONMENT_KEY = 'tattva_cart_abandonment';
const ABANDONMENT_THRESHOLD_MS = 30 * 60 * 1000; // 30 minutes

interface AbandonedCart {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  subtotal: number;
  timestamp: number;
  userEmail?: string;
  notified: boolean;
}

/**
 * Save current cart state for abandonment tracking
 */
export function saveCartState(
  items: AbandonedCart['items'],
  subtotal: number,
  userEmail?: string
): void {
  if (items.length === 0) {
    // Clear abandonment data if cart is empty
    localStorage.removeItem(CART_ABANDONMENT_KEY);
    return;
  }

  const cartData: AbandonedCart = {
    items,
    subtotal,
    timestamp: Date.now(),
    userEmail,
    notified: false,
  };

  localStorage.setItem(CART_ABANDONMENT_KEY, JSON.stringify(cartData));
}

/**
 * Get abandoned cart data if it exists and meets threshold
 */
export function getAbandonedCart(): AbandonedCart | null {
  try {
    const data = localStorage.getItem(CART_ABANDONMENT_KEY);
    if (!data) return null;

    const cart: AbandonedCart = JSON.parse(data);
    const timeSinceAbandonment = Date.now() - cart.timestamp;

    // Only return if cart has been abandoned for threshold period
    if (timeSinceAbandonment >= ABANDONMENT_THRESHOLD_MS && !cart.notified) {
      return cart;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Mark abandoned cart as notified
 */
export function markCartNotified(): void {
  try {
    const data = localStorage.getItem(CART_ABANDONMENT_KEY);
    if (!data) return;

    const cart: AbandonedCart = JSON.parse(data);
    cart.notified = true;
    localStorage.setItem(CART_ABANDONMENT_KEY, JSON.stringify(cart));
  } catch {
    // Silently fail
  }
}

/**
 * Clear abandoned cart data (e.g., after successful checkout)
 */
export function clearAbandonedCart(): void {
  localStorage.removeItem(CART_ABANDONMENT_KEY);
}

/**
 * Get cart abandonment stats for analytics
 */
export function getAbandonmentStats(): {
  hasAbandonedCart: boolean;
  abandonmentDuration: number | null;
  itemCount: number;
  subtotal: number;
} {
  try {
    const data = localStorage.getItem(CART_ABANDONMENT_KEY);
    if (!data) {
      return {
        hasAbandonedCart: false,
        abandonmentDuration: null,
        itemCount: 0,
        subtotal: 0,
      };
    }

    const cart: AbandonedCart = JSON.parse(data);
    return {
      hasAbandonedCart: true,
      abandonmentDuration: Date.now() - cart.timestamp,
      itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: cart.subtotal,
    };
  } catch {
    return {
      hasAbandonedCart: false,
      abandonmentDuration: null,
      itemCount: 0,
      subtotal: 0,
    };
  }
}

/**
 * Hook for integrating cart abandonment tracking into React components
 * Usage: Call saveCartState whenever cart changes
 */
export function createCartAbandonmentTracker() {
  return {
    track: saveCartState,
    getAbandoned: getAbandonedCart,
    markNotified: markCartNotified,
    clear: clearAbandonedCart,
    getStats: getAbandonmentStats,
  };
}
