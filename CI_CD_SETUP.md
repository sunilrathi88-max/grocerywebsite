# CI/CD Setup Guide

## Overview
This guide explains how to set up continuous integration and deployment for Tattva Co. using GitHub Actions, Cypress, and Lighthouse CI.

## Prerequisites

1. **GitHub Repository**
   - Push your code to GitHub
   - Ensure `.github/workflows/cypress.yml` is committed

2. **Node.js Version**
   - CI uses Node.js 18
   - Ensure `package.json` engines field if needed:
     ```json
     "engines": {
       "node": ">=18.0.0"
     }
     ```

3. **Environment Variables**
   - No secrets required for basic setup
   - Optional: `LHCI_GITHUB_APP_TOKEN` for Lighthouse CI integration

## GitHub Actions Setup

### Automatic Triggers

The CI pipeline runs on:

1. **Push to Main/Develop**
   ```yaml
   on:
     push:
       branches: [main, develop]
   ```

2. **Pull Requests**
   ```yaml
   on:
     pull_request:
       branches: [main, develop]
   ```

3. **Scheduled (Nightly)**
   ```yaml
   on:
     schedule:
       - cron: '0 2 * * *'  # 2 AM UTC daily
   ```

### Pipeline Jobs

#### 1. Cypress E2E Tests
**Job:** `cypress-run`

**Matrix Strategy:**
- Runs tests in parallel across 3 browsers
- Chrome (primary)
- Firefox
- Edge

