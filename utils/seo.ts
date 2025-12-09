/**
 * SEO Utilities
 * Handles meta tags, structured data, and SEO optimizations
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  ogImageAlt?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  noindex?: boolean;
  nofollow?: boolean;
}

export interface ProductStructuredData extends Record<string, unknown> {
  '@context': string;
  '@type': 'Product';
  name: string;
  description: string;
  image: string[];
  brand: {
    '@type': 'Brand';
    name: string;
  };
  offers: {
    '@type': 'Offer';
    price: number;
    priceCurrency: string;
    availability: string;
    url?: string;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    reviewCount: number;
  };
  weight?: {
    '@type': 'QuantitativeValue';
    value: number;
    unitText: string;
  };
  countryOfOrigin?: {
    '@type': 'Country';
    name: string;
  };
  category?: string;
  itemCondition?: string;
  review?: Array<{
    '@type': 'Review';
    reviewRating: {
      '@type': 'Rating';
      ratingValue: number;
    };
    author: {
      '@type': 'Person';
      name: string;
    };
    reviewBody: string;
  }>;
}

export interface OrganizationStructuredData extends Record<string, unknown> {
  '@context': string;
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  description: string;
  address?: {
    '@type': 'PostalAddress';
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  contactPoint?: {
    '@type': 'ContactPoint';
    telephone: string;
    contactType: string;
    email?: string;
  };
  sameAs?: string[];
}

/**
 * Generate default SEO configuration
 */
export const getDefaultSEO = (): SEOConfig => ({
  title: 'THE RATHI SPICE CO - Authentic Indian Gourmet Products | Premium Spices & Organic Foods',
  description:
    'Discover authentic Indian gourmet products including premium saffron, spices, nuts, and organic ingredients. Free shipping on orders over $50. Shop now!',
  keywords: [
    'indian spices',
    'gourmet products',
    'organic food',
    'premium saffron',
    'authentic ingredients',
    'indian grocery',
    'spices online',
    'organic spices',
    'kashmiri saffron',
    'indian superfoods',
  ],
  ogType: 'website',
  ogImage: '/images/og-image.jpg',
  ogImageAlt: 'THE RATHI SPICE CO - Authentic Indian Gourmet Products',
  twitterCard: 'summary_large_image',
});

/**
 * Update document title
 */
export const updateTitle = (title: string, siteName: string = 'THE RATHI SPICE CO'): void => {
  if (typeof document !== 'undefined') {
    document.title = title.includes(siteName) ? title : `${title} | ${siteName}`;
  }
};

/**
 * Update meta tag
 */
export const updateMetaTag = (name: string, content: string, useProperty = false): void => {
  if (typeof document === 'undefined') return;

  const attribute = useProperty ? 'property' : 'name';
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.content = content;
};

/**
 * Update canonical URL
 */
export const updateCanonical = (url: string): void => {
  if (typeof document === 'undefined') return;

  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }

  link.href = url;
};

/**
 * Add structured data (JSON-LD)
 */
export const addStructuredData = (data: Record<string, unknown>, id?: string): void => {
  if (typeof document === 'undefined') return;

  const scriptId = id || 'structured-data';
  let script = document.getElementById(scriptId) as HTMLScriptElement;

  if (script) {
    script.remove();
  }

  script = document.createElement('script');
  script.id = scriptId;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

/**
 * Remove structured data
 */
export const removeStructuredData = (id: string = 'structured-data'): void => {
  if (typeof document === 'undefined') return;
  const script = document.getElementById(id);
  if (script) script.remove();
};

/**
 * Generate Organization structured data
 */
export const generateOrganizationSchema = (): OrganizationStructuredData => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'THE RATHI SPICE CO',
  url: 'https://tattva-co.com',
  logo: 'https://tattva-co.com/images/logo.png',
  description:
    'Premium Indian gourmet products including authentic spices, saffron, nuts, and organic ingredients.',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-555-TATTVA',
    contactType: 'Customer Service',
    email: 'support@tattva-co.com',
  },
  sameAs: [
    'https://facebook.com/tattvaco',
    'https://twitter.com/tattvaco',
    'https://instagram.com/tattvaco',
    'https://pinterest.com/tattvaco',
  ],
});

/**
 * Generate Product structured data
 */
