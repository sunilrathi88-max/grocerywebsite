/* eslint-disable no-console */
import { isDev } from './env';

type EventName =
  | 'hero_cta_click'
  | 'add_to_cart'
  | 'product_click'
  | 'hero_cta_primary_click'
  | 'hero_cta_secondary_click'
  | 'page_view'
  | 'experiment_viewed'
  | 'checkout_started'
  | 'purchase_completed';

interface AnalyticsEvent {
  name: EventName;
  data?: Record<string, unknown>;
  timestamp?: number;
  sessionId?: string;
}

// Simple session management
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `sess_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Event Queue for batching or retry logic (mocked)
const eventQueue: AnalyticsEvent[] = [];
const FLUSH_INTERVAL = 5000; // 5 seconds

const flushQueue = () => {
  if (eventQueue.length === 0) return;

  const eventsToSend = [...eventQueue];
  eventQueue.length = 0; // Clear queue

  if (isDev()) {
    console.groupCollapsed(`[Analytics] Flushing ${eventsToSend.length} events`);
    eventsToSend.forEach((e) => console.log(e));
    console.groupEnd();
  }

  // Send to Google Analytics if available
  if (typeof window !== 'undefined' && 'gtag' in window) {
    eventsToSend.forEach((e) => {
      // @ts-expect-error - gtag is added by script tag
      window.gtag('event', e.name, e.data);
    });
  }

  // Here we would send to backend API
  // fetch('/api/analytics/batch', { method: 'POST', body: JSON.stringify(eventsToSend) });
};

// Start flush interval
if (typeof window !== 'undefined') {
  setInterval(flushQueue, FLUSH_INTERVAL);
}

export const trackEvent = ({ name, data }: Omit<AnalyticsEvent, 'timestamp' | 'sessionId'>) => {
  const event: AnalyticsEvent = {
    name,
    data,
    timestamp: Date.now(),
    sessionId: getSessionId(),
  };

  eventQueue.push(event);

  // Immediate log for dev visibility
  if (isDev()) {
    console.log(`[Analytics] Queued: ${name}`, data);
  }
};

// Helper for page views
export const trackPageView = (path: string) => {
  trackEvent({ name: 'page_view', data: { path } });
};
