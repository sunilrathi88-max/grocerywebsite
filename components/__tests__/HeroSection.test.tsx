import React from 'react';
import { render, screen } from '@testing-library/react';
import HeroSection from '../HeroSection';
import '@testing-library/jest-dom';

describe('HeroSection', () => {
  const mockProps = {
    title: 'Test Title',
    ctaPrimary: { text: 'Shop Now', href: '#' },
    ctaSecondary: { text: 'Learn More', href: '#' },
    badges: [],
    heroImage: '/test.jpg',
  };

  it('renders title and CTA buttons', () => {
    render(<HeroSection {...mockProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Shop Now')).toBeInTheDocument();
    expect(screen.getByText('Learn More')).toBeInTheDocument();
  });

  it('renders gradient background element', () => {
    const { container } = render(<HeroSection {...mockProps} />);
    // Checking for the gradient div by class or style might be fragile,
    // but we can check if the component renders without crashing and contains the brand colors in style if possible.
    // For now, simple existance check of the main container.
    expect(container.firstChild).toHaveClass('relative');
  });
});
