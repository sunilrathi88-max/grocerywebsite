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
