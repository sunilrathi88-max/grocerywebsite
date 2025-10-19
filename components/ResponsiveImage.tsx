import React from 'react';

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
  breakpoints = {},
}) => {
  // Generate srcSet for different screen sizes
  const generateSrcSet = (baseSrc: string) => {
    const srcSets = [];
    
    // Extract base URL and parameters
    const urlParts = baseSrc.split('?');
    const baseUrl = urlParts[0];
    const params = urlParts[1] || '';
    
    // Generate different sizes for responsive images
    const widths = [400, 600, 800, 1200, 1600];
    widths.forEach(width => {
      const newParams = params
        .replace(/w=\d+/g, `w=${width}`)
        .replace(/&?q=\d+/g, '')
        + `${params.includes('w=') ? '' : (params ? '&' : '') + `w=${width}`}&q=80`;
      
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
          e.currentTarget.src = 'https://via.placeholder.com/400x300/f0f0f0/666?text=Image+Not+Found';
        }
      }}
      sizes={sizes}
      srcSet={srcSet}
    />
  );
};

export default ResponsiveImage;