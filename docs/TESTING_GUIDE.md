# 🧪 Comprehensive Feature Testing Guide

**Date:** October 20, 2025  
**Server:** http://localhost:3001/  
**Status:** Ready for Testing

---

## 📋 Testing Checklist

### ✅ Test 1: Products Dropdown Hover

**What we're testing:** The fix for dropdown closing too quickly

**Steps:**

1. ✅ Open browser to http://localhost:3001
2. ✅ Locate the "Products" link in the header navigation
3. ✅ Hover your mouse over "Products" button
4. ✅ **Expected:** Dropdown should appear with categories
5. ✅ Move your mouse from the button INTO the dropdown area
6. ✅ **Expected:** Dropdown should STAY OPEN (300ms delay)
7. ✅ Hover over a category (e.g., "Spices", "Nuts")
8. ✅ **Expected:** Category should highlight
9. ✅ Click on a category
10. ✅ **Expected:** Page scrolls to products section and filters by category

**Success Criteria:**

- ✅ Dropdown doesn't close immediately when mouse leaves button
- ✅ You can move mouse into dropdown without it disappearing
- ✅ Categories are clickable
- ✅ Clicking category applies filter

**If it fails:**

- Check console for errors
- Verify Header.tsx has handleProductsEnter/Leave functions
- Ensure dropdown has onMouseEnter/onMouseLeave handlers

---

### ✅ Test 2: Quiz Promo Code Generation

**What we're testing:** Enhanced quiz with 8 questions and promo rewards

**Steps:**

1. ✅ Scroll down the homepage to the "Test Your Spice Knowledge" section
2. ✅ You should see the quiz module with Question 1
3. ✅ **Current Question:** "Which of our spices gives biryani its beautiful golden hue?"
4. ✅ Select an answer (correct: Himalayan Saffron)
5. ✅ Click "Next" button
6. ✅ Continue through all 8 questions
7. ✅ After Question 8, you'll see the results screen

**Expected Results Screen:**

**For Perfect Score (8/8):**

```
🎉 Perfect Score! You're a Spice Master!

Your Score: 8 / 8
[Progress bar at 100%]

✅ 8 Correct | ❌ 0 Wrong
Points Earned: 80 / 80

🎁 Congratulations! You earned a reward!
QUIZMASTER15
15% off your next order!

[Play Again] [Copy Code]
```

**For 7/8 Score:**

```
🌟 Excellent! You know your spices!

Your Score: 7 / 8
[Progress bar at 87.5%]

✅ 7 Correct | ❌ 1 Wrong
Points Earned: 70 / 80

🎁 Congratulations! You earned a reward!
SPICEFAN10
10% off your next order!

[Play Again] [Copy Code]
```

**Testing the Promo Code:**

1. ✅ Click "Copy Code" button
2. ✅ **Expected:** Toast notification "Promo code copied to clipboard!"
3. ✅ Navigate to checkout (add a product first if cart is empty)
4. ✅ Paste the code in the promo code field
5. ✅ Click "Apply"
6. ✅ **Expected:** Discount applied (15% or 10% based on score)

**Success Criteria:**

- ✅ All 8 questions appear
- ✅ Results screen shows performance rating
- ✅ Progress bar animates smoothly
- ✅ Stats breakdown appears (correct/wrong)
- ✅ Points earned displayed correctly
- ✅ Promo code appears for 7+ score
- ✅ Copy to clipboard works
- ✅ Promo code works in checkout

---

### ✅ Test 3: Web Vitals Console Logs

**What we're testing:** Performance monitoring system

**Steps:**

1. ✅ Open browser DevTools (F12 or Right-click → Inspect)
2. ✅ Click on the "Console" tab
3. ✅ Clear the console (🚫 icon or Ctrl+L)
4. ✅ Refresh the page (F5 or Ctrl+R)
5. ✅ Wait 3-5 seconds for metrics to appear

**Expected Console Output:**

```javascript
Google Analytics initialized with ID: [or message about no ID]
Hotjar initialized with ID: [or message about no ID]

// Performance Metrics (should appear)
LCP: 1234.5          // Largest Contentful Paint (should be < 2500ms)
FID: 12.3            // First Input Delay (should be < 100ms)
CLS: 0.045           // Cumulative Layout Shift (should be < 0.1)

// When you interact with the page
Page view tracked: /
Event tracked: { category: 'User Interaction', ... }
```

**What to Look For:**

**Good Performance (Green):**

- ✅ LCP < 2500ms (e.g., 1200ms, 1800ms)
- ✅ FID < 100ms (e.g., 15ms, 45ms)
- ✅ CLS < 0.1 (e.g., 0.05, 0.08)

**Needs Improvement (Yellow):**

- ⚠️ LCP 2500-4000ms
- ⚠️ FID 100-300ms
- ⚠️ CLS 0.1-0.25

**Poor Performance (Red):**

- ❌ LCP > 4000ms
- ❌ FID > 300ms
- ❌ CLS > 0.25

**Additional Checks:**

