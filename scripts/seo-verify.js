const puppeteer = require('puppeteer');

(async () => {
  const result = {
    metaCount: 0,
    organizationJSONLD: null,
    productJSONLD: null,
    errors: [],
  };

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(15000);

    // Load homepage
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

    // Count meta tags in head after client render
    result.metaCount = await page.evaluate(() => document.head.querySelectorAll('meta').length);

    // Check for organization JSON-LD
    result.organizationJSONLD = await page.evaluate(() => {
      const s = document.getElementById('organization-schema');
      return s ? JSON.parse(s.textContent) : null;
    });

    // Try to open first product modal by clicking first product card
    const firstProductSelector = '[data-test="product-card"]';
    const firstProductExists = await page.$(firstProductSelector);
    if (firstProductExists) {
      await page.click(firstProductSelector);
      await page.waitForTimeout(800); // allow modal + SEO injection

      // Get product JSON-LD
      result.productJSONLD = await page.evaluate(() => {
        const s = document.getElementById('product-schema');
        if (!s) return null;
        try {
          return JSON.parse(s.textContent);
        } catch (e) {
          return { parseError: e.message, raw: s.textContent };
        }
      });
    } else {
      result.errors.push('First product selector not found.');
    }
  } catch (err) {
    result.errors.push(err.message || String(err));
  } finally {
    await browser.close();
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  }
})();
