import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpiceFreshnessCalculator from '../SpiceFreshnessCalculator';

// Mock the CSS module
jest.mock('../SpiceFreshnessCalculator.module.css', () => new Proxy({}, { get: (_t, k) => k }));

// Mock the calculator data
jest.mock('../../../data/spice_freshness_calculator_data.json', () => ({
  spice_types: [
    {
      id: 'turmeric',
      name: 'Turmeric',
      common_forms: ['powder', 'root'],
      shelf_life_months: 24,
      storage_bonus: {
        freezer: 15,
        airtight_container: 10,
        fridge: 5,
        normal_shelf: 0,
        open_container: -10,
      },
      quality_factors: { color: 'deep yellow', aroma: 'earthy' },
    },
    {
      id: 'cumin',
      name: 'Cumin',
      common_forms: ['seeds', 'powder'],
      shelf_life_months: 12,
      storage_bonus: {
        freezer: 15,
        airtight_container: 10,
        fridge: 5,
        normal_shelf: 0,
        open_container: -10,
      },
      quality_factors: { color: 'brown', aroma: 'warm' },
    },
  ],
  storage_recommendations: {
    by_storage_type: {
      freezer: {
        temperature: '-18°C',
        ideal_container: 'Freezer bag',
        benefits: ['Extends freshness by 50%'],
        downsides: ['Moisture risk on thaw'],
        best_for: ['Bulk storage'],
      },
      airtight_container: {
        temperature: '20-25°C',
        ideal_container: 'Glass jar',
        benefits: ['Keeps aroma sealed'],
        downsides: ['Light exposure risk'],
        best_for: ['Daily use'],
      },
      open_container: {
        temperature: 'Ambient',
        ideal_container: 'Any sealed container',
        benefits: ['Easy access'],
        downsides: ['Rapid flavor loss'],
        best_for: ['Nothing'],
      },
    },
  },
  spice_specific_storage: {
    turmeric: { why_sensitive: 'Curcumin degrades with light exposure.' },
  },
}));

describe('SpiceFreshnessCalculator Logic', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
    window.alert = jest.fn();
  });

  test('renders title correctly', () => {
    render(<SpiceFreshnessCalculator />);
    expect(screen.getByText(/Spice Freshness Calculator/)).toBeInTheDocument();
  });

  test('shows alert when no spice selected', () => {
    render(<SpiceFreshnessCalculator />);
    const calcButton = screen.getByText(/Calculate Freshness Score/);
    fireEvent.click(calcButton);
    expect(window.alert).toHaveBeenCalledWith('Please select a spice type');
  });

  test('calculates high score for fresh spice with good storage', () => {
    render(<SpiceFreshnessCalculator />);

    // Select spice type
    const spiceSelect = screen.getByLabelText(/What spice do you have/);
    fireEvent.change(spiceSelect, { target: { value: 'turmeric' } });

    // Set age to 1 month (minimal age penalty)
    const ageSlider = screen.getByLabelText(/How old is it/);
    fireEvent.change(ageSlider, { target: { value: '1' } });

    // Set visual score to max (5 = Vibrant)
    const visualSlider = screen.getByLabelText(/How does it look/);
    fireEvent.change(visualSlider, { target: { value: '5' } });

    // Set aroma score to max (5 = Strong)
    const aromaSlider = screen.getByLabelText(/How does it smell/);
    fireEvent.change(aromaSlider, { target: { value: '5' } });

    // Calculate
    const calcButton = screen.getByText(/Calculate Freshness Score/);
    fireEvent.click(calcButton);

    // Should be Excellent (score >= 80)
    expect(screen.getByText('Excellent')).toBeInTheDocument();
  });

  test('calculates low score for old spice with bad storage', () => {
    render(<SpiceFreshnessCalculator />);

    // Select cumin (shorter shelf life = 12 months)
    const spiceSelect = screen.getByLabelText(/What spice do you have/);
    fireEvent.change(spiceSelect, { target: { value: 'cumin' } });

    // Set age to 30 months (way past shelf life)
    const ageSlider = screen.getByLabelText(/How old is it/);
    fireEvent.change(ageSlider, { target: { value: '30' } });

    // Set visual score to 1 (Very faded)
    const visualSlider = screen.getByLabelText(/How does it look/);
    fireEvent.change(visualSlider, { target: { value: '1' } });

    // Set aroma score to 1 (No aroma)
    const aromaSlider = screen.getByLabelText(/How does it smell/);
    fireEvent.change(aromaSlider, { target: { value: '1' } });

    // Select open container storage
    const storageSelect = screen.getByLabelText(/Where do you store it/);
    fireEvent.change(storageSelect, { target: { value: 'open_container' } });

    // Calculate
    const calcButton = screen.getByText(/Calculate Freshness Score/);
    fireEvent.click(calcButton);

    // Should be Expired or Poor (very low score)
    const statusElements = screen.getAllByText(/Expired|Poor/);
    expect(statusElements.length).toBeGreaterThan(0);
  });

  test('reset button works after calculation', () => {
    render(<SpiceFreshnessCalculator />);

    // Select spice and calculate
    const spiceSelect = screen.getByLabelText(/What spice do you have/);
    fireEvent.change(spiceSelect, { target: { value: 'turmeric' } });

    const calcButton = screen.getByText(/Calculate Freshness Score/);
    fireEvent.click(calcButton);

    // Click reset
    const resetButton = screen.getByText(/Check Another Spice/);
    fireEvent.click(resetButton);

    // Should show the form again
    expect(screen.getByText(/What spice do you have/)).toBeInTheDocument();
  });
});
