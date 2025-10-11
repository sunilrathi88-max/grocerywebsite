import React from 'react';

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
  const FilterButton: React.FC<{isActive: boolean; onClick: () => void; children: React.ReactNode}> = ({ isActive, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-bold rounded-full transition-all duration-300 border ${
        isActive
          ? 'bg-brand-dark text-white border-brand-dark'
          : 'bg-white text-brand-dark hover:bg-brand-secondary/50 border-gray-300'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center flex-wrap gap-2 sm:gap-4">
        <span className="font-bold text-sm text-gray-600">Filters:</span>
        <FilterButton isActive={showOnSale} onClick={onToggleOnSale}>
          On Sale
        </FilterButton>
        <FilterButton isActive={showInStock} onClick={onToggleInStock}>
          In Stock
        </FilterButton>
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
      <div className="flex items-center gap-4">
          <label htmlFor="price-range" className="font-bold text-sm text-gray-600 whitespace-nowrap">Price up to: <span className="text-brand-dark font-sans">${priceRange.max.toFixed(2)}</span></label>
          <input
            id="price-range"
            type="range"
            min={0}
            max={maxPrice}
            value={priceRange.max}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
          />
      </div>
    </div>
  );
};

export default AdvancedFilters;
