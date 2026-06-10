import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, getShippingCost } from '../shippingConfig';

describe('getShippingCost', () => {
  it('is free for an empty cart', () => {
    expect(getShippingCost(0)).toBe(0);
  });

  it('charges the fee below the threshold', () => {
    expect(getShippingCost(1)).toBe(SHIPPING_FEE);
    expect(getShippingCost(FREE_SHIPPING_THRESHOLD - 1)).toBe(SHIPPING_FEE);
  });

  it('is free exactly at the threshold', () => {
    expect(getShippingCost(FREE_SHIPPING_THRESHOLD)).toBe(0);
  });

  it('is free above the threshold', () => {
    expect(getShippingCost(FREE_SHIPPING_THRESHOLD + 500)).toBe(0);
  });
});
