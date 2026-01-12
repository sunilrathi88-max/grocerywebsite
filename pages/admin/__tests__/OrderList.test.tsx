import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderList from '../OrderList';
import { BrowserRouter } from 'react-router-dom';

describe('OrderList', () => {
  it('renders list of orders', () => {
    render(
      <BrowserRouter>
        <OrderList />
      </BrowserRouter>
    );

    expect(screen.getByText('Recent Orders')).toBeInTheDocument();
    expect(screen.getByText('Sarah M.')).toBeInTheDocument();
    // Check initial status
    expect(screen.getAllByText('Pending').length).toBeGreaterThan(0);
  });

  it('updates status when Mark Shipped is clicked', () => {
    render(
      <BrowserRouter>
        <OrderList />
      </BrowserRouter>
    );

    // Find the button for a pending order
    const shipBtn = screen.getByText('Mark Shipped');
    fireEvent.click(shipBtn);

    // Expect status to change to Shipped (checking if the specific text appears/disappears is tricky if multiple rows)
    // But mock data has only 1 Pending order initially.
    expect(screen.queryByText('Mark Shipped')).not.toBeInTheDocument();
    // Should have increased count of 'Shipped' or at least one more
    // Or simply check that 'Shipped' is present
    expect(screen.getAllByText('Shipped').length).toBeGreaterThan(0);
  });
});
