# Rathi Naturals — Site Audit & Fix Report

**Date:** 2026-05-29  
**Method:** Playwright automated screenshots across desktop (1440px) and mobile (375–390px)  
**Pages tested:** Home, Shop, Cart, Checkout, Farmers

---

## Summary

| Severity    | Issue                            | Status   |
| ----------- | -------------------------------- | -------- |
| 🔴 Critical | Cart page broken (blank / "IOO") | ✅ Fixed |
| 🔴 Critical | Missing product images on Shop   | ⏳ Open  |
| 🟡 Medium   | Hero section gap on desktop      | ⏳ Open  |
| 🟡 Medium   | Mobile brand name truncated      | ⏳ Open  |
| 🟡 Medium   | Chat button uses wrong icon      | ⏳ Open  |
| 🟠 Minor    | Personal email exposed in footer | ⏳ Open  |
| 🟠 Minor    | Farmers page hero blank          | ⏳ Open  |

---

## Issues

### 🔴 Cart page broken

**Route:** `/cart`  
**Symptom:** Page rendered abstract geometric shapes + "IOO" serif text. No cart content visible. Completely blocked checkout.  
**Root cause:** `useCart` hook had `initialData: []` + `staleTime: Infinity` — the `queryFn` that reads from `localStorage` never ran on page load. Cart was always empty regardless of stored items.  
**Fix applied:** Removed `initialData: []` from `hooks/useCart.ts` so the queryFn runs on first mount and correctly hydrates from `localStorage` (`rathi_cart` key).  
**Verified:** Cart page now shows "Your Spice Box is Empty" when empty, and "My Spice Box" with items when cart has data.

---

### 🔴 Missing product images on Shop

**Route:** `/shop` (second row of product grid)  
**Affected products:** Premium Raisins (Kishmish), Dried Figs (Anjeer), Premium Chai Masala, Royal Garam Masala  
**Symptom:** Cards show "Rathi Naturals / Product Image / Image Not Available" placeholder on a pink background. First-row products have real images.  
**Root cause:** Image paths for these products likely point to missing/incorrect file paths in `data/products.ts`.  
**Status:** Open — needs image files added to `public/images/products/` or correct image URLs assigned in product data.

---

### 🟡 Hero section gap (desktop)

**Route:** `/` at mid-scroll  
**Symptom:** Large white/empty strip between the hero section and the "Why Rathi Naturals?" section.  
**Likely cause:** Excess padding/margin on hero section or an empty container between sections.  
**Status:** Open.

---

### 🟡 Mobile brand name truncated

**Route:** All pages, mobile 375px  
**Symptom:** Top-left header shows "hi Natu..." — brand name overflowing its container.  
**Likely cause:** `Header` or `Navbar` component not handling small viewport gracefully; brand name needs `text-sm` or `truncate` guard at narrow widths.  
**Status:** Open.

---

### 🟡 Chat / WhatsApp button icon

**Route:** All pages (fixed bottom-right widget)  
**Symptom:** Button uses a tropical-island emoji icon. Looks unpolished/off-brand.  
**Fix:** Replace with official WhatsApp SVG logo or a brand-colored chat icon.  
**Status:** Open — file: `components/WhatsAppButton.tsx`.

---

### 🟠 Personal email in footer

**Route:** All pages (Footer)  
**Symptom:** `sunilrathi88@gmail.com` exposed publicly in the "Get in Touch" section.  
**Fix:** Replace with a business address e.g. `hello@rathinaturals.com` or a contact form link.  
**Status:** Open — file: `src/components/Redesigned/Footer.tsx` or `components/Footer.tsx`.

---

### 🟠 Farmers page hero blank

**Route:** `/farmers`  
**Symptom:** Large dark empty hero area at the top — background image not loading.  
**Likely cause:** Image path broken or asset missing from `public/`.  
**Status:** Open — file: `pages/FarmersPage.tsx` or `data/farmers.ts`.

---

## What was confirmed working

- No JavaScript console errors on any page
- No broken images in first paint
- Navigation links intact: Shop, Offers, Our Story, Blog, Cart
- Checkout flow renders correctly (4-step form, order summary, Cashfree integration)

---

## Q-Commerce UX Upgrade (delivered same session)

Three phases from the implementation guide were built and verified:

| Feature                                                               | File                                     |
| --------------------------------------------------------------------- | ---------------------------------------- |
| Trust badges (100% Pure, Single-Origin, NABL Tested) on product cards | `components/UniversalProductCard.tsx`    |
| Inline `[+]` / `- qty +` cart counter (replaces add-to-cart button)   | `components/UniversalProductCard.tsx`    |
| Mobile split-screen: left category sidebar + right product grid       | `src/components/Redesigned/ShopPage.tsx` |
| Mobile delivery location bar + search at top                          | `src/components/Redesigned/ShopPage.tsx` |
| Sticky bottom cart bar (item count + total)                           | `src/components/Redesigned/ShopPage.tsx` |
| Slide-up cart drawer with free delivery progress + UPI pay CTA        | `src/components/Redesigned/ShopPage.tsx` |

All features verified via Playwright on 375px (mobile) and 1440px (desktop) viewports.
