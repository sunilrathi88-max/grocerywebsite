import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminDashboard from '../AdminDashboard';
import { BrowserRouter } from 'react-router-dom';

describe('AdminDashboard', () => {
  it('renders dashboard layout and stats', () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    // Check for Layout elements
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
    const dashboardElements = screen.getAllByText(/Dashboard/);
    expect(dashboardElements.length).toBeGreaterThan(0);

    // Check for Stats
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('₹1,24,500')).toBeInTheDocument();
    expect(screen.getByText('Orders Today')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
  });

  it('renders recent activity', () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText(/New order #1024/)).toBeInTheDocument();
    expect(screen.getByText(/Product "Kashmiri Chilli"/)).toBeInTheDocument();
  });
});