**Steps:**
1. Checkout code
2. Setup Node.js 18 with npm cache
3. Install dependencies (`npm ci`)
4. Build application
5. Start dev server in background
6. Wait for server (http://localhost:3001)
7. Run Cypress tests with specified browser
8. Upload artifacts:
   - Screenshots (on failure)
   - Videos (always)
   - Test results (always)

**Artifacts Retention:**
- Screenshots: 7 days
- Videos: 7 days
- Test results: 30 days

#### 2. Lighthouse CI
**Job:** `lighthouse-ci`

**Depends On:** `cypress-run` (runs after E2E tests)

**Steps:**
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Build application
5. Install Lighthouse CI globally
6. Start preview server (`npm run preview`)
7. Wait for server (http://localhost:4173)
8. Run Lighthouse CI with `lighthouserc.js` config
9. Upload Lighthouse results (30 days retention)

**Performance Budgets:**
- First Contentful Paint: < 1800ms
- Largest Contentful Paint: < 2500ms
- Cumulative Layout Shift: < 0.1
- Total Blocking Time: < 300ms
- Speed Index: < 3400ms
- Time to Interactive: < 3800ms

**Size Budgets:**
- JavaScript: < 500KB
- CSS: < 100KB
- Images: < 2MB
- Fonts: < 150KB
- Total: < 3MB

#### 3. Test Summary
**Job:** `test-summary`

**Depends On:** Both previous jobs

**Purpose:**
- Downloads all artifacts
- Creates markdown summary in GitHub UI
- Always runs even if tests fail

## Lighthouse CI Setup

### Option 1: Temporary Public Storage (Default)
No setup required. Results stored temporarily.

```js
// lighthouserc.js
upload: {
  target: 'temporary-public-storage',
}
```

### Option 2: Lighthouse CI Server
For persistent storage and historical tracking.

**Setup:**
1. Deploy Lighthouse CI server (Heroku, AWS, etc.)
2. Generate project token
3. Add to GitHub Secrets as `LHCI_SERVER_TOKEN`
4. Update `lighthouserc.js`:
   ```js
   upload: {
     target: 'lhci',
     serverBaseUrl: 'https://your-lhci-server.com',
     token: process.env.LHCI_SERVER_TOKEN,
   }
   ```

### Option 3: GitHub App Integration
For PR status checks and comments.

**Setup:**
1. Install Lighthouse CI GitHub App
2. Generate token
3. Add to GitHub Secrets as `LHCI_GITHUB_APP_TOKEN`
4. Update workflow:
   ```yaml
   env:
     LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
   ```

## Local Testing Before CI

### Run Full Test Suite Locally

```bash
# Install dependencies
npm install

# Run Cypress tests
npm run test:e2e

# Run with specific browser
npm run cypress:run:chrome

# Run Lighthouse CI
npm run build
npm run preview &
npm run lighthouse

# Or run everything
npm run test:all
```

### Debug Failing Tests

```bash
# Open Cypress GUI
npm run cypress:open

# Run with headed mode
npm run test:e2e:headed

# Run single test file
npx cypress run --spec "cypress/e2e/01-dropdown-navigation.cy.ts"

# Enable debug logging
DEBUG=cypress:* npm run cypress:run
```

## Viewing CI Results

### GitHub Actions UI

1. Go to repository → **Actions** tab
2. Click on workflow run
3. View job logs and artifacts

**Artifacts:**
- `cypress-screenshots-chrome` - Screenshots on failure
- `cypress-videos-chrome` - Test execution videos
- `cypress-results-chrome` - Test reports
- `lighthouse-results` - Performance reports

### Download Artifacts

```bash
# Using GitHub CLI
gh run download <run-id>

# Or download from web UI
# Actions → Workflow Run → Artifacts section
```

### Read Lighthouse Reports

```bash
# Extract downloaded artifacts
unzip lighthouse-results.zip

# Open HTML reports
cd .lighthouseci
open lhr-*.html
```

## Branch Protection Rules

### Recommended Settings

**Require Status Checks:**
1. Go to Settings → Branches → Branch protection rules
2. Add rule for `main` and `develop`
3. Enable:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date
   - Status checks:
     - `cypress-run (chrome)`
     - `cypress-run (firefox)`
     - `cypress-run (edge)`
     - `lighthouse-ci`

**Optional:**
- Require pull request reviews
- Require signed commits
- Include administrators

## Performance Monitoring

### Adjusting Budgets

Edit `lighthouserc.js` to adjust thresholds:

```js
assertions: {
  // Make stricter
  'largest-contentful-paint': ['error', { maxNumericValue: 2000 }],
  
  // Make more lenient
  'largest-contentful-paint': ['warn', { maxNumericValue: 3000 }],
  
  // Disable check
  'uses-optimized-images': 'off',
}
```

### Monitoring Trends

**With Lighthouse CI Server:**
- View historical performance data
- Track regressions over time
- Compare branches

**Without Server:**
- Download artifacts from each run
- Manually compare reports
- Use GitHub Actions UI for trends

## Troubleshooting

### Common CI Failures

**1. Tests timeout in CI**
```yaml
# Increase wait-on timeout
- run: npx wait-on http://localhost:3001 --timeout 120000
```

**2. Build fails**
```bash
# Check Node.js version
- uses: actions/setup-node@v3
  with:
    node-version: '18'
```

**3. Lighthouse CI fails budgets**
- Review reports in artifacts
- Adjust budgets in `lighthouserc.js`
- Optimize bundle size

**4. Flaky tests**
- Tests retry 2 times automatically
- Check for timing issues
- Add explicit waits

**5. Out of disk space**
```yaml
# Clean up before running
- run: docker system prune -af
```

### Debugging Workflow

1. **Enable debug logging:**
   ```yaml
   - run: npm run cypress:run
     env:
       DEBUG: cypress:*
   ```

2. **SSH into runner (for investigation):**
   ```yaml
   - name: Setup tmate session
     uses: mxschmitt/action-tmate@v3
   ```

3. **Check artifacts:**
   - Always download videos/screenshots
   - Review test failure logs

## Optimization Tips

### Speed Up CI

1. **Cache Dependencies:**
   ```yaml
   - uses: actions/setup-node@v3
     with:
       cache: 'npm'
   ```

2. **Run Tests in Parallel:**
   ```yaml
   strategy:
     matrix:
       shard: [1, 2, 3, 4]
   ```

3. **Skip Redundant Steps:**
   ```yaml
   if: github.event_name != 'schedule'
   ```

### Reduce Costs

1. **Limit concurrent jobs:**
   ```yaml
   concurrency:
     group: ${{ github.workflow }}-${{ github.ref }}
     cancel-in-progress: true
   ```

2. **Skip CI on docs changes:**
   ```yaml
   on:
     push:
       paths-ignore:
         - '**.md'
         - 'docs/**'
   ```

3. **Use matrix strategically:**
   - Run Chrome only on PRs
   - Run all browsers on merge to main

## Next Steps

### Visual Regression Testing

**Percy.io Integration:**
```bash
npm install --save-dev @percy/cypress
```

```js
// cypress/support/commands.ts
import '@percy/cypress';

// In tests
cy.percySnapshot('Homepage');
```

**GitHub Actions:**
```yaml
env:
  PERCY_TOKEN: ${{ secrets.PERCY_TOKEN }}
```

### Real User Monitoring

**Datadog Synthetics:**
- Create synthetic tests for key flows
- Monitor from multiple locations
- Set up alerts for failures

**New Relic Synthetics:**
- Similar to Datadog
- Integrates with APM

## Support

**Documentation:**
- [TESTING.md](./TESTING.md) - Test documentation
- [Cypress Docs](https://docs.cypress.io/)
- [Lighthouse CI Docs](https://github.com/GoogleChrome/lighthouse-ci)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

**Troubleshooting:**
1. Check CI logs in GitHub Actions
2. Download and review artifacts
3. Run tests locally with same Node version
4. Enable debug logging
