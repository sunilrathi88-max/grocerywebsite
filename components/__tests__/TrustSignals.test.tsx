import React from 'react';
import { render, screen } from '@testing-library/react';
import TrustSignals from '../TrustSignals';

describe('TrustSignals', () => {
  it('renders trust signal items', () => {
    render(<TrustSignals />);
    expect(screen.getByText('Direct from Farms')).toBeInTheDocument();
    expect(screen.getByText('FSSAI Certified')).toBeInTheDocument();
  });

  it('renders secure payment section', () => {
    render(<TrustSignals />);
    expect(screen.getByText('100% Secure Payments')).toBeInTheDocument();
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThanOrEqual(4); // Visa, MC, UPI, PayPal
    expect(images.some((img) => (img as HTMLImageElement).alt === 'Visa')).toBe(true);
  });
});
