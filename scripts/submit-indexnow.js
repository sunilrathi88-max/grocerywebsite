import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');

async function submitIndexNow() {
  console.log('Initializing IndexNow protocol sequence...');
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error('❌ sitemap.xml not found! Run npm run generate:sitemap first.');
    return;
  }

  const sitemapXml = fs.readFileSync(SITEMAP_PATH, 'utf-8');
  const urls = [];
  const regex = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = regex.exec(sitemapXml)) !== null) {
    if (!match[1].includes('localhost')) {
      urls.push(match[1]);
    }
  }

  console.log(\`✅ Extracted \${urls.length} absolute URLs from sitemap.\`);

  const payload = {
    host: 'rathinaturals.com',
    key: 'rathi-123456789-indexnow',
    keyLocation: 'https://rathinaturals.com/rathi-123456789-indexnow.txt',
    urlList: urls
  };

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log('🚀 Successfully submitted index payload to Bing & Yandex algorithms!');
    } else {
      console.error(\`❌ Failed to submit protocol: \${response.status} \${response.statusText}\`);
    }
  } catch (err) {
    console.error('❌ Endpoint connection failure: ', err.message);
  }
}

submitIndexNow();
