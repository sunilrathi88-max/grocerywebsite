-- ============================================================================
-- Products, Variants, Reviews, QnA Schema
-- ============================================================================

-- 1. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    images TEXT[],
    videos TEXT[],
    nutrition JSONB,
    origin TEXT,
    harvest_date TEXT,
    grade TEXT,
    purity_test TEXT,
    storage TEXT,
    shelf_life TEXT,
    grind TEXT,
    tags TEXT[],
    -- Compliance / Extended fields
    fssai_license TEXT,
    ingredients TEXT,
    allergens TEXT,
    batch_no TEXT,
    mfg_date TEXT,
    best_before_months INTEGER,
    storage_instructions TEXT,
    origin_region TEXT,
    processing_method TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. VARIANTS
CREATE TABLE IF NOT EXISTS variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2),
    stock INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    restock_date TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    sku TEXT
);

-- 3. REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    author TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    title TEXT,
    verified_purchase BOOLEAN DEFAULT FALSE,
    date TEXT, -- Storing as ISO string as per existing mock data
    images TEXT[],
    helpful INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending' -- for moderation
);

-- 4. QnA
CREATE TABLE IF NOT EXISTS qna (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    author TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT,
    date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_variants_product_id ON variants(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_qna_product_id ON qna(product_id);

-- RLS Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE qna ENABLE ROW LEVEL SECURITY;

-- Products: Public Read, Admin Write
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin Write Products" ON products FOR ALL USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

-- Variants: Public Read, Admin Write
CREATE POLICY "Public Read Variants" ON variants FOR SELECT USING (true);
CREATE POLICY "Admin Write Variants" ON variants FOR ALL USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

-- Reviews: Public Read, Auth Create
CREATE POLICY "Public Read Reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated Create Reviews" ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin All Reviews" ON reviews FOR ALL USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

-- QnA: Public Read, Auth Create
CREATE POLICY "Public Read QnA" ON qna FOR SELECT USING (true);
CREATE POLICY "Authenticated Create QnA" ON qna FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin All QnA" ON qna FOR ALL USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'role' = 'admin');
