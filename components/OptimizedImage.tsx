import React, { useState, useEffect, useRef } from 'react';
import {
  createResponsiveImage,
  getLoadingAttribute,
  LoadingPriority,
} from '../utils/imageOptimization';

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
  fallbackSrc = 'https://via.placeholder.com/400x400/F8E3D9/333333?text=Tattva+Co.',
  onLoad,
  onError,
  width,
  height,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority === 'high');
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate responsive image configuration
  const imageConfig = createResponsiveImage(src, type);
  const loading = getLoadingAttribute(priority);

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
        rootMargin: '100px', // Start loading 100px before visible
        threshold: 0.01,
      }
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    if (onError) onError(event);
  };

  // Use placeholder until image is in view
  const imageSrc = isInView ? (hasError ? fallbackSrc : src) : fallbackSrc;

  return (
    <picture>
      {/* WebP source for modern browsers */}
      {!hasError && imageConfig.webpSrcSet && isInView && (
        <source type="image/webp" srcSet={imageConfig.webpSrcSet} sizes={imageConfig.sizes} />
      )}

      {/* Standard format fallback */}
      {!hasError && imageConfig.srcSet && isInView && (
        <source srcSet={imageConfig.srcSet} sizes={imageConfig.sizes} />
      )}

      {/* Main image element */}
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`${className} ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-500 ease-in-out`}
        loading={loading}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        decoding="async"
      />
    </picture>
  );
};

export default OptimizedImage;
