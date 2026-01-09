import React from 'react';

/**
 * Image fallback utilities for consistent placeholder handling across the app
 * Updated to use local SVG fallback images from /public/images/fallbacks/
 */

export const PLACEHOLDER_URLS = {
  product: '/images/fallbacks/product-fallback.svg',
  thumb: '/images/fallbacks/thumb-fallback.svg',
  hero: '/images/fallbacks/hero-fallback.svg',
  blog: '/images/fallbacks/blog-fallback.svg',
  recipe: '/images/fallbacks/recipe-fallback.svg',
};

/**
 * Creates an image error handler with retry logic that attempts to reload
 * the image before falling back to a placeholder
 * @param placeholderUrl The fallback URL to use after retries exhausted
 * @param maxRetries Number of times to retry loading the original image (default: 2)
 * @param retryDelay Delay in ms between retries (default: 500)
 */
export const createImageErrorHandler = (
  placeholderUrl: string,
  maxRetries: number = 2,
  retryDelay: number = 500
) => {
  return (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    const originalSrc = img.dataset.originalSrc || img.src;
    const retryCount = parseInt(img.dataset.retryCount || '0', 10);

    // Save original src on first error
    if (!img.dataset.originalSrc) {
      img.dataset.originalSrc = img.src;
    }

    // If we haven't exhausted retries, try again
    if (retryCount < maxRetries && img.src !== placeholderUrl) {
      img.dataset.retryCount = (retryCount + 1).toString();

      // Add cache-busting query param to force reload
      const cacheBuster = `?retry=${Date.now()}`;
      const retryUrl = originalSrc.includes('?')
        ? `${originalSrc}&cb=${Date.now()}`
        : `${originalSrc}${cacheBuster}`;

      // Delay before retry to avoid rapid-fire requests
      setTimeout(() => {
        img.src = retryUrl;
      }, retryDelay);
    } else {
      // All retries exhausted, use fallback
      if (img.src !== placeholderUrl) {
        img.src = placeholderUrl;
        // Clean up data attributes
        delete img.dataset.originalSrc;
        delete img.dataset.retryCount;
      }
    }
  };
};

/**
 * Default handlers for common image types
 */
export const imageErrorHandlers = {
  product: createImageErrorHandler(PLACEHOLDER_URLS.product),
  thumb: createImageErrorHandler(PLACEHOLDER_URLS.thumb),
  hero: createImageErrorHandler(PLACEHOLDER_URLS.hero),
  blog: createImageErrorHandler(PLACEHOLDER_URLS.blog),
  recipe: createImageErrorHandler(PLACEHOLDER_URLS.recipe),
};
