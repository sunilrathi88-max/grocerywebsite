/**
 * Image Optimization Utilities
 * Handles WebP conversion, lazy loading, and responsive images
 */

export interface ImageConfig {
  src: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png' | 'avif';
}

export interface ResponsiveImageSet {
  src: string;
  srcSet: string;
  sizes: string;
  webpSrcSet?: string;
}

/**
 * Converts image URL to WebP format (for CDN or optimized images)
 * Falls back to original if WebP is not available
 */
export const getWebPUrl = (src: string): string => {
  // If it's already a WebP, return as is
  if (src.endsWith('.webp')) return src;

  // If it's an SVG, keep it as SVG (vector graphics don't need WebP)
  if (src.endsWith('.svg')) return src;

  // If it's a placeholder or external CDN that doesn't support WebP, return original
  if (src.includes('placeholder') || src.includes('via.placeholder')) return src;

  // For local images, replace extension with .webp
  // Assuming we'll have WebP versions alongside originals
  const webpUrl = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');

  return webpUrl;
};

/**
 * Generates srcSet for responsive images
 * Creates multiple sizes for different screen widths
 */
export const generateSrcSet = (
  src: string,
  widths: number[] = [400, 640, 768, 1024, 1280, 1536]
): string => {
  // If SVG, return single source (vector graphics scale infinitely)
  // For SVGs we don't generate size-specific raster variants — return empty so callers skip srcSet
  if (src.endsWith('.svg')) return '';

  // For placeholders, return single source
  // Don't build srcSet for placeholder/external images
  if (src.includes('placeholder') || src.includes('via.placeholder')) return '';

  // Extract base name without extension
  const lastDotIndex = src.lastIndexOf('.');
  const baseName = src.substring(0, lastDotIndex);
  const extension = src.substring(lastDotIndex);

  // Generate srcSet entries for each width
  const srcSetEntries = widths.map((width) => {
    // Format: image-400w.jpg 400w, image-640w.jpg 640w, etc.
    return `${baseName}-${width}w${extension} ${width}w`;
  });

  return srcSetEntries.join(', ');
};

/**
 * Generates WebP srcSet for modern browsers
 */
export const generateWebPSrcSet = (
  src: string,
  widths: number[] = [400, 640, 768, 1024, 1280, 1536]
): string => {
  // For SVGs or placeholders, don't generate a WebP srcset (not applicable)
  if (src.endsWith('.svg')) return '';
  if (src.includes('placeholder') || src.includes('via.placeholder')) return '';

  const lastDotIndex = src.lastIndexOf('.');
  const baseName = src.substring(0, lastDotIndex);

  const srcSetEntries = widths.map((width) => {
    return `${baseName}-${width}w.webp ${width}w`;
  });

  return srcSetEntries.join(', ');
};

/**
 * Gets appropriate sizes attribute based on layout
 */
export const getImageSizes = (type: 'card' | 'hero' | 'thumbnail' | 'detail' | 'full'): string => {
  switch (type) {
    case 'card':
      // Product cards: ~400px on mobile, ~350px on tablet, ~300px on desktop
      return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 300px';

    case 'hero':
      // Hero images: full width on all devices
      return '100vw';

    case 'thumbnail':
      // Small thumbnails: fixed small sizes
      return '(max-width: 640px) 80px, 100px';

    case 'detail':
      // Product detail images: larger on all devices
      return '(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 800px';

    case 'full':
      // Full-width content images
      return '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px';

    default:
      return '100vw';
  }
};

/**
 * Creates a complete responsive image configuration
 */
export const createResponsiveImage = (
  src: string,
  type: 'card' | 'hero' | 'thumbnail' | 'detail' | 'full' = 'card'
): ResponsiveImageSet => {
  const widths = getWidthsForType(type);

  return {
    src,
    srcSet: generateSrcSet(src, widths),
    sizes: getImageSizes(type),
    webpSrcSet: generateWebPSrcSet(src, widths),
  };
};

/**
 * Gets appropriate widths array based on image type
 */
const getWidthsForType = (type: string): number[] => {
  switch (type) {
    case 'thumbnail':
      return [80, 100, 160, 200];
    case 'card':
      return [300, 400, 600, 800];
    case 'detail':
      return [600, 800, 1024, 1280];
    case 'hero':
    case 'full':
      return [640, 768, 1024, 1280, 1536, 1920];
    default:
      return [400, 640, 768, 1024, 1280];
  }
};

/**
 * Checks if browser supports WebP
 * Uses a cached result for performance
 */
let webpSupport: boolean | null = null;

export const supportsWebP = async (): Promise<boolean> => {
  if (webpSupport !== null) return webpSupport;

  if (typeof window === 'undefined') return false;

  // Create a tiny WebP image and test if it loads
  return new Promise((resolve) => {
    const webpData =
      'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAEAAQAcJaQAA3AA/v3AgAA=';
    const img = new Image();

    img.onload = () => {
      webpSupport = true;
      resolve(true);
    };

    img.onerror = () => {
      webpSupport = false;
      resolve(false);
    };

    img.src = webpData;
  });
};

/**
 * Preloads critical images for better performance
 */
export const preloadImage = (src: string, as: 'image' = 'image'): void => {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = src;

  // Add WebP version if supported
  supportsWebP().then((supported) => {
    if (supported) {
      link.href = getWebPUrl(src);
    }
    document.head.appendChild(link);
  });
};

/**
 * Image loading priorities
 */
export type LoadingPriority = 'high' | 'low' | 'auto';

export const getLoadingAttribute = (priority: LoadingPriority): 'eager' | 'lazy' => {
  return priority === 'high' ? 'eager' : 'lazy';
};

/**
 * Gets optimal image format based on browser support
 */
export const getOptimalFormat = async (src: string): Promise<string> => {
  const isWebPSupported = await supportsWebP();

  if (src.endsWith('.svg')) return src;
  if (src.includes('placeholder')) return src;

  if (isWebPSupported) {
    return getWebPUrl(src);
  }

  return src;
};