1. ✅ Click on a product → Should log "Event tracked: view_item"
2. ✅ Add to cart → Should log "Event tracked: add_to_cart"
3. ✅ Search for product → Should log "Event tracked: search"

**Success Criteria:**

- ✅ LCP, FID, CLS values appear in console
- ✅ Performance metrics are in "good" range
- ✅ No console errors (red text)
- ✅ Analytics events tracked on user actions

**If no logs appear:**

- Verify `usePerformanceMonitoring()` is called in App.tsx
- Check if browser supports PerformanceObserver (modern browsers do)
- Look for any JavaScript errors blocking execution

---

### ✅ Test 4: Lazy Loading Images

**What we're testing:** Images loading on-demand as you scroll

**Steps:**

1. ✅ Open DevTools (F12)
2. ✅ Click on "Network" tab
3. ✅ Filter by "Img" or "Images" (click the Img button)
4. ✅ Clear network log (🚫 icon)
5. ✅ Refresh the page (F5)
6. ✅ **Observe:** Only images above the fold (visible area) should load
7. ✅ Scroll down slowly to the ProductGrid section
8. ✅ **Observe:** Images load AS YOU SCROLL near them (50px before visible)
9. ✅ Keep scrolling through products
10. ✅ **Observe:** Each row of products loads images just before appearing

**What to Look For in Network Tab:**

**Initial Load (Page Top):**

```
hero-slide-1.svg         ← Hero image (immediately)
hero-slide-2.svg         ← Preloaded
hero-slide-3.svg         ← Preloaded
(5-8 product images)     ← First row of products
```

**As You Scroll:**

```
product-image-9.svg      ← Loaded when scrolling to 2nd row
product-image-10.svg     ← 50px before visible
product-image-11.svg     ← Just-in-time loading
```

**Success Indicators:**

- ✅ Not all ~20+ product images load at once
- ✅ Images load in batches as you scroll
- ✅ Smooth fade-in animation when images appear
- ✅ "lazy" attribute visible in img tags (inspect element)
- ✅ Network waterfall shows staggered loading

**Performance Impact:**

- **Before Lazy Loading:** 20+ images = ~2-3MB in 1-2 seconds
- **After Lazy Loading:** 5-8 images = ~500KB-1MB initially, rest on-demand

**Visual Check:**

1. ✅ Product images have smooth fade-in (opacity 0 → 1)
2. ✅ Gray placeholder briefly visible before image loads
3. ✅ No layout shift when images load (space reserved)

---

### ✅ Test 5: Social Proof Notifications

**What we're testing:** Live purchase notification popups

**Steps:**

1. ✅ Load the homepage
2. ✅ Look at the **bottom-left corner** of the screen
3. ✅ Wait approximately **3 seconds** (initial delay)
4. ✅ **Expected:** First notification appears sliding in from left

**Notification Format:**

```
┌─────────────────────────────────────┐
│ ✓ Verified                          │
│                                     │
│ Someone in Mumbai just purchased    │
│ Himalayan Pink Salt                 │
│ 2 minutes ago                       │
│                                  [X]│
└─────────────────────────────────────┘
```

**Timing:**

- First notification: 3 seconds after page load
- Subsequent notifications: Every 10-15 seconds (random)
- Auto-dismiss: After 5 seconds
- Manual dismiss: Click [X] button

**Variations to Observe:**
You should see different combinations of:

**Cities (12 options):**

- Mumbai, Delhi, Bangalore, Hyderabad, Chennai
- Kolkata, Pune, Ahmedabad, Jaipur, Lucknow
- Kochi, Chandigarh

**Products (12 options):**

- Himalayan Pink Salt
- Organic Turmeric Powder
- Kashmiri Saffron
- Premium Cardamom
- Black Peppercorns
- Masala Chai Blend
- Basmati Rice
- Raw Honey
- Cashew Nuts
- Dried Mango
- And more...

**Time Ago:**

- "Just now"
- "2 minutes ago"
- "5 minutes ago"
- "10 minutes ago"

**Testing Interactions:**

1. ✅ **Wait for notification** → Should appear bottom-left
2. ✅ **Animation:** Slides in from left (smooth)
3. ✅ **Wait 5 seconds** → Should auto-dismiss (slides out)
4. ✅ **Click X button** → Should dismiss immediately
5. ✅ **Wait 10-15 seconds** → Next notification appears
6. ✅ **Observe multiple notifications** → Different cities/products

**Success Criteria:**

- ✅ Notifications appear every 10-15 seconds
- ✅ Different city/product combinations
- ✅ Smooth slide-in animation
- ✅ Auto-dismiss after 5 seconds
- ✅ Manual dismiss works (X button)
- ✅ Green verified badge visible
- ✅ Positioned bottom-left (fixed)
- ✅ Doesn't interfere with other UI elements

**Mobile Check (resize browser to <768px):**

- ✅ Notifications still visible
- ✅ Positioned appropriately
- ✅ Don't overlap with mobile menu or footer

---

## 🎯 Complete Test Sequence

