# 🚀 Quick Reference - Testing Commands

## Essential Commands

### 🧪 Run Tests

```bash
# Open Cypress GUI (best for development)
npm run cypress:open

# Run all tests headless (fast)
npm run test:e2e

# Run with Chrome
npm run cypress:run:chrome

# Run with Firefox
npm run cypress:run:firefox

# Run with Edge
npm run cypress:run:edge

# Run with visible browser (debugging)
npm run test:e2e:headed

# CI mode (optimized)
npm run test:ci
```

### ⚡ Performance Tests

```bash
# Run Lighthouse CI
npm run lighthouse

# Run Lighthouse locally (build + preview + test)
npm run lighthouse:local

# Run everything (E2E + Lighthouse)
npm run test:all
```

### 🔍 Debug Specific Tests

```bash
# Run single test file
npx cypress run --spec "cypress/e2e/01-dropdown-navigation.cy.ts"

# Run with debug logging
DEBUG=cypress:* npm run cypress:run

# Run multiple files
npx cypress run --spec "cypress/e2e/01-*.cy.ts,cypress/e2e/02-*.cy.ts"
```

## Test Suites Overview

| # | File | Focus | Tests |
|---|------|-------|-------|
| 01 | `dropdown-navigation.cy.ts` | Products hover delay | 5 |
| 02 | `quiz-promo-codes.cy.ts` | Quiz & discount codes | 7 |
| 03 | `performance-vitals.cy.ts` | Web Vitals, load time | 12 |
| 04 | `lazy-loading.cy.ts` | Image optimization | 13 |
| 05 | `social-proof.cy.ts` | Purchase notifications | 14 |
| 06 | `checkout-flow.cy.ts` | End-to-end purchase | 17 |
| 07 | `mobile-responsive.cy.ts` | Multi-device testing | 30+ |

**Total: 98+ automated tests**

## Custom Commands

```javascript
// Check page performance
cy.checkWebVitals();

// Wait for lazy images
cy.waitForLazyImages();

// Wait for social proof notification (20s timeout)
cy.waitForSocialProofNotification();

// Add product to cart
cy.addProductToCart('Himalayan Saffron');

// Navigate to page
cy.navigateTo('About');

// Complete quiz
cy.completeQuiz(true);  // correct answers
cy.completeQuiz(false); // wrong answers

// Apply promo code
cy.applyPromoCode('QUIZMASTER15');
```

## Viewing Results

### Local

```bash
# Videos
./cypress/videos/

# Screenshots (failures only)
./cypress/screenshots/

# Lighthouse reports
./.lighthouseci/
```

### CI (GitHub Actions)

1. Go to **Actions** tab
2. Click on workflow run
3. Download artifacts:
   - `cypress-screenshots-{browser}`
   - `cypress-videos-{browser}`
   - `cypress-results-{browser}`
   - `lighthouse-results`

## Configuration Files

| File | Purpose |
|------|---------|
| `cypress.config.ts` | Cypress settings |
| `cypress/support/commands.ts` | Custom commands |
| `cypress/support/e2e.ts` | Global hooks |
| `lighthouserc.js` | Performance budgets |
| `.github/workflows/cypress.yml` | CI/CD pipeline |

## Performance Budgets

- **FCP:** < 1800ms
- **LCP:** < 2500ms
- **CLS:** < 0.1
- **TBT:** < 300ms
- **FID:** < 100ms
- **TTI:** < 3800ms
- **Bundle:** < 3MB

## Documentation

- 📖 **[TESTING.md](./TESTING.md)** - Complete test guide
- 🔧 **[CI_CD_SETUP.md](./CI_CD_SETUP.md)** - CI/CD configuration
- ✅ **[AUTOMATION_COMPLETE.md](./AUTOMATION_COMPLETE.md)** - Implementation summary

## Troubleshooting

**Tests failing?**
```bash
npm run cypress:open  # Visual debugging
```

**Need more time?**
```javascript
// In test file
cy.wait(1000);  // Add explicit wait
```

**Flaky tests?**
- Tests retry 2x automatically in CI
- Check for timing issues
- Use custom commands

**CI failing?**
1. Check GitHub Actions logs
2. Download artifacts
3. Review videos/screenshots

## Pro Tips

✅ **DO:**
- Run `cypress:open` when writing tests
- Use custom commands for reusability
- Check videos on CI failures
- Keep tests independent

❌ **DON'T:**
- Use long `cy.wait()` without reason
- Ignore TypeScript warnings
- Skip test documentation
- Make tests depend on each other

---

**Quick Start:**
```bash
npm run cypress:open    # Start testing!
```

**CI Status:**
Check `.github/workflows/cypress.yml` for pipeline status.

**Need Help?**
See `TESTING.md` for comprehensive documentation.
