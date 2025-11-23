# Quick Reference: New Product Schema Fields

## 🚀 At a Glance

### Marketing Flags (Boolean)
```typescript
featured: boolean;      // Show in featured section
bestseller: boolean;    // Show bestseller badge
new_arrival: boolean;   // Show "New" badge
```

### Pricing & Discounts
```typescript
price: number;              // ₹2,499
compare_price?: number;     // ₹2,999 (strikethrough price)
discount_percent?: number;  // 16.67% (auto-calculated)
```

### Inventory
```typescript
sku: string;            // "SAFF-KASH-001"
barcode?: string;       // "8901234567890"
stock: number;          // 50
min_order_qty: number;  // 1 (default)
max_order_qty?: number; // 10
```

### SEO
```typescript
slug: string;                    // "premium-kashmiri-saffron"
meta_title?: string;             // Page title for Google
meta_description?: string;       // Meta description for Google
```

### Customer Feedback
```typescript
rating: number;        // 4.8 (out of 5)
review_count: number;  // 127 reviews
```

### Product Tags
```typescript
tags: string[];  // ["saffron", "kashmiri", "premium", "organic"]
```

### Brand & Origin
```typescript
brand: string;              // "Tattva Co."
origin_country: string;     // "India"
certifications: string[];   // ["ISO 9001", "FSSAI", "Organic"]
```

### Weight & Dimensions
```typescript
weight_value: number;  // 1
weight_unit: string;   // "gm" | "kg" | "ml" | "l"

dimensions?: {
  length: number;   // 10
  width: number;    // 5
  height: number;   // 15
  unit: string;     // "cm"
}
```

### Nutritional Info (JSONB)
```typescript
nutritional_info?: {
  calories: number;       // 310
  protein: number;        // 11.4g
  carbs: number;          // 65.4g
  fat: number;            // 5.9g
  fiber: number;          // 3.9g
  serving_size: string;   // "100g"
  [key: string]: any;     // Custom fields
}
```

### Allergen Info
```typescript
allergen_info?: string;  // "None. Packaged in facility that handles nuts."
```

### Product Variants (JSONB)
```typescript
variants?: {
  id: string;
  name: string;       // "100g", "500g", "1kg"
  price: number;
  stock: number;
  sku?: string;
}[]
```

### Related Products
```typescript
related_products?: string[];  // Array of product UUIDs
```

---

## 💡 Usage Examples

### Example 1: Featured Bestseller
```typescript
const product = {
  name: "Premium Kashmiri Saffron",
  slug: "premium-kashmiri-saffron",
  price: 2499,
  compare_price: 2999,
  discount_percent: 16.67,
  featured: true,
  bestseller: true,
  new_arrival: false,
  rating: 4.8,
  review_count: 127,
  tags: ["saffron", "premium", "kashmiri"],
  brand: "Tattva Co."
}
```

### Example 2: Organic Product with Certifications
```typescript
const product = {
  name: "Organic Turmeric Powder",
  certifications: ["USDA Organic", "FSSAI", "Non-GMO"],
  origin_country: "India",
  grade: "Premium",
  tags: ["turmeric", "organic", "curcumin"],
  nutritional_info: {
    calories: 354,
    protein: 7.8,
    curcumin_content: 3.5,
    serving_size: "100g"
  }
}
```

### Example 3: New Arrival with Inventory Limits
```typescript
const product = {
  name: "Black Pepper Whole",
  new_arrival: true,
  sku: "PEPP-BLK-250",
  barcode: "8901234567893",
  min_order_qty: 1,
  max_order_qty: 10,
  weight_value: 250,
  weight_unit: "gm"
}
```

---

## ⚡ Quick SQL Queries

### Get Featured Products
```sql
SELECT * FROM products WHERE featured = true;
```

### Get Products by Tag
```sql
SELECT * FROM products WHERE 'organic' = ANY(tags);
```

### Get Bestsellers with High Ratings
```sql
SELECT * FROM products 
WHERE bestseller = true AND rating >= 4.5
ORDER BY review_count DESC;
```

### Get Discounted Products
```sql
SELECT name, price, compare_price, discount_percent
FROM products 
WHERE discount_percent > 0
ORDER BY discount_percent DESC;
```

---

## 🎯 Field Usage Guidelines

### When to Use `featured`
- Homepage hero products
- Seasonal promotions
- Editor's picks
- Limited edition items

### When to Use `bestseller`
- Top 10% of sales
- High review count (>50)
- Consistent reorder rate

### When to Use `new_arrival`
- Products added in last 30 days
- Seasonal new launches
- Limited time offerings

### Tag Best Practices
- Use 3-7 tags per product
- Include category tags ("spices", "organic")
- Include attribute tags ("gluten-free", "vegan")
- Include use-case tags ("baking", "cooking")
- Keep tags lowercase and hyphenated

### SEO Best Practices
- `meta_title`: 50-60 characters
- `meta_description`: 150-160 characters
- Include primary keyword in slug
- Use descriptive, readable slugs

---

## 🛠️ Field Validation Rules

| Field | Rule |
|-------|------|
| `slug` | Unique, lowercase, hyphenated, no spaces |
| `sku` | Unique, alphanumeric with hyphens |
| `rating` | 0.0 to 5.0, 2 decimal places |
| `discount_percent` | 0 to 100, 2 decimal places |
| `tags` | Array of strings, max 10 tags |
| `weight_unit` | "gm", "kg", "ml", "l", "oz", "lb" |
| `price` | Positive number, 2 decimal places |
| `stock` | Non-negative integer |

---

## 📊 Analytics Queries

### Top Rated Products
```sql
SELECT name, rating, review_count
FROM products
WHERE review_count > 10
ORDER BY rating DESC, review_count DESC
LIMIT 10;
```

### Most Discounted Products
```sql
SELECT name, price, compare_price, discount_percent
FROM products
WHERE discount_percent IS NOT NULL
ORDER BY discount_percent DESC
LIMIT 10;
```

### Products by Brand
```sql
SELECT brand, COUNT(*) as product_count, AVG(rating) as avg_rating
FROM products
GROUP BY brand
ORDER BY product_count DESC;
```

### Popular Tags
```sql
SELECT unnest(tags) as tag, COUNT(*) as count
FROM products
GROUP BY tag
ORDER BY count DESC
LIMIT 20;
```

---

**Last Updated:** November 23, 2025  
**Version:** 2.0
