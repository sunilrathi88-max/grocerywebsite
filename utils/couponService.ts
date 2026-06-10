export interface CouponValidationResult {
  valid: boolean;
  discount: number;
  message: string;
}

interface ValidateCouponRow {
  valid: boolean;
  discount_amount: number | string;
  message: string;
}

const MIN_ORDER_VALUE = 500;

// Mirrors the rules that were previously hard-coded in App.tsx. Used whenever
// the validate_coupon RPC is unavailable (migration not applied, offline,
// placeholder Supabase config) so promo codes never stop working.
function validateLocally(code: string, orderTotal: number): CouponValidationResult {
  const normalized = code.trim().toUpperCase();
  const percent = ['RATHI10', 'SPICEFAN10'].includes(normalized)
    ? 10
    : ['COMEBACK15', 'QUIZMASTER15'].includes(normalized)
      ? 15
      : 0;

  if (percent === 0) {
    return { valid: false, discount: 0, message: 'Invalid promo code.' };
  }
  if (orderTotal < MIN_ORDER_VALUE) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum order of ₹${MIN_ORDER_VALUE} required for promo codes.`,
    };
  }
  return {
    valid: true,
    discount: Math.round(orderTotal * percent) / 100,
    message: 'Promo code applied!',
  };
}

/**
 * Validate a promo code against the Supabase `coupons` table via the
 * `validate_coupon` RPC, falling back to local rules on any failure.
 */
export async function validateCoupon(
  code: string,
  orderTotal: number
): Promise<CouponValidationResult> {
  try {
    // Dynamic import keeps the Supabase client out of the main bundle.
    const { supabase } = await import('../supabaseClient');
    const { data, error } = await supabase.rpc('validate_coupon', {
      p_code: code.trim().toUpperCase(),
      p_order_total: orderTotal,
    });

    if (error) throw error;

    const row: ValidateCouponRow | undefined = Array.isArray(data) ? data[0] : data;
    if (!row) throw new Error('Empty validate_coupon response');

    return {
      valid: row.valid,
      discount: Number(row.discount_amount) || 0,
      message: row.message,
    };
  } catch {
    return validateLocally(code, orderTotal);
  }
}
