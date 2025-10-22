import { useEffect } from 'react';
import { applySEO, SEOConfig, addStructuredData, removeStructuredData } from '../utils/seo';

interface SEOProps extends SEOConfig {
  structuredData?: Record<string, unknown>;
  structuredDataId?: string;
}

/**
 * SEO Component
 *
 * Manages meta tags, Open Graph, Twitter Cards, and structured data for a page
 *
 * @example
 * <SEO
 *   title="Product Name"
 *   description="Product description"
 *   ogType="product"
 *   structuredData={productSchema}
 * />
 */
export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogType,
  ogImage,
  ogImageAlt,
  twitterCard,
  noindex,
  nofollow,
  structuredData,
  structuredDataId = 'structured-data',
}) => {
  useEffect(() => {
    // Apply SEO configuration
    applySEO({
      title,
      description,
      keywords,
      canonical,
      ogType,
      ogImage,
      ogImageAlt,
      twitterCard,
      noindex,
      nofollow,
    });

    // Add structured data if provided
    if (structuredData) {
      addStructuredData(structuredData, structuredDataId);
    }

    // Cleanup: remove structured data on unmount
    return () => {
      if (structuredData) {
        removeStructuredData(structuredDataId);
      }
    };
  }, [
    title,
    description,
    keywords,
    canonical,
    ogType,
    ogImage,
    ogImageAlt,
    twitterCard,
    noindex,
    nofollow,
    structuredData,
    structuredDataId,
  ]);

  // This component doesn't render anything
  return null;
};

export default SEO;
