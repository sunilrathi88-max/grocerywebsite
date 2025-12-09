type EventName = 'hero_cta_click' | 'add_to_cart' | 'product_click';

interface AnalyticsEvent {
  name: EventName;
  data?: Record<string, unknown>;
}

export const trackEvent = ({ name, data }: AnalyticsEvent) => {
  // Log to console in development
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log(`[Analytics] Event: ${name}`, data);
  }

  // Placeholder for real analytics integration (e.g., Google Analytics, Vercel Analytics)
  // window.gtag('event', name, data);
};
