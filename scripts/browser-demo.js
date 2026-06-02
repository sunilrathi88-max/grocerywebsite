import puppeteer from 'puppeteer';

(async () => {
  console.log('🤖 Antigravity: Launching browser automation...');

  // Launch the browser in visible mode (headless: false) so you can watch!
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized'], // Maximize the window for full effect
  });

  const page = await browser.newPage();

  console.log('🌐 Navigating to Wikipedia to demonstrate control...');
  await page.goto('https://en.wikipedia.org/wiki/Main_Page');

  // Wait a moment so you can watch
  await new Promise((r) => setTimeout(r, 2000));

  console.log('⌨️ Typing into the search bar automatically...');
  // Type into the Wikipedia search input
  await page.type('input[name="search"]', 'Artificial Intelligence', { delay: 100 });

  await new Promise((r) => setTimeout(r, 1000));

  console.log('🖱️ Clicking the search button...');
  await Promise.all([page.waitForNavigation(), page.keyboard.press('Enter')]);

  console.log('✅ Successfully loaded the AI page! You should see it on your screen.');

  console.log('⏱️ Keeping the browser open for 5 seconds before closing...');
  await new Promise((r) => setTimeout(r, 5000));

  console.log('👋 Automation complete. Shutting down browser control.');
  await browser.close();
})();
