import { describe, it, expect } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../App';

function getGridOrder(): string[] {
  const grid = screen.getByTestId('product-grid');
  const headings = within(grid).getAllByRole('heading', { level: 3 });
  return headings.map(h => h.textContent?.trim() || '');
}

describe('Product sorting', () => {
  it('Price: Low to High and Price: High to Low are reverses of each other', () => {
    render(<App />);

    const select = screen.getByLabelText('Sort by') as HTMLSelectElement;

    // Ascending
    fireEvent.change(select, { target: { value: 'price-asc' } });
    const asc = getGridOrder();

    // Descending
    fireEvent.change(select, { target: { value: 'price-desc' } });
    const desc = getGridOrder();

    expect(desc).toEqual([...asc].reverse());
  });

  it('Switching back to Featured restores the original order', () => {
    render(<App />);

    const select = screen.getByLabelText('Sort by') as HTMLSelectElement;

    // Capture original (Featured) order
    const original = getGridOrder();

    // Change sort
    fireEvent.change(select, { target: { value: 'price-asc' } });
    getGridOrder(); // allow DOM update

    // Back to Featured
    fireEvent.change(select, { target: { value: 'featured' } });
    const featuredAgain = getGridOrder();

    expect(featuredAgain).toEqual(original);
  });

  it('Highest Rated yields a different order than Featured when ratings are present', () => {
    render(<App />);

    const select = screen.getByLabelText('Sort by') as HTMLSelectElement;

    fireEvent.change(select, { target: { value: 'rating-desc' } });
    const rated = getGridOrder();

    fireEvent.change(select, { target: { value: 'featured' } });
    const featured = getGridOrder();

    expect(rated).not.toEqual(featured);
  });
});
