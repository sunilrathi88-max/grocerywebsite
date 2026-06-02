import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

(async () => {
  const outputDir = path.join(process.cwd(), 'screenshots');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  console.log('Navigating to dev server...');

  // 1. Desktop Homepage
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:5175/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(outputDir, 'desktop_homepage.png'), fullPage: true });
  console.log('Saved desktop_homepage.png');

  // 2. Mobile Homepage (Brand Truncation)
  await page.setViewport({ width: 375, height: 667 });
  await page.goto('http://127.0.0.1:5175/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(outputDir, 'mobile_homepage.png'), fullPage: false });
  console.log('Saved mobile_homepage.png');

  // 3. Desktop Farmers Page
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:5175/farmers', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(outputDir, 'desktop_farmers.png'), fullPage: false });
  console.log('Saved desktop_farmers.png');

  await browser.close();
  console.log('All screenshots saved!');
})();
