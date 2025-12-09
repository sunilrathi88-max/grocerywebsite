# Messaging Verification & Testing Plan

## 1. Before/After Audit
We have successfully implemented the StoryBrand PEACE framework. Here is the comparison of the transformation:

| Feature | Before (Old Version) | After (PEACE Implementation) |
| :--- | :--- | :--- |
| **Hero Headline** | Generic/Rotating Product | **"From Flavorless Dust... To Dishes That Taste Alive."** |
| **Hero CTA** | "Shop Now" | **"Browse Collections"** (Clearer path) |
| **Product Desc** | "Premium handpicked organic..." | **"Your dishes will taste alive—never bland again."** |
| **Why Section** | Generic Icon Features | **3-Card PEACE Grid** (Quality, Trust, Experience problems resolved) |
| **Brand Story** | Hidden/About Page | **Homepage Section** ("Why We Started Rathi Naturals") |

## 2. Testing Strategy
To validate the effectiveness of the new messaging, we recommend the following tests:

### A. Smoke Tests (Immediate)
- [ ] **Navigation Check:** Verify "Why Us" and "Our Story" links scroll correctly on Desktop & Mobile.
- [ ] **Responsiveness:** Check the new Hero text size on mobile screens (375px).
- [ ] **Flow:** Click "Browse Collections" -> Select Product -> Add to Cart -> Verify "Outcome" description is visible.

### B. A/B Testing (Next Phase)
Using a tool like Google Optimize or Vercel Edge Config (if migrating):
- **Variant A (Control):** Current PEACE messaging (Outcome-focused).
- **Variant B (Test):** Feature-focused (e.g., "100% Organic, High Curcumin").
- **Metric to Watch:** Add-to-Cart Rate and Time on Page.

### C. User Feedback Loop
- **Post-Purchase Survey:** Add a question: "What was the main reason you trusted us today?"
  - *Goal:* See if they mention "Purity" or "Flavor" (matching our soundbites).

## 3. SEO Monitoring
- Monitor CTR (Click-Through Rate) in Search Console for the new meta descriptions (derived from the new product soundbites).
