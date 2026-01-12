import React from 'react';
import { render, screen } from '@testing-library/react';
import WhyChooseUs from '../WhyChooseUs';
import '@testing-library/jest-dom';

describe('WhyChooseUs', () => {
  it('renders correct number of features', () => {
    render(<WhyChooseUs />);
    // Expecting 4 features per spec update
    // Using regex to match benefits or titles specifically if needed,
    // but counting containers/headings is easier.
    // Features have h3 titles.
    // There is also the main section title "Why Choose Tattva?", so we filter or check specific titles.

    expect(screen.getByText('DIRECT')).toBeInTheDocument();
    expect(screen.getByText('QUALITY')).toBeInTheDocument();
    expect(screen.getByText('FAST')).toBeInTheDocument();
    expect(screen.getByText('FRESH')).toBeInTheDocument();

    // Ensure "COLD GROUND" (old item) is NOT present
    expect(screen.queryByText('COLD GROUND')).not.toBeInTheDocument();
  });
});
