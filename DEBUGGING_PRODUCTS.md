# 🔍 Product Display Debugging Guide

**Issue:** Products are not showing up on the website

---

## Quick Diagnostic Steps

### Step 1: Check Browser Console

1. Open your site: http://localhost:3000
2. Press `F12` to open DevTools
3. Go to the **Console** tab
4. Look for these debug messages:

```
🔍 Products loaded: [number] [array]
🎯 Filtered products: [number] {details}
```

**What to check:**
- Are products loaded? (Should be 8 products from MOCK_PRODUCTS)
- What's the filtered products count?
- Check the filter details (category, search, tags, etc.)

---

### Step 2: Common Issues

#### Issue A: Products array is empty (0 products)
**Possible causes:**
- useProducts hook not loading MOCK_PRODUCTS
- Import error in data.ts

**Fix:**
Check console for error messages about imports

#### Issue B: Products loaded but filtered to 0
**Possible causes:**
- Category filter active (not "All")
- Search query filtering everything out
- Price range too restrictive
- "In Stock Only" filter active with no stock
- "On Sale" filter active with no sales

**Check in console:**
```javascript
🎯 Filtered products: 0 {
  total: 8,           // Products loaded ✅
  afterFilter: 0,     // Filtered to 0 ❌
  showOnSale: true,   // This might be the issue
  selectedCategory: "Spices",
  searchQuery: "xyz"
}
```

**Fix:**
Reset filters on the page:
- Click "All" category
- Clear search box
- Uncheck "On Sale" if active
- Uncheck "In Stock Only" if active

#### Issue C: Still loading (isLoading = true)
**Check:**
- Wait 1 second (there's a setTimeout)
- If still showing skeletons after 1 second, check console for errors

---

### Step 3: Manual Fix

If products still don't show, try these fixes:

#### Fix 1: Clear Browser Cache
```
1. Press Ctrl+Shift+Delete
2. Select "Cached images and files"
3. Click "Clear data"
4. Reload page (Ctrl+R)
```

#### Fix 2: Hard Refresh
```
Press: Ctrl+Shift+R (Windows)
or: Cmd+Shift+R (Mac)
```

#### Fix 3: Restart Dev Server
```powershell
# Stop the server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

---

## Expected Console Output

### Good ✅ (Products showing)
```
🔍 Products loaded: 8 [Array with 8 products]
🎯 Filtered products: 8 {
  total: 8,
  afterFilter: 8,
  final: 8,
  showOnSale: false,
  selectedTags: [],
  selectedCategory: "All",
  searchQuery: ""
}
```

### Bad ❌ (Products not showing - filtered out)
```
🔍 Products loaded: 8 [Array with 8 products]
🎯 Filtered products: 0 {
  total: 8,
  afterFilter: 0,
  final: 0,
  showOnSale: true,    // ← This is filtering everything out!
  selectedTags: [],
  selectedCategory: "All",
  searchQuery: ""
}
```

---

## What I Added

I've added debug logging to help identify the issue:

### In App.tsx (line ~117):
```typescript
// Debug: Log products to console
useEffect(() => {
  console.log('🔍 Products loaded:', products.length, products);
}, [products]);
```

This logs when products are loaded from useProducts hook.

### In App.tsx (line ~440):
```typescript
console.log('🎯 Filtered products:', result.length, {
  total: products.length,
  afterFilter: filteredProducts.length,
  final: result.length,
  showOnSale,
  selectedTags,
  selectedCategory,
  searchQuery,
});
```

This logs the filtering pipeline:
- `total`: Products from useProducts
- `afterFilter`: After category, search, price, stock filters
- `final`: After "On Sale" and tag filters

---

## Next Steps

1. **Open http://localhost:3000 in your browser**

2. **Open DevTools Console (F12)**

3. **Look for the debug messages**

4. **Share the console output with me** so I can see:
   - How many products loaded?
   - What's filtering them out?
   - Are there any error messages?

5. **Take a screenshot** of:
   - The page (showing no products)
   - The console output
   - The filter controls visible on the page

---

## Quick Reset

If you want to reset all filters, look for these UI elements:

- **Category Buttons** (at the top) - Click "All"
- **Search Box** - Clear any text
- **Advanced Filters** - Click "Reset Filters" if visible
- **"On Sale" checkbox** - Make sure it's unchecked
- **"In Stock" checkbox** - Make sure it's unchecked

---

## Code Locations

If you need to check the code:

- **Products data:** `data.ts` line 3 (MOCK_PRODUCTS)
- **useProducts hook:** `hooks/useProducts.ts` line 28
- **ProductGrid component:** `components/ProductGrid.tsx`
- **Filtering logic:** `App.tsx` lines 416-440
- **Product display:** `App.tsx` line 624

---

**Once you check the console, let me know what you see and I can help fix the specific issue!** 🚀
