-- ============================================================================
-- Loyalty points
-- Per-user points balance synced from the client loyalty store.
-- ============================================================================

CREATE TABLE IF NOT EXISTS loyalty_points (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_points INTEGER NOT NULL DEFAULT 0,
  lifetime_points INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own loyalty points" ON loyalty_points;
CREATE POLICY "Users can view own loyalty points"
  ON loyalty_points FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own loyalty points" ON loyalty_points;
CREATE POLICY "Users can insert own loyalty points"
  ON loyalty_points FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own loyalty points" ON loyalty_points;
CREATE POLICY "Users can update own loyalty points"
  ON loyalty_points FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Atomic increment (negative p_points = redemption). Lifetime only grows.
CREATE OR REPLACE FUNCTION increment_loyalty_points(p_points INTEGER)
RETURNS TABLE (current_points INTEGER, lifetime_points INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  RETURN QUERY
  INSERT INTO loyalty_points AS lp (user_id, current_points, lifetime_points, updated_at)
  VALUES (auth.uid(), GREATEST(p_points, 0), GREATEST(p_points, 0), NOW())
  ON CONFLICT (user_id) DO UPDATE
    SET current_points = GREATEST(lp.current_points + p_points, 0),
        lifetime_points = lp.lifetime_points + GREATEST(p_points, 0),
        updated_at = NOW()
  RETURNING lp.current_points, lp.lifetime_points;
END;
$$;

GRANT EXECUTE ON FUNCTION increment_loyalty_points(INTEGER) TO authenticated;
