-- ============================================================================
-- Phase 1: Core E-commerce Loop - Database Schema
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. PAYMENT TRANSACTIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL,
  payment_id TEXT NOT NULL UNIQUE,
  payment_order_id TEXT NOT NULL,
  payment_signature TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'pending', 'refunded')),
  gateway TEXT NOT NULL DEFAULT 'razorpay' CHECK (gateway IN ('razorpay', 'stripe')),
  payment_method TEXT, -- 'upi', 'card', 'wallet', 'netbanking'
  error_code TEXT,
  error_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_payment_id ON payment_transactions(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);

-- RLS Policies
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Users can only view their own payment transactions
CREATE POLICY "Users can view own payment transactions"
  ON payment_transactions FOR SELECT
  USING (auth.uid()::text = order_id OR auth.jwt() ->> 'role' = 'admin');

-- Only system/admin can insert/update payment transactions
CREATE POLICY "Only system can create payment transactions"
  ON payment_transactions FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only system can update payment transactions"
  ON payment_transactions FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

-- ============================================================================
-- 2. ORDER STATUS HISTORY
-- ============================================================================

CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned')),
  message TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_created_at ON order_status_history(created_at DESC);

-- RLS Policies
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order status history"
  ON order_status_history FOR SELECT
  USING (true); -- Accessible if user has access to the order

CREATE POLICY "Only admin can create order status history"
  ON order_status_history FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'service_role');

-- ============================================================================
-- 3. RETURNS
-- ============================================================================

CREATE TABLE IF NOT EXISTS returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'requested' CHECK (status IN ('requested', 'approved', 'rejected', 'picked_up', 'refunded', 'cancelled')),
  reason TEXT NOT NULL CHECK (reason IN ('damaged', 'wrong_item', 'not_as_described', 'changed_mind', 'late_delivery', 'other')),
  detailed_reason TEXT,
  refund_amount DECIMAL(10,2) NOT NULL,
  refund_method TEXT DEFAULT 'original_payment' CHECK (refund_method IN ('original_payment', 'store_credit', 'bank_transfer')),
  refund_id TEXT, -- Payment gateway refund ID
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_returns_order_id ON returns(order_id);
CREATE INDEX IF NOT EXISTS idx_returns_user_id ON returns(user_id);
CREATE INDEX IF NOT EXISTS idx_returns_status ON returns(status);

-- RLS Policies
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own returns"
  ON returns FOR SELECT
  USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can create own returns"
  ON returns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending returns"
  ON returns FOR UPDATE
  USING (auth.uid() = user_id AND status = 'requested')
  WITH CHECK (auth.uid() = user_id AND status IN ('requested', 'cancelled'));

CREATE POLICY "Admins can update all returns"
  ON returns FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================================
-- 4. RETURN ITEMS
-- ============================================================================

CREATE TABLE IF NOT EXISTS return_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  return_id UUID REFERENCES returns(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  variant_id INTEGER NOT NULL,
  variant_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  condition TEXT CHECK (condition IN ('unopened', 'opened', 'damaged', 'defective')),
  images TEXT[], -- Array of image URLs from Supabase Storage
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_return_items_return_id ON return_items(return_id);

-- RLS Policies
ALTER TABLE return_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own return items"
  ON return_items FOR SELECT
  USING (
    return_id IN (
      SELECT id FROM returns WHERE user_id = auth.uid()
    ) OR auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Users can create return items"
  ON return_items FOR INSERT
  WITH CHECK (
    return_id IN (
      SELECT id FROM returns WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- 5. STOCK NOTIFICATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS stock_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  product_id INTEGER NOT NULL,
  variant_id INTEGER NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  notified BOOLEAN DEFAULT FALSE,
  notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_stock_notifications_product_variant ON stock_notifications(product_id, variant_id);
CREATE INDEX IF NOT EXISTS idx_stock_notifications_notified ON stock_notifications(notified);

-- RLS Policies
ALTER TABLE stock_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stock notifications"
  ON stock_notifications FOR SELECT
  USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can create stock notifications"
  ON stock_notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "System can update stock notifications"
  ON stock_notifications FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

-- ============================================================================
-- 6. FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
DROP TRIGGER IF EXISTS update_payment_transactions_updated_at ON payment_transactions;
CREATE TRIGGER update_payment_transactions_updated_at
    BEFORE UPDATE ON payment_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF NOT EXISTS update_returns_updated_at ON returns;
CREATE TRIGGER update_returns_updated_at
    BEFORE UPDATE ON returns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. STORAGE BUCKETS (for return images)
-- ============================================================================

-- Note: Run this in Supabase Storage dashboard or via SQL
-- This creates a public bucket for return images

INSERT INTO storage.buckets (id, name, public)
VALUES ('return-images', 'return-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Authenticated users can upload return images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'return-images');

CREATE POLICY "Users can view all return images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'return-images');

CREATE POLICY "Users can delete own return images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'return-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE payment_transactions IS 'Stores all payment transaction records from payment gateways';
COMMENT ON TABLE order_status_history IS 'Tracks the history of order status changes for audit trail';
COMMENT ON TABLE returns IS 'Main returns table storing return requests and their status';
COMMENT ON TABLE return_items IS 'Detailed items being returned with conditions and images';
COMMENT ON TABLE stock_notifications IS 'User subscriptions for out-of-stock product notifications';
