# 🚀 GitHub Repository Setup Guide

## Step-by-Step Setup Instructions

### 1. Initialize Git Repository (If Not Done)

```bash
# Navigate to project directory
cd C:\Users\shubh\grocerywebsite

# Initialize git (if not already)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Tattva Co. with automated testing"
```

### 2. Create GitHub Repository

**Option A: Using GitHub Website**

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `grocerywebsite` or `tattva-co`
3. Description: "Premium organic grocery e-commerce platform with automated testing"
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README (we have one)
6. Click **Create repository**

**Option B: Using GitHub CLI**

```bash
# Install GitHub CLI if not installed
# Download from: https://cli.github.com/

# Login to GitHub
gh auth login

# Create repository
gh repo create grocerywebsite --public --source=. --remote=origin --push
```

### 3. Connect Local Repository to GitHub

```bash
# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/grocerywebsite.git

# Verify remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

### 4. Set Up GitHub Secrets

**For Lighthouse CI (Optional):**

1. Go to repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `LHCI_GITHUB_APP_TOKEN`
4. Value: (Get from [Lighthouse CI GitHub App](https://github.com/apps/lighthouse-ci))

**For Percy Visual Testing:**

1. Sign up at [percy.io](https://percy.io)
2. Create new project: "Tattva Co"
3. Copy your **PERCY_TOKEN**
4. In GitHub:
   - Settings → Secrets and variables → Actions
   - New repository secret
   - Name: `PERCY_TOKEN`
   - Value: (paste your Percy token)

### 5. Enable GitHub Actions

GitHub Actions should automatically enable when you push the workflow file.

**Verify:**

1. Go to repository → **Actions** tab
2. You should see "Cypress E2E Tests" workflow
3. If prompted, click **"I understand my workflows, go ahead and enable them"**

### 6. Configure Branch Protection (Recommended)

**Protect main branch:**

1. Repository → **Settings** → **Branches**
2. Click **Add rule** or **Add branch protection rule**
3. Branch name pattern: `main`
4. Enable:
   - ✅ **Require status checks to pass before merging**
   - ✅ **Require branches to be up to date before merging**
   - Select status checks:
     - `cypress-run (chrome)`
     - `cypress-run (firefox)`
     - `cypress-run (edge)`
     - `lighthouse-ci`
     - `percy-visual-tests`
5. Optional:
   - ✅ **Require pull request reviews before merging**
   - ✅ **Require signed commits**
   - ✅ **Include administrators**
6. Click **Create** or **Save changes**

### 7. Test GitHub Actions

**Trigger first workflow run:**

```bash
# Make a small change
echo "# Automated Testing Enabled" >> AUTOMATION_COMPLETE.md

# Commit and push
git add .
git commit -m "feat: enable automated testing with Percy"
git push origin main
```

**Monitor workflow:**

1. Go to **Actions** tab
2. Click on the running workflow
3. Watch real-time logs
4. Download artifacts after completion

### 8. Set Up Percy.io Integration

**After signing up at percy.io:**

1. **Create Project:**
   - Project name: "Tattva Co"
   - Type: Web
   - Framework: Cypress

2. **Get Token:**
   - Copy your `PERCY_TOKEN`
   - Add to GitHub Secrets (see step 4)

3. **Run Visual Tests:**

   ```bash
   # Local testing
   export PERCY_TOKEN=your_token_here
   npm run percy:snapshot
   ```

4. **View Results:**
   - Go to percy.io dashboard
   - See visual comparisons
   - Approve/reject changes

### 9. Percy Configuration

The `.percy.yml` file configures:

- Snapshot widths: 375, 768, 1280, 1920px
- Network idle timeout: 750ms
- Allowed hostnames: localhost

**Customize if needed:**

```yaml
snapshot:
  widths: [375, 768, 1280, 1920]
  minHeight: 1024
  percyCSS: |
    .announcement { display: none; }
```

### 10. Verify Everything Works

**Checklist:**

- [ ] Repository created on GitHub
- [ ] Code pushed successfully
- [ ] GitHub Actions enabled
- [ ] First workflow run completed
- [ ] Artifacts uploaded (videos, screenshots)
- [ ] Percy token added (if using)
- [ ] Lighthouse CI configured
- [ ] Branch protection enabled

**Test locally before pushing:**

```bash
# Run all tests
npm run test:e2e

