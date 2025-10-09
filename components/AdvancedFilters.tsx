
import React from 'react';

interface AdvancedFiltersProps {
  showOnSale: boolean;
  onToggleOnSale: () => void;
  showInStock: boolean;
  onToggleInStock: () => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ 
  showOnSale, onToggleOnSale, showInStock, onToggleInStock 
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
    <div className="flex items-center gap-4">
      <FilterButton isActive={showOnSale} onClick={onToggleOnSale}>
        On Sale
      </FilterButton>
      <FilterButton isActive={showInStock} onClick={onToggleInStock}>
        In Stock
      </FilterButton>
    </div>
  );
};

export default AdvancedFilters;