export const generateProductSchema = (product: {
  id: number;
  name: string;
  description: string;
  images: string[];
  variants: Array<{ price: number; salePrice?: number; stock: number }>;
  reviews: Array<{ rating: number; author: string; comment: string }>;
  weight?: { value: number; unit: string };
  origin?: string;
  category?: string;
  grade?: string;
}): ProductStructuredData => {
  const lowestPrice = Math.min(...product.variants.map((v) => v.salePrice ?? v.price));
  const inStock = product.variants.some((v) => v.stock > 0);
  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: 'THE RATHI SPICE CO',
    },
    offers: {
      '@type': 'Offer',
      price: lowestPrice,
      priceCurrency: 'USD',
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://tattva-co.com/product/${product.id}`,
    },
    ...(product.weight && {
      weight: {
        '@type': 'QuantitativeValue',
        value: product.weight.value,
        unitText: product.weight.unit,
      },
    }),
    ...(product.origin && {
      countryOfOrigin: {
        '@type': 'Country',
        name: product.origin,
      },
    }),
    ...(product.category && { category: product.category }),
    ...(product.grade && { itemCondition: product.grade }),
    ...(product.reviews.length > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating,
        reviewCount: product.reviews.length,
      },
      review: product.reviews.slice(0, 5).map((review) => ({
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
        },
        author: {
          '@type': 'Person',
          name: review.author,
        },
        reviewBody: review.comment,
      })),
    }),
  };
};

export interface RecipeStructuredData extends Record<string, unknown> {
  '@context': string;
  '@type': 'Recipe';
  name: string;
  image: string;
  description: string;
  prepTime: string;
  cookTime: string;
  recipeYield: number;
  recipeIngredient: string[];
  recipeInstructions: Array<{
    '@type': 'HowToStep';
    text: string;
  }>;
}

export const generateRecipeSchema = (recipe: {
  title: string;
  image: string;
  description: string;
  prepTime: string;
  cookTime: string;
  serves: number;
  ingredients: string[];
  instructions: string[];
}): RecipeStructuredData => {
  // Helper to convert time string (e.g., "15 mins") to ISO 8601 duration (e.g., "PT15M")
  const toISODuration = (timeStr: string) => {
    const match = timeStr.match(/(\d+)/);
    return match ? `PT${match[1]}M` : 'PT0M';
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    image: recipe.image,
    description: recipe.description,
    prepTime: toISODuration(recipe.prepTime),
    cookTime: toISODuration(recipe.cookTime),
    recipeYield: recipe.serves,
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.instructions.map((step) => ({
      '@type': 'HowToStep',
      text: step,
    })),
  };
};

export interface FAQStructuredData extends Record<string, unknown> {
  '@context': string;
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

export const generateFAQSchema = (
  faqs: Array<{ question: string; answer: string }>
): FAQStructuredData => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export interface BlogPostingStructuredData extends Record<string, unknown> {
  '@context': string;
  '@type': 'BlogPosting';
  headline: string;
  image: string;
  author: {
    '@type': 'Person';
    name: string;
  };
  datePublished: string;
  articleBody: string;
}

export const generateBlogPostingSchema = (post: {
  title: string;
  image: string;
  author: string;
  date: string;
  content: string;
}): BlogPostingStructuredData => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  image: post.image,
  author: {
    '@type': 'Person',
    name: post.author,
  },
  datePublished: post.date,
  articleBody: post.content.replace(/<[^>]*>?/gm, ''), // Strip HTML tags for plain text body
});

export const generateTestimonialSchema = (
  testimonials: Array<{ name: string; quote: string; rating: number }>
): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'THE RATHI SPICE CO',
  review: testimonials.map((t) => ({
    '@type': 'Review',
    reviewRating: {
      '@type': 'Rating',
      ratingValue: t.rating,
    },
    author: {
      '@type': 'Person',
      name: t.name,
    },
    reviewBody: t.quote,
  })),
});

/**
 * Generate BreadcrumbList structured data
 */
export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

/**
 * Apply SEO configuration
 */