Follow this order for comprehensive testing:

### Part 1: Initial Load (2 minutes)

1. ✅ Open http://localhost:3001
2. ✅ Open DevTools → Console tab
3. ✅ Check for Web Vitals logs (LCP, FID, CLS)
4. ✅ Wait 3 seconds → Watch for first social proof notification
5. ✅ Verify no console errors (red text)

### Part 2: Navigation (3 minutes)

1. ✅ Hover over "Products" in header
2. ✅ Move mouse into dropdown (test hover delay)
3. ✅ Click "Spices" category
4. ✅ Verify page scrolls and filters
5. ✅ Test other header links (About, Contact, etc.)

### Part 3: Product Interaction (4 minutes)

1. ✅ Open Network tab → Filter "Img"
2. ✅ Scroll ProductGrid slowly
3. ✅ Watch images load on-demand
4. ✅ Click a product card → Open detail modal
5. ✅ Test all 5 tabs (Description, Nutrition, Origin, Reviews, Q&A)
6. ✅ Add product to cart

### Part 4: Quiz Test (5 minutes)

1. ✅ Scroll to quiz section
2. ✅ Answer all 8 questions
3. ✅ Try to get perfect score or 7/8
4. ✅ Verify promo code appears
5. ✅ Click "Copy Code"
6. ✅ Go to checkout
7. ✅ Apply promo code
8. ✅ Verify discount applied

### Part 5: Social Proof (3 minutes)

1. ✅ Stay on homepage
2. ✅ Watch bottom-left corner
3. ✅ Count notifications over 1 minute (should see 4-6)
4. ✅ Test manual dismiss (X button)
5. ✅ Note different cities/products

### Part 6: Performance Validation (2 minutes)

1. ✅ Check Console tab for performance logs
2. ✅ Verify LCP < 2500ms
3. ✅ Verify FID < 100ms
4. ✅ Verify CLS < 0.1
5. ✅ Check Network tab for lazy loading evidence

---

## 📊 Expected Results Summary

| Feature            | Status           | Notes                                |
| ------------------ | ---------------- | ------------------------------------ |
| Products Dropdown  | ✅ Should work   | 300ms hover delay                    |
| Quiz (8 questions) | ✅ Should work   | Perfect score → QUIZMASTER15         |
| Promo Codes        | ✅ Should work   | QUIZMASTER15 (15%), SPICEFAN10 (10%) |
| Web Vitals Logs    | ✅ Should appear | LCP, FID, CLS in console             |
| Lazy Loading       | ✅ Should work   | Images load on scroll                |
| Social Proof       | ✅ Should work   | Every 10-15s, auto-dismiss 5s        |

---

## 🐛 Troubleshooting

### Products Dropdown Not Working?

**Symptoms:** Dropdown closes immediately, can't click items
**Fix:** Verify Header.tsx lines 95-113 have handleProductsEnter/Leave
**Check:** Console for errors, HMR updated Header.tsx

### Quiz Not Showing Promo Code?

**Symptoms:** Results screen appears but no promo code
**Fix:** Score must be 7/8 or 8/8 (87.5%+ or 100%)
**Check:** Answer at least 7 questions correctly

### Web Vitals Not Logging?

**Symptoms:** No LCP/FID/CLS logs in console
**Fix:** Verify App.tsx has `usePerformanceMonitoring()` call
**Check:** Browser supports PerformanceObserver (Chrome, Edge, Firefox)

### Lazy Loading Not Working?

**Symptoms:** All images load immediately
**Fix:** Verify ProductCard uses LazyImage component
**Check:** Network tab shows all images at once (should be staggered)

### Social Proof Not Appearing?

**Symptoms:** No notifications in bottom-left
**Fix:** Verify SocialProofNotifications in App.tsx
**Check:** Console for component errors, verify 3-second initial delay

---

## 📸 Screenshots to Capture

For documentation/reporting:

1. **Products Dropdown** - Mouse hovering, dropdown open
2. **Quiz Results** - Perfect score screen with promo code
3. **Console Logs** - Web Vitals (LCP, FID, CLS)
4. **Network Tab** - Lazy loading waterfall
5. **Social Proof** - Notification visible bottom-left

---

## ✅ Final Checklist

After testing all features, verify:

- [ ] Products dropdown stays open when hovering
- [ ] All 8 quiz questions appear and work
- [ ] Promo code generates for 7+ correct answers
- [ ] Promo code works in checkout
- [ ] LCP, FID, CLS logs appear in console
- [ ] Performance metrics in "good" range
- [ ] Images lazy load as you scroll
- [ ] Social proof notifications appear every 10-15s
- [ ] Notifications auto-dismiss after 5s
- [ ] No console errors (red text)

**If all checked:** 🎉 **ALL FEATURES WORKING PERFECTLY!**

---

**Testing Duration:** ~20 minutes total  
**Recommended:** Test in Chrome/Edge for best DevTools experience  
**Optional:** Test in Firefox, Safari for cross-browser validation

**Good luck with testing! 🚀**
