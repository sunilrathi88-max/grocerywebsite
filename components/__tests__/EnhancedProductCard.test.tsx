import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EnhancedProductCard from '../EnhancedProductCard';

// Mock OptimizedImage
jest.mock('../OptimizedImage', () => ({
  OptimizedImage: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    <img src={src} alt={alt} className={className} data-testid="optimized-image" />
  ),
}));

describe('EnhancedProductCard Spice Logic', () => {
  const defaultProps = {
    name: 'Sample Product',
    image: '/test.jpg',
    price: 100,
    spiceLevel: 5,
  };

  it('should NOT render spice indicator for general products with spiceLevel', () => {
    render(<EnhancedProductCard {...defaultProps} name="Black Pepper (Kali Mirch)" />);
    expect(screen.getByText('Black Pepper (Kali Mirch)')).toBeInTheDocument();
    // Should NOT find the spice indicator (Hot/Mild text or emojis)
    // The indicator renders text like "Medium", "Hot", etc. and emojis 🌶️
    expect(screen.queryByText(/Medium/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/🌶️/)).not.toBeInTheDocument();
  });

  it('should render spice indicator for Chilli products', () => {
    render(<EnhancedProductCard {...defaultProps} name="Red Chilli Powder" spiceLevel={8} />);
    // level 8 is "Hot"
    expect(screen.getByText(/Hot/i)).toBeInTheDocument();
    expect(screen.getAllByText(/🌶️/).length).toBeGreaterThan(0);
  });

  it('should render spice indicator for Mirch products ONLY if it contains Chilli (wait, per requirement only Chilli)', () => {
    // My change removed 'mirch' from the condition. So "Kali Mirch" should NOT show it.
    // But "Kashmiri Mirch" (which implies chilli) might be tricky if I only look for "chilli".
    // The requirement was "except chilli powder".
    // "Kashmiri Mirch" usually means chilli.
    // However, "Kali Mirch" means Black Pepper.
    // If the product name is "Kashmiri Mirch", and I only look for "chilli", it won't show.
    // I should probably check if I should include "Mirch" but exclude "Kali Mirch"?
    // But the user said "remove spice indicator from all products except chilli powder".
    // I will assume strictly "chilli" for now based on the approved plan.
    // If "Kashmiri Mirch" is the name, it won't show. This might be a side effect.
    // But let's verify what the user asked: "from all products except chilli powder".
    // The implementation checks for "chilli".

    render(<EnhancedProductCard {...defaultProps} name="Kashmiri Mirch" spiceLevel={6} />);
    // Should NOT show if I strict check 'chilli'
    expect(screen.queryByText(/Medium/i)).not.toBeInTheDocument();
  });
});
