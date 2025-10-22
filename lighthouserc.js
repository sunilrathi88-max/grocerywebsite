module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview',
      url: ['http://localhost:4173/'],
      numberOfRuns: 3,
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'max-potential-fid': ['error', { maxNumericValue: 100 }],
        'speed-index': ['error', { maxNumericValue: 3400 }],
        interactive: ['error', { maxNumericValue: 3800 }],

        // Performance budgets
        'resource-summary:script:size': ['error', { maxNumericValue: 500000 }],
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 100000 }],
        'resource-summary:image:size': ['error', { maxNumericValue: 2000000 }],
        'resource-summary:font:size': ['error', { maxNumericValue: 150000 }],
        'resource-summary:total:size': ['error', { maxNumericValue: 3000000 }],

        // Accessibility
        'categories:accessibility': ['error', { minScore: 0.9 }],

        // Best practices
        'categories:best-practices': ['error', { minScore: 0.9 }],

        // SEO
        'categories:seo': ['error', { minScore: 0.9 }],

        // PWA
        'categories:pwa': ['warn', { minScore: 0.5 }],

        // Other metrics
        'uses-long-cache-ttl': 'off',
        'uses-optimized-images': 'off',
        'uses-responsive-images': 'off',
        'modern-image-formats': 'off',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
