import React from 'react';
import { PLACEHOLDER_URLS } from '../utils/imageHelpers';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  breakpoints?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc,
  loading = 'lazy',
  onLoad,
  onError,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw',
  breakpoints: _breakpoints = {},
}) => {
  // Generate srcSet for different screen sizes
  const generateSrcSet = (baseSrc: string): string => {
    const srcSets: string[] = [];

    // Extract base URL and parameters
    const urlParts = baseSrc.split('?');
    const baseUrl = urlParts[0];
    const params = urlParts[1] || '';

    // Generate different sizes for responsive images
    const widths: number[] = [400, 600, 800, 1200, 1600];
    widths.forEach((width: number) => {
      const newParams =
        params.replace(/w=\d+/g, `w=${width}`).replace(/&?q=\d+/g, '') +
        `${params.includes('w=') ? '' : (params ? '&' : '') + `w=${width}`}&q=80`;

      srcSets.push(`${baseUrl}?${newParams} ${width}w`);
    });

    return srcSets.join(', ');
  };

  const srcSet = generateSrcSet(src);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onLoad={onLoad}
      onError={(e) => {
        if (onError) onError();
        if (fallbackSrc) {
          e.currentTarget.src = fallbackSrc;
        } else {
          e.currentTarget.src = PLACEHOLDER_URLS.product;
        }
      }}
      sizes={sizes}
      srcSet={srcSet}
    />
  );
};

export default ResponsiveImage;
