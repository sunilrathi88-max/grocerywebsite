# Database Schema Update Guide

## 📦 Overview

This guide documents the comprehensive e-commerce schema update for the Tattva Co. products table. All new fields have been added to support a full-featured online grocery store.

## 🛠️ SQL Schema Migration

### Step 1: Run the Complete SQL Migration

Execute this SQL in your Supabase SQL Editor:

```sql
-- Add all remaining e-commerce product fields
ALTER TABLE products
ADD COLUMN IF NOT EXISTS tags text[] NULL,
ADD COLUMN IF NOT EXISTS brand text NULL,
ADD COLUMN IF NOT EXISTS sku text NULL,
ADD COLUMN IF NOT EXISTS barcode text NULL,
ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS bestseller boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS new_arrival boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS discount_percent numeric(5,2) NULL,
ADD COLUMN IF NOT EXISTS compare_price numeric(10,2) NULL,
ADD COLUMN IF NOT EXISTS min_order_qty integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS max_order_qty integer NULL,
ADD COLUMN IF NOT EXISTS rating numeric(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS review_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS meta_title text NULL,
ADD COLUMN IF NOT EXISTS meta_description text NULL,
ADD COLUMN IF NOT EXISTS slug text UNIQUE NULL,
ADD COLUMN IF NOT EXISTS variants jsonb NULL,
ADD COLUMN IF NOT EXISTS related_products uuid[] NULL,
ADD COLUMN IF NOT EXISTS weight_value numeric(10,2) NULL,
ADD COLUMN IF NOT EXISTS weight_unit text NULL,
ADD COLUMN IF NOT EXISTS dimensions jsonb NULL,
ADD COLUMN IF NOT EXISTS origin_country text NULL,
ADD COLUMN IF NOT EXISTS certifications text[] NULL,
ADD COLUMN IF NOT EXISTS allergen_info text NULL,
ADD COLUMN IF NOT EXISTS nutritional_info jsonb NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_products_bestseller ON products(bestseller) WHERE bestseller = true;
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating DESC);

-- Add comments for documentation
COMMENT ON COLUMN products.tags IS 'Product tags/keywords for filtering and search';
COMMENT ON COLUMN products.variants IS 'Product variations (sizes, weights, etc.) stored as JSON';
COMMENT ON COLUMN products.slug IS 'URL-friendly product identifier';
```

## 📊 New Schema Fields

### **Core E-commerce Fields**

| Field     | Type     | Description                | Example                             |
| --------- | -------- | -------------------------- | ----------------------------------- |
| `tags`    | `text[]` | Product tags for filtering | `["saffron", "premium", "organic"]` |
| `brand`   | `text`   | Brand name                 | `"Tattva Co."`                      |
| `sku`     | `text`   | Stock keeping unit         | `"SAFF-KASH-001"`                   |
| `barcode` | `text`   | Product barcode            | `"8901234567890"`                   |
| `slug`    | `text`   | URL-friendly identifier    | `"premium-kashmiri-saffron"`        |

### **Marketing & Merchandising**

| Field              | Type            | Description                  | Default |
| ------------------ | --------------- | ---------------------------- | ------- |
| `featured`         | `boolean`       | Featured product flag        | `false` |
| `bestseller`       | `boolean`       | Bestseller badge             | `false` |
| `new_arrival`      | `boolean`       | New arrival badge            | `false` |
| `discount_percent` | `numeric(5,2)`  | Discount percentage          | `null`  |
| `compare_price`    | `numeric(10,2)` | Original price (for savings) | `null`  |

### **Inventory & Orders**

| Field           | Type            | Description                 | Default |
| --------------- | --------------- | --------------------------- | ------- |
| `min_order_qty` | `integer`       | Minimum order quantity      | `1`     |
| `max_order_qty` | `integer`       | Maximum order quantity      | `null`  |
| `weight_value`  | `numeric(10,2)` | Product weight value        | `null`  |
| `weight_unit`   | `text`          | Weight unit (gm, kg, ml, l) | `null`  |
| `dimensions`    | `jsonb`         | Product dimensions          | `null`  |

### **Customer Feedback**

| Field          | Type           | Description          | Default |
| -------------- | -------------- | -------------------- | ------- |
| `rating`       | `numeric(3,2)` | Average rating (0-5) | `0`     |
| `review_count` | `integer`      | Number of reviews    | `0`     |

### **SEO**

| Field              | Type   | Description          |
| ------------------ | ------ | -------------------- |
| `meta_title`       | `text` | SEO page title       |
| `meta_description` | `text` | SEO meta description |

### **Advanced Features**

