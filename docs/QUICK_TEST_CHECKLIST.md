# 🎯 Quick Testing Checklist

**Use this as a quick reference while testing**

---

## Test 1: Products Dropdown ⏱️ 1 min

```
□ Hover over "Products" in header
□ Dropdown appears
□ Move mouse into dropdown area
□ Dropdown stays open (doesn't close immediately)
□ Click a category (e.g., "Spices")
□ Page scrolls and filters products

✅ PASS if dropdown doesn't close too quickly
```

---

## Test 2: Quiz & Promo Codes ⏱️ 5 mins

```
□ Scroll to quiz section ("Test Your Spice Knowledge")
□ Answer Question 1 (correct: Himalayan Saffron)
□ Click "Next"
□ Answer all 8 questions
□ Results screen appears
□ Check your score

If 8/8:
  □ "🎉 Perfect Score! You're a Spice Master!"
  □ Promo code: QUIZMASTER15
  □ "15% off your next order!"

If 7/8:
  □ "🌟 Excellent! You know your spices!"
  □ Promo code: SPICEFAN10
  □ "10% off your next order!"

□ Click "Copy Code" button
□ Toast appears: "Promo code copied to clipboard!"
□ Navigate to checkout
□ Paste promo code
□ Click "Apply"
□ Discount appears (15% or 10%)

✅ PASS if promo code works in checkout
```

---

## Test 3: Web Vitals Logs ⏱️ 2 mins

```
□ Open DevTools (F12)
□ Click "Console" tab
□ Clear console
□ Refresh page (F5)
□ Wait 5 seconds

Look for these logs:
□ "LCP: [number]" appears (should be < 2500)
□ "FID: [number]" appears (should be < 100)
□ "CLS: [number]" appears (should be < 0.1)

Interact with page:
□ Click product → "Event tracked: view_item"
□ Add to cart → "Event tracked: add_to_cart"

✅ PASS if all 3 metrics appear in console
```

---

## Test 4: Lazy Loading ⏱️ 2 mins

```
□ Open DevTools (F12)
□ Click "Network" tab
□ Click "Img" filter button
□ Clear network log (trash icon)
□ Refresh page (F5)

Observe:
□ Only 5-8 product images load initially
□ Scroll down slowly
□ More images load AS you scroll
□ Each row loads ~50px before visible
□ Smooth fade-in animation

Check Network waterfall:
□ Images load in batches (not all at once)
□ Staggered timing (not simultaneous)

✅ PASS if images load on-demand while scrolling
```

---

## Test 5: Social Proof Notifications ⏱️ 3 mins

```
□ Load homepage
□ Look at bottom-left corner
□ Wait 3 seconds

First notification:
□ Slides in from left
□ Shows: "Someone in [City] just purchased [Product]"
□ Green verified badge visible
□ Time ago (e.g., "2 minutes ago")
□ X button present

Wait 5 seconds:
□ Notification slides out (auto-dismiss)

Wait 10-15 seconds:
□ Next notification appears
□ Different city/product combination

Test manual dismiss:
□ Click X button
□ Notification disappears immediately

Observe over 1 minute:
□ 4-6 notifications appear
□ Various cities (Mumbai, Delhi, Bangalore, etc.)
□ Various products (spices, nuts, etc.)

✅ PASS if notifications appear every 10-15 seconds
```

---

## 🚦 Quick Status Check

After completing all tests:

**Products Dropdown:** ⬜ PASS / ⬜ FAIL  
**Quiz & Promo Codes:** ⬜ PASS / ⬜ FAIL  
**Web Vitals Logs:** ⬜ PASS / ⬜ FAIL  
**Lazy Loading:** ⬜ PASS / ⬜ FAIL  
**Social Proof:** ⬜ PASS / ⬜ FAIL

---

## 🎉 All Tests Passed?

If all 5 tests pass, your website has:
✅ Fixed dropdown navigation
✅ Working quiz with rewards
✅ Active performance monitoring
✅ Optimized image loading
✅ Engaging social proof

**Status: PRODUCTION READY! 🚀**

---

## 🐛 Common Issues

**Dropdown closes too fast?**
→ Check Header.tsx has 300ms timeout

**No promo code?**
→ Need 7+ correct answers (87.5%+)

**No console logs?**
→ Open DevTools Console tab first

**All images load at once?**
→ Check ProductCard uses LazyImage

**No notifications?**
→ Wait 3 seconds after page load

---

**Total Testing Time:** ~15 minutes  
**Browser:** Chrome/Edge recommended (best DevTools)  
**Created:** October 20, 2025
