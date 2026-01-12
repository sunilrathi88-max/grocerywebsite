import React from 'react';
import { render, screen } from '@testing-library/react';
import ShopByCategory from '../ShopByCategory';
import '@testing-library/jest-dom';

describe('ShopByCategory', () => {
  it('renders correct number of categories', () => {
    render(<ShopByCategory />);
    // We look for category names or just count the items.
    // Based on the update, we expect 6 items.
    // Since we don't have test ids, we can count heading elements h3
    const categories = screen.getAllByRole('heading', { level: 3 });
    expect(categories).toHaveLength(6);
  });

  it('displays the correct category names', () => {
    render(<ShopByCategory />);
    expect(screen.getByText('Single Origin')).toBeInTheDocument();
    expect(screen.getByText('Wellness & Herbal')).toBeInTheDocument();
  });
});
