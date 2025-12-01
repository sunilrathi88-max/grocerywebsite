import React from 'react';

/**
 * Image fallback utilities for consistent placeholder handling across the app
 * Updated to use local SVG fallback images from /public/images/fallbacks/
 */

export const PLACEHOLDER_URLS = {
  product:
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
  thumb:
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=200&q=80',
  hero: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1200&q=80',
  blog: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
  recipe:
    'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80',
};

/**
 * Creates an image error handler that swaps to a placeholder
 * @param placeholderUrl The fallback URL to use
 */
export const createImageErrorHandler = (placeholderUrl: string) => {
  return (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    if (img.src !== placeholderUrl) {
      img.src = placeholderUrl;
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
