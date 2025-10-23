# 🚀 Deployment Checklist - Live Session

**Date:** October 23, 2025  
**Target Platform:** Vercel  
**Status:** 🔄 In Progress

---

## ✅ Pre-Deployment Verification (Completed)

- [x] Vercel CLI installed (v48.2.9)
- [x] All tests passing (158/158)
- [x] Bundle optimized (109 KB gzipped)
- [x] TypeScript clean (0 errors)
- [x] ESLint clean (0 errors)
- [x] Service Worker configured
- [x] PWA manifest ready
- [x] CI/CD pipeline configured

---

## 🎯 Current Task: Deploy to Vercel

### Step 1: Login to Vercel

Run this command in your terminal:

```powershell
vercel login
```

This will open your browser to authenticate with Vercel. Choose your preferred login method:

- GitHub (Recommended - enables auto-deployments)
- GitLab
- Bitbucket
- Email

### Step 2: Deploy to Preview Environment

Once logged in, deploy to a preview environment first:

```powershell
vercel
```

This will:

1. Link your project (or create a new one)
2. Upload your code
3. Build the project
4. Deploy to a preview URL
5. Give you a unique URL like: `https://grocerywebsite-xyz.vercel.app`

### Step 3: Test Preview Deployment

Before promoting to production, test the preview deployment:

- [ ] Visit the preview URL
- [ ] Test homepage loads
- [ ] Test navigation
- [ ] Test product filtering
- [ ] Test add to cart
- [ ] Test checkout flow
- [ ] Check browser console for errors
- [ ] Test on mobile device

### Step 4: Deploy to Production

If preview looks good, deploy to production:

```powershell
vercel --prod
```

This will deploy to your production URL.

### Step 5: Configure Custom Domain (Optional)

If you have a custom domain:

```powershell
vercel domains add yourdomain.com
```

Then configure DNS:

- Type: `CNAME`
- Name: `@` (or `www`)
- Value: `cname.vercel-dns.com`

---

## 🔐 GitHub Secrets Setup

To enable automated deployments, add these secrets to your GitHub repository:

### Getting the Values

1. **VERCEL_TOKEN**
   - Go to https://vercel.com/account/tokens
   - Click "Create Token"
   - Name it "GitHub Actions"
   - Copy the token (you'll only see it once!)

2. **VERCEL_ORG_ID** and **VERCEL_PROJECT_ID**
   - After running `vercel` locally, check the `.vercel` folder
   - Open `.vercel/project.json`
   - Copy `orgId` and `projectId`

### Adding Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret:
   - Name: `VERCEL_TOKEN`, Value: [paste token]
   - Name: `VERCEL_ORG_ID`, Value: [paste orgId]
   - Name: `VERCEL_PROJECT_ID`, Value: [paste projectId]

Once added, every push to `main` will auto-deploy to production! 🎉

---

## 📱 PWA Testing Checklist

After deployment, test PWA features:

### Service Worker Registration

1. Open deployed site in Chrome
2. Open DevTools (F12)
3. Go to **Application** tab → **Service Workers**
4. Verify:
   - [ ] Service Worker is registered
   - [ ] Status shows "activated and is running"
   - [ ] Update on reload is checked

### Offline Functionality

1. In DevTools → **Network** tab
2. Check **Offline** checkbox
3. Reload the page
4. Verify:
   - [ ] Page loads from cache
   - [ ] Images load from cache
   - [ ] Navigation works
   - [ ] "You're offline" toast appears (if implemented)

### Cache Storage

1. DevTools → **Application** → **Cache Storage**
2. Verify caches exist:
   - [ ] `workbox-precache-v2-*` (precached assets)
   - [ ] `workbox-runtime-*` (runtime caches)
3. Check cached resources:
   - [ ] HTML files
   - [ ] JavaScript bundles
   - [ ] CSS files
   - [ ] Images
   - [ ] Fonts

### PWA Manifest

1. DevTools → **Application** → **Manifest**
2. Verify:
   - [ ] Name: "Tattva & Co."
   - [ ] Theme Color: #FFB7C1
   - [ ] Icons: 192x192, 512x512
   - [ ] Display: standalone
   - [ ] No errors or warnings

### Install Prompt (Desktop)

1. Visit site in Chrome/Edge
2. Look for install button in address bar (⊕ icon)
3. Click to install
4. Verify:
   - [ ] Install dialog appears
   - [ ] App icon shows correctly
   - [ ] App installs successfully
   - [ ] Opens in standalone window
   - [ ] App appears in Start Menu/Applications

### Add to Home Screen (Mobile)

1. Visit site on Android Chrome or iOS Safari
2. Tap browser menu (⋮)
3. Look for "Add to Home Screen" or "Install"
4. Verify:
   - [ ] Option is available
   - [ ] App icon shows on home screen
   - [ ] Opens in standalone mode
   - [ ] Splash screen appears

### Update Notification

1. Make a small change to the code
2. Deploy the update
3. Visit the site (keep DevTools open)
4. Wait for Service Worker to detect update
5. Verify:
   - [ ] "New version available" toast appears
   - [ ] Clicking refresh updates the app
   - [ ] New service worker activates

---

## 🖼️ WebP Image Conversion

Convert images to WebP for 25-35% size reduction:

### Install Sharp

```powershell
npm install sharp --save-dev
```

### Run Conversion (Standard)

```powershell
npm run images:convert
```

This converts all images to WebP format (80% quality).

### Run Conversion (Responsive)

```powershell
npm run images:convert:responsive
```

This generates multiple sizes (400w, 600w, 800w, 1024w, 1536w) for responsive images.

### Verify Conversion

Check the output:

- [ ] Original images still exist
- [ ] `.webp` files created alongside originals
- [ ] File sizes reduced by ~25-35%
- [ ] Quality looks good (80% is usually imperceptible)

### Update and Deploy

After conversion:

```powershell
git add public/
git commit -m "feat: add WebP images for better performance"
git push origin main
```

The deployment will automatically trigger (if GitHub secrets are configured).

---

## 🔍 Lighthouse Audit

Run Lighthouse on your production deployment:

### Command Line

```powershell
npx lighthouse https://your-production-url.vercel.app --view
```

Options:

- `--view`: Opens report in browser
- `--output=html`: Save HTML report
- `--output=json`: Save JSON report
- `--preset=desktop`: Desktop audit (default is mobile)

### Expected Scores

| Category       | Target | Status |
| -------------- | ------ | ------ |
| Performance    | ≥ 85   | ⏳     |
| Accessibility  | ≥ 90   | ⏳     |
| Best Practices | ≥ 90   | ⏳     |
| SEO            | ≥ 90   | ⏳     |
| PWA            | ≥ 80   | ⏳     |

### Key Metrics to Check

- **First Contentful Paint (FCP)**: < 2s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Total Blocking Time (TBT)**: < 300ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Speed Index**: < 3s

### If Scores Are Low

1. **Performance < 85**:
   - Check for unoptimized images → Run WebP conversion
   - Look for render-blocking resources
   - Check bundle size (should be ~109 KB)

2. **Accessibility < 90**:
   - Check for missing alt attributes
   - Verify color contrast ratios
   - Ensure ARIA labels are present

3. **PWA < 80**:
   - Verify Service Worker is registered
   - Check manifest.webmanifest is loading
   - Ensure HTTPS is enabled (Vercel does this automatically)

---

## 📊 Post-Deployment Monitoring

### Vercel Analytics (Built-in)

1. Go to Vercel Dashboard
2. Select your project
3. Click **Analytics** tab
4. Enable Real User Monitoring (if not already enabled)

Metrics available:

- Page views
- Unique visitors
- Top pages
- Top referrers
- Core Web Vitals (LCP, FID, CLS)

### Custom Domain Setup

If you want to use a custom domain:

1. In Vercel Dashboard → **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `tattva-co.com`)
4. Follow DNS configuration instructions
5. Wait for SSL certificate (auto-provisioned in ~1 minute)

