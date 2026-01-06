import React from 'react';

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  min = 1,
  max = 50,
  onChange,
}) => {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseInt(e.target.value) || min;
    if (numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <label className="font-semibold text-[#1F2121]">Quantity:</label>

      <div className="flex items-center border border-[#E5E7EB] rounded-md overflow-hidden">
        <button
          onClick={handleDecrement}
          disabled={value <= min}
          className="w-10 h-10 bg-[#F5F5F0] hover:bg-[#E5E7EB] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold text-[#1F2121]"
        >
          −
        </button>

        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          className="w-16 h-10 text-center border-0 focus:outline-none font-semibold"
        />

        <button
          onClick={handleIncrement}
          disabled={value >= max}
          className="w-10 h-10 bg-[#F5F5F0] hover:bg-[#E5E7EB] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold text-[#1F2121]"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