# Run Percy tests (with token)
npm run percy:snapshot

# Run Lighthouse
npm run lighthouse:local
```

## Common Issues & Solutions

### Issue 1: GitHub Actions Not Running

**Solution:**

- Check `.github/workflows/cypress.yml` exists
- Verify GitHub Actions is enabled in Settings
- Check branch name matches (main vs master)

### Issue 2: Tests Failing in CI But Pass Locally

**Possible causes:**

- Different Node.js version
- Race conditions/timing issues
- Environment variables missing

**Solutions:**

- Match Node version (18) in workflow
- Add more cy.wait() or cy.should()
- Check required secrets are added

### Issue 3: Percy Not Capturing Snapshots

**Solution:**

- Verify PERCY_TOKEN is set
- Check Percy project exists
- Ensure @percy/cypress is installed
- Run `npx percy --version` to verify

### Issue 4: Lighthouse CI Failing Budgets

**Solution:**

- Review `.lighthouseci/` reports
- Adjust budgets in `lighthouserc.js`
- Optimize bundle size or images
- Make thresholds less strict initially

### Issue 5: Artifacts Not Uploading

**Solution:**

- Check paths in workflow (cypress/screenshots, cypress/videos)
- Ensure tests are actually running
- Verify upload-artifact action version

## Next Steps After Setup

### 1. Create Development Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# ...

# Run tests locally
npm run test:e2e

# Commit and push
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# Create Pull Request on GitHub
# Tests will run automatically
```

### 2. Set Up Notifications

**GitHub:**

- Settings → Notifications
- Choose email or webhook for workflow failures

**Percy:**

- Project settings → Integrations
- Connect to Slack/Discord for visual changes

**Lighthouse:**

- Set up alerts for budget violations
- Integrate with monitoring tools

### 3. Team Collaboration

**Add collaborators:**

1. Repository → Settings → Collaborators
2. Add team members
3. Set permissions

**Protected branches:**

- Require code reviews
- Require status checks
- Enforce on administrators

### 4. Continuous Improvement

**Weekly:**

- Review failed test artifacts
- Update test cases for new features
- Check Percy visual diffs

**Monthly:**

- Update dependencies
- Review performance budgets
- Analyze test coverage

**As Needed:**

- Add tests for bug fixes
- Update CI/CD configuration
- Optimize test execution time

## Useful GitHub Actions Commands

```bash
# View workflow status
gh run list

# Watch workflow run
gh run watch

# Download artifacts
gh run download <run-id>

# Cancel running workflow
gh run cancel <run-id>

# Re-run failed jobs
gh run rerun <run-id>
```

## Environment Variables Reference

| Variable                | Required  | Purpose                   | Where to Get         |
| ----------------------- | --------- | ------------------------- | -------------------- |
| `PERCY_TOKEN`           | For Percy | Visual regression testing | percy.io dashboard   |
| `LHCI_GITHUB_APP_TOKEN` | Optional  | Lighthouse PR comments    | GitHub App install   |
| `CYPRESS_RECORD_KEY`    | Optional  | Cypress Dashboard         | cypress.io dashboard |
| `CI`                    | Auto-set  | Indicates CI environment  | GitHub Actions       |

## Resources

- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **Percy Docs:** https://docs.percy.io/docs/cypress
- **Lighthouse CI Docs:** https://github.com/GoogleChrome/lighthouse-ci
- **Cypress Docs:** https://docs.cypress.io/

## Support

**Getting help:**

1. Check TESTING.md for test documentation
2. Review CI_CD_SETUP.md for configuration
3. Look at workflow logs in Actions tab
4. Download and review test artifacts

**Quick commands:**

```bash
# Test locally before pushing
npm run test:e2e

# Open Cypress GUI
npm run cypress:open

# Check what will run in CI
npm run test:ci
```

---

**Your repository is now ready for production! 🎉**

All tests will run automatically on every push and pull request.
