import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReviewWidget } from '../Reviews/ReviewWidget';

const mockReviews = [
  {
    id: 1,
    author: 'Test User 1',
    rating: 5,
    title: 'Great Product',
    comment: 'Loved it!',
    date: '2023-01-01',
    verifiedPurchase: true,
    helpful: 5,
    images: ['test-image.jpg'],
  },
  {
    id: 2,
    author: 'Test User 2',
    rating: 4,
    comment: 'Good but pricey',
    date: '2023-01-02',
    verifiedPurchase: false,
    helpful: 1,
  },
];

describe('ReviewWidget', () => {
  it('renders overall rating and review count', () => {
    render(<ReviewWidget reviews={mockReviews} overallRating={4.5} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('2 Verified Reviews')).toBeInTheDocument();
  });

  it('renders individual reviews with correct details', () => {
    render(<ReviewWidget reviews={mockReviews} overallRating={4.5} />);
    expect(screen.getByText('Test User 1')).toBeInTheDocument();
    expect(screen.getByText('Great Product')).toBeInTheDocument();
    expect(screen.getByText('Loved it!')).toBeInTheDocument();
    expect(screen.getByText('Verified Buyer')).toBeInTheDocument();
  });

  it('filters reviews by star rating', () => {
    render(<ReviewWidget reviews={mockReviews} overallRating={4.5} />);

    // Click on 5 star filter
    const fiveStarButton = screen.getByText('5').closest('button');
    fireEvent.click(fiveStarButton!);

    expect(screen.getByText('Test User 1')).toBeInTheDocument();
    expect(screen.queryByText('Test User 2')).not.toBeInTheDocument();

    // Clear filter
    fireEvent.click(screen.getByText('Clear Filter'));
    expect(screen.getByText('Test User 2')).toBeInTheDocument();
  });

  it('sorts reviews', () => {
    render(<ReviewWidget reviews={mockReviews} overallRating={4.5} />);
    // Default is newest first. Test User 2 is newer (Jan 2) than Test User 1 (Jan 1)
    const reviews = screen.getAllByText(/Test User/);
    expect(reviews[0]).toHaveTextContent('Test User 2');
    expect(reviews[1]).toHaveTextContent('Test User 1');

    // Change sort to Helpful
    const sortSelect = screen.getByDisplayValue('Most Recent'); // or use role 'combobox'
    fireEvent.change(sortSelect, { target: { value: 'helpful' } });

    // Test User 1 (5 helpful) should be first
    const reviewsHelpful = screen.getAllByText(/Test User/);
    expect(reviewsHelpful[0]).toHaveTextContent('Test User 1');
    expect(reviewsHelpful[1]).toHaveTextContent('Test User 2');
  });
});
