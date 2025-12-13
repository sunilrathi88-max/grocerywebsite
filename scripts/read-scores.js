import fs from 'fs';
try {
  const data = JSON.parse(fs.readFileSync('latest-audit.json', 'utf8'));
  const cats = data.categories;
  console.log(`Performance: ${Math.round(cats.performance.score * 100)}`);
  console.log(`Accessibility: ${Math.round(cats.accessibility.score * 100)}`);
  console.log(`Best Practices: ${Math.round(cats['best-practices'].score * 100)}`);
  console.log(`SEO: ${Math.round(cats.seo.score * 100)}`);
  console.log(`PWA: ${Math.round(cats.pwa.score * 100)}`);
} catch (e) {
  console.error('Error parsing JSON:', e.message);
}
