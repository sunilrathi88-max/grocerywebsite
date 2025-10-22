const puppeteer = require('puppeteer');

(async () => {
  const result = {
    metaCount: 0,
    organizationJSONLD: null,
    productJSONLD: null,
    errors: [],
  };

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(30000);

    console.log('Loading homepage...');
    // Load homepage - try network address if localhost fails
    const urls = ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://192.168.1.9:3000'];
    let pageLoaded = false;

    for (const url of urls) {
      try {
        await page.goto(url, {
          waitUntil: 'networkidle2',
          timeout: 10000,
        });
        console.log(`Page loaded successfully from ${url}`);
        pageLoaded = true;
        break;
      } catch (err) {
        console.log(`Failed to load from ${url}: ${err.message}`);
      }
    }

    if (!pageLoaded) {
      throw new Error('Could not connect to dev server on any address');
    }

    // Wait for React to mount
    await page.waitForSelector('#root', { timeout: 10000 });
    await page.waitForTimeout(1500);

    // Count meta tags in head after client render
    console.log('Counting meta tags...');
    result.metaCount = await page.evaluate(() => document.head.querySelectorAll('meta').length);
    console.log(`Found ${result.metaCount} meta tags`);

    // Check for organization JSON-LD
    console.log('Checking for organization JSON-LD...');
    result.organizationJSONLD = await page.evaluate(() => {
      const s = document.getElementById('organization-schema');
      return s ? JSON.parse(s.textContent) : null;
    });
    console.log('Organization JSON-LD:', result.organizationJSONLD ? 'FOUND' : 'NOT FOUND');

    // Try to open first product modal by clicking first product card
    console.log('Looking for product cards...');
    const productCardSelectors = [
      '[data-test="product-card"]',
      '.product-card',
      'button[aria-label*="View"]',
      'div[class*="ProductCard"]',
    ];

    let clicked = false;
    for (const selector of productCardSelectors) {
      const elem = await page.$(selector);
      if (elem) {
        console.log(`Found product with selector: ${selector}`);
        await elem.click();
        clicked = true;
        break;
      }
    }

    if (clicked) {
      console.log('Waiting for product modal and SEO injection...');
      await page.waitForTimeout(1500);

      // Get product JSON-LD
      console.log('Checking for product JSON-LD...');
      result.productJSONLD = await page.evaluate(() => {
        const s = document.getElementById('product-schema');
        if (!s) return null;
        try {
          return JSON.parse(s.textContent);
        } catch (e) {
          return { parseError: e.message, raw: s.textContent };
        }
      });
      console.log('Product JSON-LD:', result.productJSONLD ? 'FOUND' : 'NOT FOUND');
    } else {
      result.errors.push('Could not find any product card to click.');
    }
  } catch (err) {
    console.error('Error during verification:', err.message);
    result.errors.push(err.message || String(err));
  } finally {
    await browser.close();
    console.log('\n=== SEO VERIFICATION REPORT ===');
    console.log(JSON.stringify(result, null, 2));
    console.log('================================\n');

    // Exit with error code if there are errors
    process.exit(result.errors.length > 0 ? 1 : 0);
  }
})();
