/* eslint-env node */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// We use dynamic import for vite since it's an ESM package sometimes,
// or require if it's CJS. Vite exposes modern CJS exports.
async function startServer() {
  const { preview } = await import('vite');
  return await preview({ preview: { port: 4173 } });
}

const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

const routes = [
  '/',
  '/shop',
  '/about',
  '/contact',
  '/faqs',
  '/blog',
  '/category/spices',
  '/category/dry-fruits',
  '/category/nuts',
  '/category/beverages',
];

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function prerender() {
  console.log('Starting preview server programmatically...');
  let server;
  try {
    server = await startServer();
  } catch (e) {
    console.error('Failed to start Vite preview server:', e);
    process.exit(1);
  }

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      if (
        ['image', 'media', 'font', 'stylesheet'].includes(type) ||
        req.url().includes('google-analytics')
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    for (const route of routes) {
      console.log(`Prerendering ${route} ...`);
      await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
      await sleep(1500);

      let html = await page.content();

      const filePath = path.join(
        __dirname,
        '../dist',
        route === '/' ? 'index.html' : `${route}/index.html`
      );
      const dirPath = path.dirname(filePath);

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      html = html.replace('</head>', '<meta name="prerendered" content="true" />\n</head>');
      fs.writeFileSync(filePath, html);
      console.log(`Saved: ${filePath}`);
    }
  } catch (error) {
    console.error('Error during prerendering:', error);
  } finally {
    await browser.close();
    if (server && server.httpServer) {
      server.httpServer.close();
    }
    console.log('Prerendering complete! Server and Browser closed.');
  }
}

prerender();
