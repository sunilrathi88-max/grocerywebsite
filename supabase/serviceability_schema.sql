-- ============================================================================
-- Serviceability Schema
-- ============================================================================

CREATE TABLE IF NOT EXISTS serviceable_pincodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pincode TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  cod_available BOOLEAN DEFAULT TRUE,
  estimated_delivery_days INTEGER DEFAULT 3,
  shipping_cost DECIMAL(10,2) DEFAULT 50.00,
  free_shipping_threshold DECIMAL(10,2) DEFAULT 1000.00,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_pincode_lookup ON serviceable_pincodes(pincode);

-- RLS Policies
ALTER TABLE serviceable_pincodes ENABLE ROW LEVEL SECURITY;

-- Allow public read access (or restrict to service role if we only want edge function to access it)
-- For now, letting service role handle the checks via Edge Function is cleaner, 
-- but public read might be useful for client-side validation if we skipping edge function efficiently.
-- Let's stick to strict RLS: Only Service Role can read/write for now to enforce API usage.

CREATE POLICY "Service Role can do everything on serviceable_pincodes"
  ON serviceable_pincodes
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow admins (if we had admin role) to manage. For now, service role is sufficient for deployment/seeding.

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_pincodes_updated_at ON serviceable_pincodes;
CREATE TRIGGER update_pincodes_updated_at
    BEFORE UPDATE ON serviceable_pincodes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed some data for development
INSERT INTO serviceable_pincodes (pincode, city, state, cod_available, estimated_delivery_days, shipping_cost, free_shipping_threshold)
VALUES 
  ('400001', 'Mumbai', 'Maharashtra', true, 2, 40.00, 800.00), -- Lower threshold for Mumbai
  ('110001', 'New Delhi', 'Delhi', true, 3, 60.00, 1200.00),
  ('560001', 'Bangalore', 'Karnataka', true, 3, 50.00, 1000.00),
  ('600001', 'Chennai', 'Tamil Nadu', true, 4, 55.00, 1000.00),
  ('700001', 'Kolkata', 'West Bengal', false, 4, 70.00, 1500.00)
ON CONFLICT (pincode) DO NOTHING;
