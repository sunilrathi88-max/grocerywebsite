export interface RemoteLoyaltyBalance {
  current: number;
  lifetime: number;
}

interface LoyaltyRow {
  current_points: number;
  lifetime_points: number;
}

/**
 * Fetch the signed-in user's loyalty balance from Supabase.
 * Returns null for guests, when the table doesn't exist yet, or on any error
 * — callers keep using the locally persisted balance in those cases.
 */
export async function fetchRemoteBalance(): Promise<RemoteLoyaltyBalance | null> {
  try {
    const { supabase } = await import('../supabaseClient');
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data, error } = await supabase
      .from('loyalty_points')
      .select('current_points, lifetime_points')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (error || !data) return null;
    const row = data as LoyaltyRow;
    return { current: row.current_points, lifetime: row.lifetime_points };
  } catch {
    return null;
  }
}

/**
 * Apply a points delta (positive = earned, negative = redeemed) to the
 * signed-in user's remote balance. Silently no-ops for guests and on errors;
 * the local store remains the source of truth for the UI either way.
 */
export async function pushPointsDelta(points: number): Promise<void> {
  try {
    const { supabase } = await import('../supabaseClient');
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return;

    await supabase.rpc('increment_loyalty_points', { p_points: Math.round(points) });
  } catch {
    // Best-effort sync; local store keeps working offline.
  }
}
