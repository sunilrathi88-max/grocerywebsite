import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://tattva-co.com'; // Replace with real domain

const STATIC_routes = [
  '/',
  '/products',
  '/about',
  '/contact',
  '/blog',
  '/recipes',
  '/shipping-policy',
  '/returns',
  '/privacy-policy',
  '/terms',
];

// Helper to extract product IDs from data.ts (Regex to avoid TS compilation issues)
function getProductIds() {
  try {
    const dataPath = path.join(__dirname, '../data.ts');
    const content = fs.readFileSync(dataPath, 'utf-8');
    const regex = /id:\s*(\d+),/g;
    const ids = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      // Avoid duplicate IDs if defined multiple times
      if (!ids.includes(match[1])) {
        ids.push(match[1]);
      }
    }
    return ids;
  } catch (e) {
    console.error('Error reading data.ts:', e);
    return ['1', '2', '3']; // Fallback
  }
}

function generateSitemap() {
  const ids = getProductIds();
  const date = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Static Routes
  STATIC_routes.forEach((route) => {
    xml += `
  <url>
    <loc>${BASE_URL}${route === '/' ? '' : route}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
  });

  // Product Routes
  ids.forEach((id) => {
    xml += `
  <url>
    <loc>${BASE_URL}/products/${id}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml);
  console.log(
    `✅ Sitemap generated at ${outputPath} with ${STATIC_routes.length + ids.length} URLs.`
  );
}

generateSitemap();