| Field              | Type     | Description          | Example                              |
| ------------------ | -------- | -------------------- | ------------------------------------ |
| `variants`         | `jsonb`  | Product variations   | `[{"name": "100g", "price": 299}]`   |
| `related_products` | `uuid[]` | Related product IDs  | `["uuid1", "uuid2"]`                 |
| `origin_country`   | `text`   | Country of origin    | `"India"`                            |
| `certifications`   | `text[]` | Certifications       | `["Organic", "FSSAI"]`               |
| `allergen_info`    | `text`   | Allergen information | `"Contains nuts"`                    |
| `nutritional_info` | `jsonb`  | Nutritional data     | `{"calories": 310, "protein": 11.4}` |

## 💻 Updated TypeScript Types

The `Product` interface in `lib/types.ts` has been updated to include all new fields. Key changes:

```typescript
export interface Product {
  // Core Fields
  id: string;
  name: string;
  slug?: string;
  // ... (see lib/types.ts for complete definition)

  // New fields
  tags?: string[];
  brand?: string;
  featured?: boolean;
  bestseller?: boolean;
  rating?: number;
  // ... and many more
}
```

## 🌱 Sample Data

Sample products with all new fields populated are available in `lib/sampleProductData.ts`:

- Premium Kashmiri Saffron
- Organic Turmeric Powder
- Himalayan Pink Salt
- Black Pepper Whole
- Organic Cinnamon Sticks

Each product includes:

- ✅ All marketing flags (featured, bestseller, new_arrival)
- ✅ Complete SEO metadata
- ✅ Nutritional information
- ✅ Certifications and origin
- ✅ Tags and product details
- ✅ Ratings and review counts

## ⏩ Quick Start

### 1. Run SQL Migration

Copy the SQL from the top of this guide and execute it in Supabase SQL Editor.

### 2. Seed Database

Use the updated `DatabaseSeeder` component:

```tsx
import DatabaseSeeder from './components/DatabaseSeeder';

// Add to your App or Admin panel
<DatabaseSeeder />;
```

Click **"Seed Database"** to populate with 5 sample products.

### 3. Verify Data

Check your Supabase table:

```sql
SELECT name, slug, brand, tags, featured, rating, certifications
FROM products;
```

## 🛡️ Troubleshooting

### Error: "column does not exist"

**Solution:** Run the SQL migration first. Ensure all `ADD COLUMN IF NOT EXISTS` statements executed successfully.

### Error: "null value in column violates not-null constraint"

**Solution:** Check that required fields (name, price, stock, status) have values. All new fields are nullable.

### Seeder shows "Idle" but doesn't run

**Solution:** Check browser console for errors. Ensure `supabaseClient` is configured with correct credentials.

## 🔍 Query Examples

### Get Featured Products

```sql
SELECT * FROM products
WHERE featured = true
ORDER BY rating DESC;
```

### Get Products by Tag

```sql
SELECT * FROM products
WHERE 'organic' = ANY(tags);
```

### Get High-Rated Products

```sql
SELECT * FROM products
WHERE rating >= 4.5 AND review_count > 10
ORDER BY rating DESC, review_count DESC;
```

### Get Products with Discounts

```sql
SELECT name, price, compare_price, discount_percent
FROM products
WHERE discount_percent > 0
ORDER BY discount_percent DESC;
```

## 📦 Product-Specific Fields You Might Still Need

Depending on your specific product requirements, consider adding:

- `batch_number` - For inventory tracking
- `expiry_date` - For perishable products
- `harvest_date` - For seasonal products
- `packaging_type` - Glass jar, pouch, tin, etc.
- `storage_instructions` - How to store the product
- `shelf_life` - Duration before expiry
- `recipes` - Related recipes (JSONB)
- `usage_instructions` - How to use the product

Example:

```sql
ALTER TABLE products
ADD COLUMN IF NOT EXISTS batch_number text NULL,
ADD COLUMN IF NOT EXISTS expiry_date date NULL,
ADD COLUMN IF NOT EXISTS packaging_type text NULL,
ADD COLUMN IF NOT EXISTS storage_instructions text NULL,
ADD COLUMN IF NOT EXISTS shelf_life text NULL,
ADD COLUMN IF NOT EXISTS recipes jsonb NULL;
```

## ✅ Checklist

- [ ] SQL migration executed successfully
- [ ] All indexes created
- [ ] TypeScript types updated (`lib/types.ts`)
- [ ] Sample data reviewed (`lib/sampleProductData.ts`)
- [ ] DatabaseSeeder component updated
- [ ] Test seeding with sample data
- [ ] Verify data in Supabase dashboard
- [ ] Update frontend components to use new fields
- [ ] Update product forms to include new fields
- [ ] Test search and filtering with tags

## 👥 Need Help?

If you encounter any issues:

1. Check Supabase logs in the Dashboard
2. Verify your `supabaseClient` configuration
3. Ensure database permissions allow INSERT/UPDATE
4. Check browser console for JavaScript errors

---

**Last Updated:** November 23, 2025  
**Schema Version:** 2.0  
**Compatibility:** Supabase PostgreSQL 15+
