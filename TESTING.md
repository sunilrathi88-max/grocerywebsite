# Cypress E2E Testing Documentation

## Overview
Comprehensive automated testing suite for Tattva Co. grocery website covering:
- Products dropdown navigation
- Quiz and promo code system
- Performance & Web Vitals monitoring
- Lazy loading images
- Social proof notifications
- Complete checkout flow
- Mobile responsiveness

## Test Suites

### 1. Products Dropdown Navigation (`01-dropdown-navigation.cy.ts`)
Tests the 300ms hover delay fix and category filtering.

**Test Cases:**
- Display dropdown on hover
- Keep dropdown open when mouse moves into it
- Navigate to category when clicked
- Test all categories (Spices, Nuts, Dry Fruits, Beverages)
- Close dropdown when clicking outside

**Key Validations:**
- 300ms delay prevents accidental dropdown closure
- Category filtering works correctly
- URL updates on category selection

### 2. Quiz & Promo Codes (`02-quiz-promo-codes.cy.ts`)
Tests the 8-question quiz and promo code generation.

**Test Cases:**
- Display quiz with first question
- Complete quiz with perfect score (8/8) → QUIZMASTER15 (15% off)
- Complete quiz with 7/8 score → SPICEFAN10 (10% off)
- Copy promo code to clipboard
- Replay quiz functionality
- Display progress bar and stats
- Apply promo code in checkout

**Key Validations:**
- Correct answers generate appropriate promo codes
- Copy-to-clipboard functionality
- Promo codes apply correct discounts

### 3. Performance & Web Vitals (`03-performance-vitals.cy.ts`)
Monitors Core Web Vitals and page performance.

**Test Cases:**
- Page load time < 5 seconds
- Core Web Vitals on homepage (LCP, FID, CLS)
- Core Web Vitals on product detail page
- Hero image loading efficiency
- Layout shift detection (CLS < 0.1)
- First Input Delay (FID < 100ms)
- Font loading without FOUT
- Bundle size < 5MB
- JavaScript execution time < 1s
- Deferred non-critical resources
- Time to Interactive (TTI < 3.5s)
- Connection-aware loading

**Key Validations:**
- LCP < 2500ms
- FID < 100ms
- CLS < 0.1
- Total bundle size < 5MB

### 4. Lazy Loading (`04-lazy-loading.cy.ts`)
Tests image lazy loading on scroll.

**Test Cases:**
- Images have loading="lazy" attribute
- Not all images load immediately
- Images load as user scrolls
- Fade-in animation on image load
- Intersection Observer usage
- Viewport images load first
- Below-the-fold images deferred
- Rapid scrolling handled gracefully
- Images outside viewport not loaded
- Blog post images lazy loaded
- Skeleton/placeholder while loading
- Images load on category filter change
- Image load error handling

**Key Validations:**
- Initial load < 50% of total images
- More images load on scroll
- Smooth fade-in transitions

### 5. Social Proof Notifications (`05-social-proof.cy.ts`)
Tests "X just purchased Y" notifications.

**Test Cases:**
- First notification within 3 seconds
- Notifications at 10-15 second intervals
- Display customer name and product
- Show different cities/locations
- Auto-dismiss after 5 seconds
- Manual dismissal
- Notifications on different pages
- Product images in notification
- Non-blocking user interactions
- Smooth slide-in animation
- Notification stacking
- Realistic customer names
- Variety of products
- Mobile responsiveness

**Key Validations:**
- 3s initial delay
- 10-15s intervals
- 5s auto-dismiss
- Contains realistic data

### 6. Complete Checkout Flow (`06-checkout-flow.cy.ts`)
Tests end-to-end purchase journey.

**Test Cases:**
- Add product to cart and navigate to checkout
- Display cart items in checkout
- Calculate subtotal correctly
- Apply QUIZMASTER15 promo (15% off)
- Apply SPICEFAN10 promo (10% off)
- Validate invalid promo codes
- Calculate final price with discount
- Fill customer information
- Validate required fields
- Select payment method
- Complete full checkout flow
- Update cart quantity
- Remove item from cart
- Save customer info to localStorage
- Order summary display
- Empty cart handling

**Key Validations:**
- Promo codes apply correct discounts
- Form validation works
- Order confirmation displayed

### 7. Mobile Responsiveness (`07-mobile-responsive.cy.ts`)
Tests mobile and tablet viewports.

**Devices Tested:**
- iPhone SE (375x667)
- iPhone 11 (414x896)
- Samsung Galaxy S20 (360x740)
- iPad (768x1024)
- iPad Air (820x1180)

**Test Cases:**
- Mobile menu button display
- Open/close mobile menu
- Responsive product grid
- Tappable buttons (44x44 min)
- No horizontal overflow
- Readable font sizes (14px min)
- Touch swipe on sliders
- Mobile-optimized header
- Product card tap
- Mobile-friendly forms
- Vertical cart item stacking
- Touch-friendly dropdowns
- Tablet 2-3 column grid
- Breakpoint testing (1024px, 768px, 480px)
- Landscape orientation
- Mobile performance
- Mobile lazy loading

**Key Validations:**
- No horizontal scroll
- Touch targets ≥ 44px
- Font size ≥ 14px
- Load time < 5s

## Running Tests

### Local Development

**Open Cypress Test Runner (GUI):**
```bash
npm run cypress:open
```
Interactive mode with visual test runner. Best for writing and debugging tests.

**Run All Tests (Headless):**
```bash
npm run test:e2e
```
Runs all tests in headless mode with Electron browser.

**Run with Specific Browser:**
```bash
npm run cypress:run:chrome
npm run cypress:run:firefox
npm run cypress:run:edge
```

