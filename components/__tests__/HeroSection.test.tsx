import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HeroSection from '../HeroSection';
import '@testing-library/jest-dom';

describe('HeroSection', () => {
  it('renders title and CTA button', () => {
    render(
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>
    );
    expect(screen.getByText('Pure Origin')).toBeInTheDocument();
    expect(screen.getByText('Shop Pure')).toBeInTheDocument();
  });

  it('renders gradient background element', () => {
    const { container } = render(
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>
    );
    // Checking for the main container with relative positioning
    expect(container.firstChild).toHaveClass('relative');
  });
});
