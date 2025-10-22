// Google Analytics Integration
// To use this file, add your Google Analytics tracking ID in the .env file

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Initialize Google Analytics
 * Call this in your index.tsx or main App component
 */
export const initGA = (measurementId: string) => {
  if (typeof window === 'undefined') return;

  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_path: window.location.pathname,
  });

  // eslint-disable-next-line no-console
  console.log('Google Analytics initialized with ID:', measurementId);
};

/**
 * Track page views
 */
export const trackPageView = (path: string, title?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
  });

  // eslint-disable-next-line no-console
  console.log('Page view tracked:', path);
};

/**
 * Track custom events
 */
export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });

  // eslint-disable-next-line no-console
  console.log('Event tracked:', { category, action, label, value });
};

/**
 * E-commerce specific tracking functions
 */

// Track when user views a product
export const trackProductView = (product: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) => {
  trackEvent('Ecommerce', 'view_item', product.name, product.price);

  if (window.gtag) {
    window.gtag('event', 'view_item', {
      currency: 'USD',
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category || 'Unknown',
          price: product.price,
        },
      ],
    });
  }
};

// Track when user adds product to cart
export const trackAddToCart = (product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
}) => {
  trackEvent('Ecommerce', 'add_to_cart', product.name, product.price * product.quantity);

  if (window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: 'USD',
      value: product.price * product.quantity,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category || 'Unknown',
          price: product.price,
          quantity: product.quantity,
        },
      ],
    });
  }
};

// Track when user removes product from cart
export const trackRemoveFromCart = (product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) => {
  trackEvent('Ecommerce', 'remove_from_cart', product.name, product.price * product.quantity);

  if (window.gtag) {
    window.gtag('event', 'remove_from_cart', {
      currency: 'USD',
      value: product.price * product.quantity,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          quantity: product.quantity,
        },
      ],
    });
  }
};

// Track checkout initiation
export const trackBeginCheckout = (cartTotal: number, itemCount: number) => {
  trackEvent('Ecommerce', 'begin_checkout', `Items: ${itemCount}`, cartTotal);

  if (window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: 'USD',
      value: cartTotal,
    });
  }
};

// Track completed purchase
export const trackPurchase = (order: {
  id: string;
  total: number;
  tax?: number;
  shipping?: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    category?: string;
  }>;
}) => {
  trackEvent('Ecommerce', 'purchase', order.id, order.total);

  if (window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: order.id,
      value: order.total,
      tax: order.tax || 0,
      shipping: order.shipping || 0,
      currency: 'USD',
      items: order.items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        item_category: item.category || 'Unknown',
        price: item.price,
        quantity: item.quantity,
      })),
    });
  }
};

// Track search queries
export const trackSearch = (searchTerm: string, resultsCount: number) => {
  trackEvent('Search', 'search', searchTerm, resultsCount);

  if (window.gtag) {
    window.gtag('event', 'search', {
      search_term: searchTerm,
    });
  }
};

// Track user interactions
export const trackUserAction = (action: string, label?: string) => {
  trackEvent('User Interaction', action, label);
};

// Track quiz completion
export const trackQuizCompletion = (score: number, totalQuestions: number) => {
  trackEvent('Engagement', 'quiz_completed', `Score: ${score}/${totalQuestions}`, score);
};

// Track loyalty points earned
export const trackPointsEarned = (points: number, action: string) => {
  trackEvent('Loyalty', 'points_earned', action, points);
};

// Track badge unlock
export const trackBadgeUnlock = (badgeName: string) => {
  trackEvent('Gamification', 'badge_unlocked', badgeName);
};

/**
 * Initialize Hotjar
 * Add this to your index.html <head> section or call this function
 */
export const initHotjar = (hjid: number, hjsv: number) => {
  if (typeof window === 'undefined') return;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  (function (h: any, o: any, t: any, j: any, a?: any, r?: any) {
    h.hj =
      h.hj ||
      function () {
        (h.hj.q = h.hj.q || []).push(arguments);
      };
    h._hjSettings = { hjid: hjid, hjsv: hjsv };
    a = o.getElementsByTagName('head')[0];
    r = o.createElement('script');
    r.async = 1;
    r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
    a.appendChild(r);
  })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
  /* eslint-enable @typescript-eslint/no-explicit-any */

  // eslint-disable-next-line no-console
  console.log('Hotjar initialized with ID:', hjid);
};

/**
 * Example .env configuration:
 *
 * VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 * VITE_HOTJAR_ID=1234567
 * VITE_HOTJAR_SV=6
 */
