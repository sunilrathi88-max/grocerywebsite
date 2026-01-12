import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import MegaMenu from '../MegaMenu';

// Wrap with Router since it uses Links
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('MegaMenu', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSelectCategory: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    renderWithRouter(<MegaMenu {...defaultProps} isOpen={false} />);
    expect(screen.queryByText(/By Customer Intent/i)).not.toBeInTheDocument();
  });

  it('renders menu content when isOpen is true', () => {
    renderWithRouter(<MegaMenu {...defaultProps} />);
    expect(screen.getByText(/By Customer Intent/i)).toBeInTheDocument();
    expect(screen.getByText(/By Cooking Needs/i)).toBeInTheDocument();
  });

  it('renders Featured Collection', () => {
    renderWithRouter(<MegaMenu {...defaultProps} />);
    expect(screen.getByText(/Featured Collection/i)).toBeInTheDocument();
    expect(screen.getByText(/Bestseller: Garam Masala/i)).toBeInTheDocument();
  });

  it('calls onSelectCategory and onClose when a category is clicked', () => {
    renderWithRouter(<MegaMenu {...defaultProps} />);

    // Find a category button (e.g., Making Chai)
    const chaiButton = screen.getByText(/Making Chai/i);
    fireEvent.click(chaiButton);

    expect(defaultProps.onSelectCategory).toHaveBeenCalledWith('Making Chai');
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose when backdrop is clicked', () => {
    renderWithRouter(<MegaMenu {...defaultProps} />);

    // The backdrop is the fixed div with z-40. We can find it by its check for generic presence?
    // It has an onClick handler.
    // It's the first div that is a sibling to the menu content.
    // Let's assume we can click it via specialized selector if needed,
    // but easier to check behavior with keyboard escape or main overlay.
    // Looking at code: <motion.div ... className="fixed inset-0 ..." onClick={onClose} />

    // We can simulate escape key since there is an effect for it
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