export const applySEO = (config: SEOConfig): void => {
  const {
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
  } = config;

  // Update title
  updateTitle(title);

  // Meta description
  updateMetaTag('description', description);

  // Keywords
  if (keywords && keywords.length > 0) {
    updateMetaTag('keywords', keywords.join(', '));
  }

  // Canonical URL
  if (canonical) {
    updateCanonical(canonical);
  }

  // Open Graph tags
  updateMetaTag('og:title', title, true);
  updateMetaTag('og:description', description, true);
  updateMetaTag('og:type', ogType || 'website', true);
  if (ogImage) {
    updateMetaTag('og:image', ogImage, true);
    if (ogImageAlt) {
      updateMetaTag('og:image:alt', ogImageAlt, true);
    }
  }
  updateMetaTag('og:url', canonical || window.location.href, true);

  // Twitter Card tags
  updateMetaTag('twitter:card', twitterCard || 'summary_large_image');
  updateMetaTag('twitter:title', title);
  updateMetaTag('twitter:description', description);
  if (ogImage) {
    updateMetaTag('twitter:image', ogImage);
  }

  // Robots meta
  if (noindex || nofollow) {
    const robotsContent = [noindex ? 'noindex' : 'index', nofollow ? 'nofollow' : 'follow'].join(
      ', '
    );
    updateMetaTag('robots', robotsContent);
  }
};

/**
 * Page-specific SEO configurations
 */
export const pageSEO = {
  home: (): SEOConfig => ({
    title:
      'THE RATHI SPICE CO - Authentic Indian Gourmet Products | Premium Spices & Organic Foods',
    description:
      'Shop authentic Indian gourmet products including premium saffron, spices, nuts, and organic ingredients. Free shipping on orders over $50. 100% satisfaction guaranteed.',
    keywords: [
      'indian grocery online',
      'premium spices',
      'organic food',
      'saffron',
      'indian gourmet',
      'spices delivery',
    ],
    canonical: 'https://tattva-co.com',
    ogType: 'website',
    ogImage: '/images/og-home.jpg',
    twitterCard: 'summary_large_image',
  }),

  products: (category?: string): SEOConfig => ({
    title: category
      ? `${category} - Premium Indian ${category} | THE RATHI SPICE CO`
      : 'Shop All Products - Authentic Indian Gourmet | THE RATHI SPICE CO',
    description: category
      ? `Browse our selection of premium ${category.toLowerCase()}. Authentic, organic, and sourced directly from India. Free shipping on orders over $50.`
      : 'Explore our complete collection of authentic Indian gourmet products. Premium spices, nuts, organic ingredients, and more. Shop now!',
    keywords: ['indian products', 'shop indian spices', category?.toLowerCase(), 'buy online'],
    canonical: category
      ? `https://tattva-co.com/products/${category}`
      : 'https://tattva-co.com/products',
    ogType: 'website',
  }),

  product: (name: string, description: string): SEOConfig => ({
    title: `${name} - Premium Quality | THE RATHI SPICE CO`,
    description: description.substring(0, 160),
    keywords: [name.toLowerCase(), 'buy online', 'authentic', 'premium quality'],
    ogType: 'product',
    twitterCard: 'summary_large_image',
  }),

  recipes: (): SEOConfig => ({
    title: 'Indian Recipes & Cooking Tips | THE RATHI SPICE CO',
    description:
      'Discover authentic Indian recipes, cooking tips, and culinary inspiration. Learn to cook traditional dishes with our premium ingredients.',
    keywords: ['indian recipes', 'cooking tips', 'authentic indian food', 'recipe ideas'],
    canonical: 'https://tattva-co.com/recipes',
    ogType: 'website',
  }),

  blog: (): SEOConfig => ({
    title: 'Blog - Indian Cuisine & Culture | THE RATHI SPICE CO',
    description:
      'Read about Indian cuisine, spices, cooking techniques, and the cultural heritage behind our gourmet products.',
    keywords: ['indian cuisine blog', 'spice guide', 'cooking blog', 'food culture'],
    canonical: 'https://tattva-co.com/blog',
    ogType: 'website',
  }),

  about: (): SEOConfig => ({
    title: 'About Us - Our Story & Mission | THE RATHI SPICE CO',
    description:
      "Learn about THE RATHI SPICE CO's mission to bring authentic Indian gourmet products to your kitchen. Discover our commitment to quality and sustainability.",
    keywords: ['about tattva co', 'our story', 'indian gourmet mission'],
    canonical: 'https://tattva-co.com/about',
    ogType: 'website',
  }),

  contact: (): SEOConfig => ({
    title: 'Contact Us - Get in Touch | THE RATHI SPICE CO',
    description:
      "Have questions? Contact THE RATHI SPICE CO for support, inquiries, or feedback. We're here to help with your gourmet Indian product needs.",
    keywords: ['contact', 'customer support', 'get in touch'],
    canonical: 'https://tattva-co.com/contact',
    ogType: 'website',
  }),
};
