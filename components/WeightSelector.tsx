import React, { useState } from 'react';
import clsx from 'clsx';

interface WeightOption {
  size: string;
  price: number;
  discount?: number;
  badge?: string;
}

interface WeightSelectorProps {
  options: WeightOption[];
  onSelect: (index: number, price: number) => void;
  defaultSelectedIndex?: number;
}

export const WeightSelector: React.FC<WeightSelectorProps> = ({
  options,
  onSelect,
  defaultSelectedIndex = 0,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(defaultSelectedIndex);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    onSelect(index, options[index].price);
  };

  return (
    <div className="mb-6">
      <label className="block font-semibold text-[#1F2121] mb-3">Select Weight:</label>

      <div className="grid grid-cols-2 gap-3">
        {options.map((option, index) => (
          <label
            key={index}
            className={clsx(
              'p-4 border-2 rounded-lg cursor-pointer transition-all',
              selectedIndex === index
                ? 'border-[#D4A017] bg-[#FFF9E6]'
                : 'border-[#E5E7EB] hover:border-[#D4A017]'
            )}
          >
            <input
              type="radio"
              name="weight"
              checked={selectedIndex === index}
              onChange={() => handleSelect(index)}
              className="hidden"
            />

            <div className="space-y-1">
              <div className="font-semibold text-[#1F2121]">{option.size}</div>

              <div className="text-lg font-bold text-[#1F2121]">₹{option.price}</div>

              {option.badge && (
                <div className="text-xs font-bold text-[#2D8F5E] uppercase">{option.badge}</div>
              )}

              {option.discount && (
                <div className="text-xs text-[#6F7577]">Save {option.discount}%</div>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default WeightSelector;
