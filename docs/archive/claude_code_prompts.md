# Claude Code Implementation Guide: Indian Q-Commerce UX

Copy and paste these prompts sequentially into your running `claude` terminal to completely upgrade your Rathi Naturals website to the high-speed, Zepto/Blinkit style Indian UX.

Claude will modify your existing files (`UniversalProductCard.tsx` and `ShopPage.tsx`) step-by-step.

---

### Phase 1: Upgrading the Product Card (Quick-Add & Trust Badges)

**File to target:** `components/UniversalProductCard.tsx`

**Copy & Paste this into Claude Code:**

```text
I want to completely redesign the UX of components/UniversalProductCard.tsx to match Indian Q-commerce apps (like Zepto or Blinkit) and D2C brands (like Country Delight).

Please implement the following changes:
1. **Trust Badges (Country Delight style):** Add small absolute-positioned overlay tags on the top-left of the product image (e.g., 'NABL Tested', '100% Pure', or 'Single-Origin'). Use a deep forest green color for trust.
2. **Thumb-Friendly Quick-Add (Zepto style):** Remove the standard 'Add to Cart' text button. Replace it with a large, touch-friendly `[+]` button in the bottom right corner of the card.
3. **Quantity State:** When the user clicks `[+]`, the button must instantly transform into a `- 1 +` counter to allow rapid quantity adjustments without leaving the page.
4. **Visual Hierarchy:** Make the MRP (original price) smaller and crossed out in grey, and make the discounted price large, bold, and in your primary brand color (#42210B). Show a 'X% OFF' tag next to the price.

Please write the updated code and ensure it is fully mobile-responsive using TailwindCSS.
```

---

### Phase 2: Building the Split-Screen Mobile Shop Page

**File to target:** `src/components/Redesigned/ShopPage.tsx`

**Copy & Paste this into Claude Code:**

```text
I want to overhaul src/components/Redesigned/ShopPage.tsx to use a 'Split-Screen' layout for mobile, exactly like Blinkit or Zepto.

Please restructure the page with these requirements:
1. **Vertical Sidebar (Left):** Create a narrow, persistent, scrollable sidebar on the left side of the screen (about 25% width). This sidebar will contain category icons (e.g., Whole Spices, Powders, Premium). The active category should have a distinct highlighted background.
2. **Product Grid (Right):** The remaining 75% of the screen should be a scrollable grid displaying the `UniversalProductCard` components for the selected category.
3. **No Reloads:** Clicking a category in the left sidebar should instantly filter the right-side grid without reloading the page.
4. **Sticky Top Bar:** Add a sticky header at the very top showing the user's delivery location (e.g., '📍 Delivering to: New Delhi') and a fast search bar placeholder.

Please implement this layout using Tailwind CSS Grid/Flexbox, ensuring it feels like a native mobile app.
```

---

### Phase 3: The Persistent Slide-Up Cart (UPI First)

**File to target:** `src/components/Redesigned/ShopPage.tsx` (or your main Layout file)

**Copy & Paste this into Claude Code:**

```text
We need a sticky, gamified Cart Footer and a Slide-Up Cart Drawer for the Shop page to maximize conversions.

Please add the following:
1. **Sticky Bottom Action Bar:** When the cart has > 0 items, show a persistent sticky bar at the bottom of the screen that says '1 Item | ₹450' on the left, and 'View Cart ->' on the right. Give it a gentle pulsing animation to drive attention.
2. **Slide-Up Drawer (Bottom Sheet):** When 'View Cart' is clicked, open a bottom sheet modal (slide up from the bottom).
3. **Gamification:** Inside the drawer, add a progress bar at the top: 'Add ₹150 more for FREE Delivery!'.
4. **UPI Checkout:** The final checkout button inside this drawer should say 'Pay ₹[Total] via UPI' with a small GPay/PhonePe icon placeholder, colored in brand orange/gold (#B38B59).

Implement the state and Tailwind animations for this slide-up drawer.
```

---

### Final Step: Verification

Once Claude completes these 3 prompts, run your local development server (`npm run dev`) and test the `/shop` route on a mobile screen size (using Chrome DevTools). You should instantly feel the speed and conversion optimization typical of a top-tier Indian Quick Commerce platform!
