-- ============================================================================
-- Order Management Backend - Database Schema
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. ORDERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_email TEXT,
  guest_phone TEXT,
  status TEXT NOT NULL DEFAULT 'Processing' CHECK (status IN ('Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned')),
  total DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  payment_method TEXT NOT NULL,
  payment_id TEXT,
  delivery_method TEXT DEFAULT 'Standard',
  promo_code TEXT,
  
  -- Shipping Address (denormalized for historical record)
  shipping_street TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_state TEXT NOT NULL,
  shipping_zip TEXT NOT NULL,
  shipping_country TEXT DEFAULT 'India',
  
  -- Billing Address
  billing_street TEXT,
  billing_city TEXT,
  billing_state TEXT,
  billing_zip TEXT,
  billing_country TEXT DEFAULT 'India',
  
  -- Delivery Slot
  delivery_date TEXT,
  delivery_time TEXT,
  
  -- Tracking
  tracking_number TEXT,
  carrier TEXT,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT valid_user_or_guest CHECK (
    user_id IS NOT NULL OR (guest_email IS NOT NULL AND guest_phone IS NOT NULL)
  )
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_guest_email ON orders(guest_email);
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON orders(payment_id);

-- ============================================================================
-- 2. ORDER ITEMS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  variant_id INTEGER NOT NULL,
  variant_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Orders Policies
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (
    auth.uid() = user_id 
    OR auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Guests can view orders by email"
  ON orders FOR SELECT
  USING (
    guest_email IS NOT NULL 
    -- In production, you'd want to add email verification
  );

CREATE POLICY "Authenticated users can create orders"
  ON orders FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    OR (guest_email IS NOT NULL AND guest_phone IS NOT NULL)
    OR auth.jwt() ->> 'role' = 'service_role'
  );

CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

-- Order Items Policies
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders 
      WHERE user_id = auth.uid() 
      OR auth.jwt() ->> 'role' = 'admin'
    )
  );

CREATE POLICY "System can insert order items"
  ON order_items FOR INSERT
  WITH CHECK (
    order_id IN (
      SELECT id FROM orders 
      WHERE user_id = auth.uid() 
      OR orders.guest_email IS NOT NULL
    )
    OR auth.jwt() ->> 'role' = 'service_role'
  );

-- ============================================================================
-- 4. FUNCTIONS & TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_order_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_order_updated_at();

-- Auto-create order status history entry when order status changes
-- NOTE: This trigger requires the order_status_history table from phase1_schema.sql
-- Uncomment after running phase1_schema.sql
/*
CREATE OR REPLACE FUNCTION create_order_status_history()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status IS DISTINCT FROM OLD.status OR TG_OP = 'INSERT' THEN
        INSERT INTO order_status_history (order_id, status, message, created_at)
        VALUES (
            NEW.id,
            NEW.status,
            CASE 
                WHEN TG_OP = 'INSERT' THEN 'Order created'
                ELSE 'Status updated to ' || NEW.status
            END,
            NOW()
        );
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS create_status_history ON orders;
CREATE TRIGGER create_status_history
    AFTER INSERT OR UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION create_order_status_history();
*/

-- ============================================================================
-- 5. HELPER FUNCTIONS
-- ============================================================================

-- Function to get user orders with items
CREATE OR REPLACE FUNCTION get_user_orders(p_user_id UUID)
RETURNS TABLE (
  order_data JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    jsonb_build_object(
      'id', o.id,
      'status', o.status,
      'total', o.total,
      'subtotal', o.subtotal,
      'shipping_cost', o.shipping_cost,
      'tax', o.tax,
      'discount', o.discount,
      'payment_method', o.payment_method,
      'payment_id', o.payment_id,
      'delivery_method', o.delivery_method,
      'promo_code', o.promo_code,
      'tracking_number', o.tracking_number,
      'carrier', o.carrier,
      'created_at', o.created_at,
      'updated_at', o.updated_at,
      'delivered_at', o.delivered_at,
      'shipping_address', jsonb_build_object(
        'street', o.shipping_street,
        'city', o.shipping_city,
        'state', o.shipping_state,
        'zip', o.shipping_zip,
        'country', o.shipping_country
      ),
      'delivery_slot', jsonb_build_object(
        'date', o.delivery_date,
        'time', o.delivery_time
      ),
      'items', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'product_id', oi.product_id,
            'product_name', oi.product_name,
            'product_image', oi.product_image,
            'variant_id', oi.variant_id,
            'variant_name', oi.variant_name,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'sale_price', oi.sale_price,
            'total', oi.total
          )
        )
        FROM order_items oi
        WHERE oi.order_id = o.id
      )
    ) AS order_data
  FROM orders o
  WHERE o.user_id = p_user_id
  ORDER BY o.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE orders IS 'Main orders table storing all order information';
COMMENT ON TABLE order_items IS 'Order line items with product details';
COMMENT ON FUNCTION get_user_orders IS 'Helper function to fetch user orders with all related data';
