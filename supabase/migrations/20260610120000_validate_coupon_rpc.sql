-- ============================================================================
-- Coupon validation RPC
-- Allows anonymous/authenticated clients to validate a coupon code without
-- being able to read the coupons table directly (RLS restricts SELECT).
-- Depends on: supabase/coupons_schema.sql (coupons table)
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_coupon(p_code TEXT, p_order_total DECIMAL)
RETURNS TABLE (valid BOOLEAN, discount_amount DECIMAL, message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_coupon coupons%ROWTYPE;
  v_discount DECIMAL(10,2);
BEGIN
  SELECT * INTO v_coupon
  FROM coupons
  WHERE code = UPPER(TRIM(p_code))
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0::DECIMAL, 'Invalid promo code.';
    RETURN;
  END IF;

  IF NOT v_coupon.is_active THEN
    RETURN QUERY SELECT FALSE, 0::DECIMAL, 'This promo code is no longer active.';
    RETURN;
  END IF;

  IF v_coupon.start_date IS NOT NULL AND NOW() < v_coupon.start_date THEN
    RETURN QUERY SELECT FALSE, 0::DECIMAL, 'This promo code is not active yet.';
    RETURN;
  END IF;

  IF v_coupon.end_date IS NOT NULL AND NOW() > v_coupon.end_date THEN
    RETURN QUERY SELECT FALSE, 0::DECIMAL, 'This promo code has expired.';
    RETURN;
  END IF;

  IF v_coupon.usage_limit IS NOT NULL AND v_coupon.usage_count >= v_coupon.usage_limit THEN
    RETURN QUERY SELECT FALSE, 0::DECIMAL, 'This promo code has reached its usage limit.';
    RETURN;
  END IF;

  IF p_order_total < COALESCE(v_coupon.min_order_value, 0) THEN
    RETURN QUERY SELECT
      FALSE,
      0::DECIMAL,
      'Minimum order of ₹' || COALESCE(v_coupon.min_order_value, 0)::INTEGER || ' required for this promo code.';
    RETURN;
  END IF;

  IF v_coupon.discount_type = 'percentage' THEN
    v_discount := ROUND(p_order_total * v_coupon.discount_value / 100, 2);
    IF v_coupon.max_discount_amount IS NOT NULL THEN
      v_discount := LEAST(v_discount, v_coupon.max_discount_amount);
    END IF;
  ELSE
    v_discount := LEAST(v_coupon.discount_value, p_order_total);
  END IF;

  RETURN QUERY SELECT TRUE, v_discount, 'Promo code applied!';
END;
$$;

GRANT EXECUTE ON FUNCTION validate_coupon(TEXT, DECIMAL) TO anon, authenticated;

-- Seed the codes that were previously hard-coded in the frontend
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_value, is_active)
VALUES
  ('RATHI10', '10% off orders over ₹500', 'percentage', 10, 500, TRUE),
  ('SPICEFAN10', '10% off orders over ₹500', 'percentage', 10, 500, TRUE),
  ('COMEBACK15', '15% off orders over ₹500', 'percentage', 15, 500, TRUE),
  ('QUIZMASTER15', '15% off orders over ₹500', 'percentage', 15, 500, TRUE)
ON CONFLICT (code) DO NOTHING;
