# 📊 Analytics Setup Guide

## Quick Start

### 1. Get Your Google Analytics ID

1. Go to [Google Analytics](https://analytics.google.com)
2. Sign in with your Google account
3. Click **"Admin"** (gear icon in bottom left)
4. Under "Property", click **"Data Streams"**
5. Click your website stream (or create one if needed)
6. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### 2. Add to .env File

Open `.env` in your project root and replace the placeholder:

```bash
# Replace this:
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# With your real ID:
VITE_GA_MEASUREMENT_ID=G-ABC1234DEF
```

### 3. Restart Dev Server

```bash
# Stop the current dev server (Ctrl+C)
npm run dev
```

### 4. Verify It's Working

1. Open your website: http://localhost:3000
2. Open DevTools Console (F12)
3. Look for: `📊 Google Analytics initialized`
4. In Google Analytics, go to **Reports → Realtime** - you should see yourself!

---

## 🎯 Events Already Tracked

Your app automatically tracks these events:

### E-commerce Events:

- ✅ **Product View** - When user clicks product detail
- ✅ **Add to Cart** - When item added
- ✅ **Remove from Cart** - When item removed
- ✅ **Begin Checkout** - When user starts checkout
- ✅ **Purchase** - When order completed
- ✅ **Search** - When user searches products

### Gamification Events:

- ✅ **Quiz Completion** - Score and promo code earned
- ✅ **Points Earned** - Loyalty points added
- ✅ **Badge Unlock** - Achievement unlocked

---

## 🔍 Viewing Your Data

### Realtime Reports

- Go to **Reports → Realtime** to see live users

### E-commerce Reports

- Go to **Reports → Monetization → Ecommerce purchases**
- See revenue, products sold, conversion rates

### Events

- Go to **Reports → Engagement → Events**
- See all custom events and their counts

### User Behavior

- Go to **Reports → Engagement → Pages and screens**
- See most visited pages, time on page

---

## 🎨 Custom Event Tracking (Optional)

Want to track more events? Use the analytics utilities:

```tsx
import { trackEvent } from './utils/analytics';

// Track any custom event
trackEvent('button_click', {
  button_name: 'Newsletter Signup',
  location: 'footer',
});

// Track page view
trackPageView('/custom-page', 'Custom Page Title');
```

---

## 🔥 Hotjar Setup (Optional - for Heatmaps)

Hotjar shows you HOW users interact with your site (mouse movements, clicks, scrolls).

### 1. Sign Up

Go to [Hotjar.com](https://www.hotjar.com) and create free account

### 2. Get Site ID

1. Add your website
2. Copy the **Site ID** (just numbers, e.g., `3456789`)

### 3. Add to .env

```bash
VITE_HOTJAR_SITE_ID=3456789
```

### 4. Features You'll Get:

- **Heatmaps** - See where users click most
- **Recordings** - Watch real user sessions
- **Surveys** - Ask users for feedback
- **Funnels** - See where users drop off

---

## 🚫 Privacy & GDPR

### Current Setup:

- ✅ No personal data collected
- ✅ Google Analytics anonymizes IPs
- ✅ No cookies before user consent

### For Production (Recommended):

Add a cookie consent banner:

```tsx
// Install cookie consent library
npm install react-cookie-consent

// Add to App.tsx
import CookieConsent from "react-cookie-consent";

<CookieConsent>
  This site uses cookies for analytics.
</CookieConsent>
```

---

## 📈 Success Metrics to Watch

### Week 1:

- ✅ Unique visitors
- ✅ Bounce rate (should be < 60%)
- ✅ Average session duration (target: > 2 min)

### Month 1:

- ✅ Cart abandonment rate
- ✅ Product view → Add to cart rate
- ✅ Quiz completion rate
- ✅ Top selling products

### Month 3:

- ✅ Customer lifetime value
- ✅ Repeat purchase rate
- ✅ Revenue per user
- ✅ Conversion rate by traffic source

---

## 🐛 Troubleshooting

### "Not seeing data in Google Analytics"

1. Wait 24-48 hours for data to appear (except Realtime)
2. Check your Measurement ID is correct
3. Check browser console for errors
4. Make sure ad blocker is disabled
5. Use "Realtime" reports to see immediate data

### "Console shows 'not initialized'"

- Your .env file isn't being read
- Restart dev server: `npm run dev`
- Check file is named exactly `.env` (not `.env.txt`)

### "Getting errors about gtag"

- Check `utils/analytics.ts` file exists
- Make sure you imported `initGA` correctly

---

## 🎓 Next Steps

1. ✅ Setup Google Analytics (5 minutes)
2. ✅ Verify it's tracking (check Realtime)
3. ⏳ Set up conversion goals (10 minutes)
4. ⏳ Create custom dashboard (15 minutes)
5. ⏳ Set up weekly email reports (5 minutes)

---

## 📚 Resources

- [Google Analytics 4 Guide](https://support.google.com/analytics/answer/9304153)
- [E-commerce Tracking](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
- [Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [Hotjar Guide](https://help.hotjar.com/hc/en-us)

---

**Questions?** Check `utils/analytics.ts` for all available functions!