**Run with Headed Mode:**
```bash
npm run test:e2e:headed
```
See browser window while tests run.

**Run Single Test File:**
```bash
npx cypress run --spec "cypress/e2e/01-dropdown-navigation.cy.ts"
```

**Run Tests with Tag:**
```bash
npx cypress run --spec "cypress/e2e/*-mobile-*.cy.ts"
```

### CI/CD Pipeline

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests targeting `main` or `develop`
- Nightly schedule (2 AM UTC)

**Browser Matrix:**
- Chrome (primary)
- Firefox
- Edge

**Artifacts Uploaded:**
- Screenshots (on failure)
- Videos (all tests)
- Test results
- Lighthouse CI reports

### Lighthouse CI

**Run Locally:**
```bash
npm install -g @lhci/cli
npm run build
npm run preview
lhci autorun
```

**CI/CD:**
Runs automatically after Cypress tests complete.

## Custom Commands

Located in `cypress/support/commands.ts`:

### `cy.checkWebVitals()`
Validates page performance metrics.
```typescript
cy.checkWebVitals();
```

### `cy.waitForLazyImages()`
Waits for lazy-loaded images to be visible.
```typescript
cy.waitForLazyImages();
```

### `cy.waitForSocialProofNotification()`
Waits up to 20 seconds for social proof notification.
```typescript
cy.waitForSocialProofNotification();
```

### `cy.addProductToCart(productName?)`
Adds product to cart and verifies toast notification.
```typescript
cy.addProductToCart(); // First product
cy.addProductToCart('Himalayan Saffron'); // Specific product
```

### `cy.navigateTo(page)`
Navigates to page using header links.
```typescript
cy.navigateTo('About');
cy.navigateTo('Contact');
cy.navigateTo('Blog');
```

### `cy.completeQuiz(correctAnswers)`
Automates quiz completion with correct or wrong answers.
```typescript
cy.completeQuiz(true);  // Perfect score
cy.completeQuiz(false); // All wrong
```

### `cy.applyPromoCode(code)`
Applies promo code in checkout.
```typescript
cy.applyPromoCode('QUIZMASTER15');
cy.applyPromoCode('SPICEFAN10');
```

## Configuration

### Cypress Config (`cypress.config.ts`)
```typescript
{
  e2e: {
    baseUrl: 'http://localhost:3001',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    retries: { runMode: 2, openMode: 0 }
  }
}
```

### Lighthouse Config (`lighthouserc.js`)
**Performance Budgets:**
- First Contentful Paint: < 1800ms
- Largest Contentful Paint: < 2500ms
- Cumulative Layout Shift: < 0.1
- Total Blocking Time: < 300ms
- Max Potential FID: < 100ms
- Speed Index: < 3400ms
- Time to Interactive: < 3800ms

**Size Budgets:**
- Scripts: < 500KB
- Stylesheets: < 100KB
- Images: < 2MB
- Fonts: < 150KB
- Total: < 3MB

**Scores:**
- Accessibility: ≥ 90
- Best Practices: ≥ 90
- SEO: ≥ 90
- PWA: ≥ 50 (warning only)

## Troubleshooting

### Common Issues

**1. Tests timing out**
- Increase `defaultCommandTimeout` in `cypress.config.ts`
- Use `cy.wait()` for animations
- Check if dev server is running

**2. Element not found**
- Use `{ force: true }` for hidden elements
- Wait for elements with `cy.wait()` or `.should('be.visible')`
- Check CSS selectors

**3. Flaky tests**
- Tests retry 2 times automatically in CI
- Add explicit waits: `cy.wait(500)`
- Use custom commands for common flows

**4. Video/screenshot not captured**
- Ensure `video: true` in config
- Check `cypress/videos` and `cypress/screenshots` folders
- Videos only recorded in run mode, not open mode

**5. Lighthouse CI failing**
- Ensure preview server is running
- Check performance budgets are realistic
- Review `.lighthouseci` folder for detailed reports

### Debug Mode

**Enable verbose logging:**
```bash
DEBUG=cypress:* npm run cypress:run
```

**Run single test with debug:**
```bash
npx cypress run --spec "cypress/e2e/01-dropdown-navigation.cy.ts" --headed --no-exit
```

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Use Custom Commands**: Reuse common flows
3. **Wait for Elements**: Use `.should('be.visible')` instead of `cy.wait()`
4. **Descriptive Names**: Clear test descriptions
5. **Screenshot on Failure**: Already configured globally
6. **Clean State**: `beforeEach()` resets state
7. **Assertions**: Multiple assertions per test for thorough validation
8. **Retries**: Configured for flaky test resilience

## Coverage Summary

| Feature | Test Coverage | Test Cases |
|---------|--------------|------------|
| Dropdown Navigation | ✅ | 5 tests |
| Quiz & Promo Codes | ✅ | 7 tests |
| Performance | ✅ | 12 tests |
| Lazy Loading | ✅ | 13 tests |
| Social Proof | ✅ | 14 tests |
| Checkout Flow | ✅ | 17 tests |
| Mobile Responsive | ✅ | 30+ tests |
| **Total** | **7 suites** | **98+ tests** |

## Next Steps

1. ✅ Cypress E2E testing - COMPLETED
2. ✅ GitHub Actions CI/CD - COMPLETED
3. ✅ Lighthouse CI - CONFIGURED
4. ⏳ Visual regression testing (Percy/Applitools)
5. ⏳ Real user monitoring (Datadog/New Relic)

## Support

For issues or questions:
1. Check test output in CI artifacts
2. Review Lighthouse CI reports
3. Run tests locally with `--headed` flag
4. Check custom command implementations in `cypress/support/commands.ts`
