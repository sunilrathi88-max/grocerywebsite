/* global requestAnimationFrame */
import React, { useState, useEffect, useRef } from 'react';
import {
  createResponsiveImage,
  getLoadingAttribute,
  LoadingPriority,
} from '../utils/imageOptimization';
import { PLACEHOLDER_URLS } from '../utils/imageHelpers';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  type?: 'card' | 'hero' | 'thumbnail' | 'detail' | 'full';
  priority?: LoadingPriority;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

/**
 * OptimizedImage Component
 *
 * Features:
 * - WebP support with fallback
 * - Responsive images with srcSet
 * - Lazy loading with IntersectionObserver
 * - Blur-up effect during load
 * - Error handling with fallback
 *
 * @example
 * <OptimizedImage
 *   src="/images/product.jpg"
 *   alt="Product name"
 *   type="card"
 *   priority="low"
 * />
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  type = 'card',
  priority = 'auto',
  fallbackSrc = PLACEHOLDER_URLS.product,
  onLoad,
  onError,
  width,
  height,
  style,
}) => {
  const [isLoaded, setIsLoaded] = useState(priority === 'high');
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority === 'high');
  const imgRef = useRef<HTMLImageElement>(null);

  // Safety-net: If src is missing or is an external placeholder, use local fallback
  const safeSrc = !src || src.includes('via.placeholder') ? PLACEHOLDER_URLS.product : src;

  // Generate responsive image configuration
  const imageConfig = createResponsiveImage(safeSrc, type);
  const loading = getLoadingAttribute(priority);

  // Check if this is an external URL - for local images without responsive variants,
  // we should NOT use srcSet as those files don't exist
  const isExternalUrl = safeSrc.startsWith('http://') || safeSrc.startsWith('https://');

  // Only use srcSet for Unsplash images (which support dynamic sizing)
  // or images that have known responsive variants
  const hasResponsiveVariants = safeSrc.includes('unsplash.com');
  const shouldUseSrcSet = hasResponsiveVariants || isExternalUrl;

  // Intersection Observer for lazy loading (skip if priority is high)
  useEffect(() => {
    if (priority === 'high' || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '200px', // Start loading 200px before visible
        threshold: 0.01,
      }
    );

    const currentImg = imgRef.current;
    observer.observe(currentImg);

    return () => {
      if (currentImg) {
        observer.unobserve(currentImg);
      }
    };
  }, [priority]);

  // Check if image is already loaded (e.g. from cache)
  useEffect(() => {
    if (imgRef.current?.complete) {
      // Use requestAnimationFrame to avoid cascading renders warning
      requestAnimationFrame(() => {
        setIsLoaded(true);
      });
    }
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    if (onError) onError(event);
    // Set as loaded even on error to show fallback
    setIsLoaded(true);
  };

  // Safety-net: ensure fallbackSrc is always local (never external placeholder)
  const safeFallbackSrc = fallbackSrc?.includes('via.placeholder')
    ? PLACEHOLDER_URLS.product
    : fallbackSrc || PLACEHOLDER_URLS.product;

  // Use actual src if in view or if error (to show fallback), otherwise use fallback for lazy loading
  const imageSrc = hasError ? safeFallbackSrc : isInView ? safeSrc : safeFallbackSrc;

  return (
    <picture className={`block ${className}`}>
      {' '}
      {/* Pass className to picture for layout */}
      {/* WebP source for modern browsers - only use srcSet when we know the variants exist */}
      {!hasError && shouldUseSrcSet && imageConfig.webpSrcSet && isInView && (
        <source type="image/webp" srcSet={imageConfig.webpSrcSet} sizes={imageConfig.sizes} />
      )}
      {/* Standard format fallback - only use srcSet when we know the variants exist */}
      {!hasError && shouldUseSrcSet && imageConfig.srcSet && isInView && (
        <source srcSet={imageConfig.srcSet} sizes={imageConfig.sizes} />
      )}
      {/* Main image element */}
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300 ease-in-out`}
        loading={loading}
        fetchPriority={priority === 'high' ? 'high' : 'auto'}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        decoding={priority === 'high' ? 'sync' : 'async'}
        style={style}
      />
    </picture>
  );
};

export default OptimizedImage;
