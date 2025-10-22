import { useEffect } from 'react';

/**
 * Performance monitoring hook
 * Tracks page load times, component render times, and reports to analytics
 */
export const usePerformanceMonitoring = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Report Web Vitals

    if ('PerformanceObserver' in window) {
      /* eslint-disable @typescript-eslint/no-explicit-any, no-console */
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          console.log('FID:', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsScore = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsScore += entry.value;
            console.log('CLS:', clsScore);
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      /* eslint-enable @typescript-eslint/no-explicit-any, no-console */

      return () => {
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    }
  }, []);
};

/**
 * Image lazy loading hook with IntersectionObserver
 */
export const useLazyImage = (ref: { current: HTMLImageElement | null }, src: string) => {
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && ref.current) {
            ref.current.src = src;
            observer.unobserve(ref.current);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
      }
    );

    const currentRef = ref.current;
    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, src]);
};

/**
 * Preload critical resources
 */
export const preloadCriticalResources = () => {
  if (typeof window === 'undefined') return;

  // Preload hero images
  const heroImages = [
    '/images/hero/slide-essence.svg',
    '/images/hero/slide-saffron.svg',
    '/images/hero/slide-spices.svg',
  ];

  heroImages.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

/**
 * Report performance metrics to analytics
 */

export const reportWebVitals = (metric: { name: string; value: number }) => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  // Send to Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.name,
      non_interaction: true,
    });
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(`[Performance] ${metric.name}:`, metric.value);
  }
};

/**
 * Debounce function for performance
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for performance
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