### Environment Variables

If you need to add environment variables:

1. Vercel Dashboard → **Settings** → **Environment Variables**
2. Add variables:
   - `VITE_API_URL` (if using external API)
   - `VITE_APP_NAME` (optional)
3. Redeploy: `vercel --prod`

---

## ✅ Completion Checklist

### Deployment

- [ ] Vercel login successful
- [ ] Preview deployment tested
- [ ] Production deployment successful
- [ ] Site accessible at production URL
- [ ] No console errors
- [ ] All pages load correctly

### GitHub Secrets

- [ ] VERCEL_TOKEN added
- [ ] VERCEL_ORG_ID added
- [ ] VERCEL_PROJECT_ID added
- [ ] Test push triggers auto-deployment

### PWA Testing

- [ ] Service Worker registered
- [ ] Offline mode works
- [ ] Cache storage populated
- [ ] Manifest valid
- [ ] Install prompt works
- [ ] Add to home screen works (mobile)
- [ ] Update notification works

### Image Optimization

- [ ] Sharp installed
- [ ] Images converted to WebP
- [ ] File sizes reduced
- [ ] Quality acceptable
- [ ] Changes committed and deployed

### Performance Audit

- [ ] Lighthouse run on production URL
- [ ] Performance score ≥ 85
- [ ] Accessibility score ≥ 90
- [ ] PWA score ≥ 80
- [ ] Core Web Vitals met (LCP < 2.5s, CLS < 0.1)

---

## 🎉 Success Criteria

Your deployment is successful when:

✅ **Site is live** at production URL  
✅ **All features work** (navigation, cart, checkout)  
✅ **PWA features active** (offline, installable)  
✅ **Performance score** ≥ 85  
✅ **Auto-deployments work** (push to main → deploy)  
✅ **Images optimized** (WebP conversion complete)

---

## 🆘 Troubleshooting

### Build Fails on Vercel

**Error:** "Build failed"

- Check build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`
- Try building locally: `npm run build`

### Service Worker Not Updating

**Issue:** Old version loads after deployment

- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Unregister SW in DevTools → Application → Service Workers
- Check `sw.js` has `Cache-Control: max-age=0`

### 404 on Page Refresh

**Issue:** Direct URLs return 404

- Vercel should handle this automatically with `vercel.json`
- Verify `vercel.json` has rewrites configured
- Check deployment logs for routing issues

### Images Not Loading

**Issue:** 404 for images

- Verify images are in `public/` folder
- Check file paths are correct
- Ensure images are committed to git

---

**Ready to deploy?** Start with Step 1: `vercel login` 🚀
