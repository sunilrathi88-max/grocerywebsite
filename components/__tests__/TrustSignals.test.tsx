import React from 'react';
import { render, screen } from '@testing-library/react';
import TrustSignals from '../TrustSignals';

describe('TrustSignals', () => {
  it('renders trust signal items', () => {
    render(<TrustSignals />);
    expect(screen.getByText('FSSAI Certified')).toBeInTheDocument();
    expect(screen.getByText('Organic Origin')).toBeInTheDocument();
    expect(screen.getByText('ISO 9001:2015')).toBeInTheDocument();
    expect(screen.getByText('Single Source')).toBeInTheDocument();
  });
});
