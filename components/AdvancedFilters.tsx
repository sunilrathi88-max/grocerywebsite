import React, { useState } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface AdvancedFiltersProps {
  showOnSale: boolean;
  onToggleOnSale: () => void;
  showInStock: boolean;
  onToggleInStock: () => void;
  availableTags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  priceRange: { min: number; max: number };
  maxPrice: number;
  onPriceChange: (value: number) => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ 
  showOnSale, onToggleOnSale, showInStock, onToggleInStock, 
  availableTags, selectedTags, onToggleTag,
  priceRange, maxPrice, onPriceChange
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const FilterButton: React.FC<{isActive: boolean; onClick: () => void; children: React.ReactNode}> = ({ isActive, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 border-2 transform hover:scale-105 hover:shadow-md ${
        isActive
          ? 'bg-gradient-to-r from-brand-primary to-amber-500 text-white border-transparent shadow-lg'
          : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-brand-primary/30'
      }`}
    >
      {children}
    </button>
  );

  const activeFilterCount = (showOnSale ? 1 : 0) + (showInStock ? 1 : 0) + selectedTags.length + (priceRange.max < maxPrice ? 1 : 0);

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300">
      {/* Header */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-gray-900">Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-gradient-to-r from-brand-primary to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              {activeFilterCount} active
            </span>
          )}
        </div>
        <ChevronDownIcon className={`h-5 w-5 text-gray-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Filters Content */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-5 pt-0 space-y-6">
          {/* Quick Filters */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Quick Filters</h3>
            <div className="flex items-center flex-wrap gap-3">
              <FilterButton isActive={showOnSale} onClick={onToggleOnSale}>
                🔥 On Sale
              </FilterButton>
              <FilterButton isActive={showInStock} onClick={onToggleInStock}>
                ✓ In Stock
              </FilterButton>
            </div>
          </div>

          {/* Tags */}
          {availableTags.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Categories</h3>
              <div className="flex items-center flex-wrap gap-3">
                {availableTags.map(tag => (
                  <FilterButton 
                    key={tag}
                    isActive={selectedTags.includes(tag)}
                    onClick={() => onToggleTag(tag)}
                  >
                    {tag}
                  </FilterButton>
                ))}
              </div>
            </div>
          )}

          {/* Price Range */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Price Range</h3>
              <span className="text-lg font-bold text-brand-primary">${priceRange.max.toFixed(2)}</span>
            </div>
            <div className="relative">
              <input
                id="price-range"
                type="range"
                min={0}
                max={maxPrice}
                value={priceRange.max}
                onChange={(e) => onPriceChange(Number(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-gray-200 via-gray-200 to-gray-200 rounded-full appearance-none cursor-pointer slider-thumb"
                style={{
                  background: `linear-gradient(to right, #9b6d3f 0%, #9b6d3f ${(priceRange.max / maxPrice) * 100}%, #e5e7eb ${(priceRange.max / maxPrice) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>$0</span>
                <span>${maxPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #9b6d3f 0%, #d4a574 100%);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(155, 109, 63, 0.4);
          transition: all 0.2s ease;
        }

        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 16px rgba(155, 109, 63, 0.6);
        }

        .slider-thumb::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #9b6d3f 0%, #d4a574 100%);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(155, 109, 63, 0.4);
          transition: all 0.2s ease;
        }

        .slider-thumb::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 16px rgba(155, 109, 63, 0.6);
        }
      `}</style>
    </div>
  );
};

export default AdvancedFilters;
