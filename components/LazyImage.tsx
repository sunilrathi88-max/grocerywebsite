import React, { useRef, useEffect, useState } from 'react';
import { PLACEHOLDER_URLS } from '../utils/imageHelpers';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderSrc?: string;
  width?: number;
  height?: number;
}

/**
 * Lazy loading image component with IntersectionObserver
 * Loads images only when they're about to enter the viewport
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholderSrc = PLACEHOLDER_URLS.product,
  width,
  height,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!imgRef.current) return;

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
        rootMargin: '50px', // Start loading 50px before visible
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
  }, []);

  return (
    <img
      ref={imgRef}
      src={isInView ? src : placeholderSrc}
      alt={alt}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      width={width}
      height={height}
      loading="lazy"
      onLoad={() => setIsLoaded(true)}
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src !== placeholderSrc) {
          img.src = placeholderSrc;
        }
      }}
    />
  );
};
