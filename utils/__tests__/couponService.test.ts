import { validateCoupon } from '../couponService';

// Force the Supabase path to fail so the local fallback rules are exercised —
// this mirrors production behavior when the RPC/migration is unavailable.
jest.mock('../../supabaseClient', () => {
  throw new Error('supabase unavailable in test');
});

describe('validateCoupon (local fallback)', () => {
  it('applies 10% for RATHI10 above the minimum order', async () => {
    const result = await validateCoupon('RATHI10', 600);
    expect(result.valid).toBe(true);
    expect(result.discount).toBeCloseTo(60);
  });

  it('applies 15% for COMEBACK15 above the minimum order', async () => {
    const result = await validateCoupon('comeback15', 1000);
    expect(result.valid).toBe(true);
    expect(result.discount).toBeCloseTo(150);
  });

  it('rejects valid codes below the minimum order', async () => {
    const result = await validateCoupon('RATHI10', 499);
    expect(result.valid).toBe(false);
    expect(result.discount).toBe(0);
    expect(result.message).toMatch(/minimum order/i);
  });

  it('rejects unknown codes', async () => {
    const result = await validateCoupon('NOTACODE', 600);
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/invalid/i);
  });

  it('is case- and whitespace-insensitive', async () => {
    const result = await validateCoupon('  rathi10 ', 600);
    expect(result.valid).toBe(true);
  });
});
