const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://tattvaco.in';
const DATA_FILE_PATH = path.resolve(__dirname, '../data.ts');

const STATIC_PAGES = [
  '',
  '/shop',
  '/about',
  '/contact',
  '/blog',
  '/faqs',
  '/terms-of-service',
  '/privacy-policy',
  '/refund-policy',
  '/recipes',
  '/offers',
];

const generateSitemap = () => {
  const dataContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
  const currentDate = new Date().toISOString().split('T')[0];

  // Extract Product IDs
  // Looking for "id: 1," or "id: 101," patterns inside the MOCK_PRODUCTS array
  // Use a regex that captures IDs at the start of objects or lines
  const productIds = [];
  const productRegex = /id:\s*(\d+),/g;
  let match;
  // We only want product IDs, which are likely 1-100, not variant IDs (101, 201 etc)
  // Heuristic: variant IDs are usually > 100 in this dataset based on previous reads, but let's be careful.
  // The MOCK_PRODUCTS structure is `id: X`. Variants are nested `variants: [{ id: Y }]`.
  // We can rely on formatting: root IDs are indented less? No, unreliable.
  // Let's assume all IDs found are valid pages, or try to isolate MOCK_PRODUCTS block.

  // Simpler: Extract MOCK_PRODUCTS block
  const productsBlock = dataContent.split('export const MOCK_PRODUCTS')[1].split('export const')[0];
  while ((match = productRegex.exec(productsBlock)) !== null) {
    // Filter out variant IDs if they follow a specific pattern or just include all?
    // Variants in data I saw: 101, 102 for product 1. 201 for product 2.
    // Product IDs are 1, 2, ...
    // If we include variants, it might be 404 or redirect.
    // Let's try to match only `id: \d+,` followed closely by `name:`.
    // The regex `id:\s*(\d+),\s*name:` matches both.
    // Let's refine.
    const id = parseInt(match[1]);
    if (id < 100) {
      // Simple heuristic based on viewed data (products are 1-30, variants 100+)
      productIds.push(id);
    }
  }

  // Extract Categories
  const categories = new Set();
  const categoryRegex = /category:\s*'([^']+)'/g;
  while ((match = categoryRegex.exec(productsBlock)) !== null) {
    categories.add(match[1]);
  }

  // Extract Blog Slugs
  const postsBlock = dataContent.split('export const MOCK_POSTS')[1].split('export const')[0];
  const slugRegex = /slug:\s*'([^']+)'/g;
  const slugs = [];
  while ((match = slugRegex.exec(postsBlock)) !== null) {
    slugs.push(match[1]);
  }

  // Generate XML
  let xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  // Static
  STATIC_PAGES.forEach((route) => {
    xml += `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`;
  });

  // Products
  [...new Set(productIds)].forEach((id) => {
    xml += `
  <url>
    <loc>${BASE_URL}/product/${id}</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.9</priority>
  </url>`;
  });

  // Categories
  categories.forEach((cat) => {
    xml += `
  <url>
    <loc>${BASE_URL}/category/${cat.replace(/&/g, '&amp;')}</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.8</priority>
  </url>`;
  });

  // Blog
  slugs.forEach((slug) => {
    xml += `
  <url>
    <loc>${BASE_URL}/blog/${slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.7</priority>
  </url>`;
  });

  xml += '\n</urlset>';

  const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml);
  console.log(
    `Sitemap generated with ${productIds.length} products, ${categories.size} categories, ${slugs.length} posts.`
  );
};

generateSitemap();
