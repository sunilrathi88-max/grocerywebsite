-- ============================================================================
-- Coupons & Promotions Schema
-- ============================================================================

CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_value DECIMAL(10,2) DEFAULT 0,
  max_discount_amount DECIMAL(10,2), -- For percentage discounts
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  usage_limit INTEGER, -- Total times this coupon can be used globally
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookup by code
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active_dates ON coupons(is_active, start_date, end_date);

-- RLS Policies
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Everyone can view active coupons (needed for validation)
-- Alternatively, we can restrict this and only allow validation via Edge Function (Service Role)
-- For security, let's restriction direct SELECT and only allow Service Role or Admin.
-- Public users shouldn't be able to list all coupons.
CREATE POLICY "Admins can manage coupons"
  ON coupons
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Service role can read coupons"
  ON coupons FOR SELECT
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_coupons_updated_at ON coupons;
CREATE TRIGGER update_coupons_updated_at
    BEFORE UPDATE ON coupons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE coupons IS 'Promotional codes and discount rules';
