import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpiceFreshnessCalculator from '../SpiceFreshnessCalculator';
import { BrowserRouter } from 'react-router-dom';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('SpiceFreshnessCalculator Logic', () => {
  beforeEach(() => {
    // Reset window scroll since component calls scrollTo
    window.scrollTo = jest.fn();
  });

  test('renders functionality correctly', () => {
    renderWithRouter(<SpiceFreshnessCalculator />);
    expect(screen.getByText('Spice Freshness Calculator')).toBeInTheDocument();
  });

  test('calculates high score for fresh spices', () => {
    renderWithRouter(<SpiceFreshnessCalculator />);

    const categorySelect = screen.getByRole('combobox');
    fireEvent.change(categorySelect, { target: { value: 'whole' } });

    // Set Age to 1 month
    const inputs = screen.getAllByRole('slider');
    const ageInput = inputs[0];
    fireEvent.change(ageInput, { target: { value: '1' } });

    // Set Smell to 100 (Crucial, otherwise default 50 drags score down)
    const smellInput = inputs[1];
    fireEvent.change(smellInput, { target: { value: '100' } });

    // Select Cabinet
    const cabinetButton = screen.getByText('Cool, Dark Cabinet');
    fireEvent.click(cabinetButton);

    const calcButton = screen.getByText('Calculate Freshness');
    fireEvent.click(calcButton);

    expect(screen.getByText(/Chef's Kiss/i)).toBeInTheDocument();
  });

  test('calculates low score for bad storage', () => {
    renderWithRouter(<SpiceFreshnessCalculator />);

    const categorySelect = screen.getByRole('combobox');
    fireEvent.change(categorySelect, { target: { value: 'ground-herb' } });

    const stoveButton = screen.getByText('Shelf Above Stove');
    fireEvent.click(stoveButton);

    const calcButton = screen.getByText('Calculate Freshness');
    fireEvent.click(calcButton);

    expect(screen.getByText(/Flavor Ghost|Past Prime/i)).toBeInTheDocument();
  });

  test('sensory override kills the score', () => {
    renderWithRouter(<SpiceFreshnessCalculator />);

    const inputs = screen.getAllByRole('slider');
    const smellInput = inputs[1];

    // Set smell to 10 (Bad) -> caps score at 40 (Past Prime)
    fireEvent.change(smellInput, { target: { value: '10' } });

    const calcButton = screen.getByText('Calculate Freshness');
    fireEvent.click(calcButton);

    // Score cap is 40, so "Past Prime" is the highest possible result
    expect(screen.getByText(/Past Prime|Flavor Ghost/i)).toBeInTheDocument();
  });

  test('visual defects trigger immediate fail', () => {
    renderWithRouter(<SpiceFreshnessCalculator />);

    const defectCheckbox = screen.getByLabelText(/clumping, moisture, or faded color/i);
    fireEvent.click(defectCheckbox);

    const calcButton = screen.getByText('Calculate Freshness');
    fireEvent.click(calcButton);

    // Score should be 0
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText(/Flavor Ghost/i)).toBeInTheDocument();
  });
});
