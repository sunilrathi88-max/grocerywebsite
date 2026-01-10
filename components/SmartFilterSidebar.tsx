import React, { useState } from 'react';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  isAdvanced?: boolean;
}

interface SmartFilterSidebarProps {
  filters: FilterGroup[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (groupId: string, optionId: string, isSelected: boolean) => void;
  onClearAll: () => void;
  priceRange?: { min: number; max: number };
  onPriceRangeChange?: (min: number, max: number) => void;
}

const SmartFilterSidebar: React.FC<SmartFilterSidebarProps> = ({
  filters,
  selectedFilters,
  onFilterChange,
  onClearAll,
  priceRange,
  onPriceRangeChange,
}) => {
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [localPriceMin, setLocalPriceMin] = useState(priceRange?.min || 0);
  const [localPriceMax, setLocalPriceMax] = useState(priceRange?.max || 1000);

  const basicFilters = filters.filter((f) => !f.isAdvanced);
  const advancedFilters = filters.filter((f) => f.isAdvanced);
  const displayedFilters = isAdvancedMode ? filters : basicFilters;

  const totalSelectedCount = Object.values(selectedFilters).flat().length;

  const handlePriceSubmit = () => {
    onPriceRangeChange?.(localPriceMin, localPriceMax);
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-neutral-100 bg-neutral-50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-neutral-900 text-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
            {totalSelectedCount > 0 && (
              <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalSelectedCount}
              </span>
            )}
          </h3>
          {totalSelectedCount > 0 && (
            <button
              onClick={onClearAll}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Beginner/Advanced Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAdvancedMode(false)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
              !isAdvancedMode
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:border-amber-300'
            }`}
          >
            🔰 Beginner
          </button>
          <button
            onClick={() => setIsAdvancedMode(true)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
              isAdvancedMode
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:border-amber-300'
            }`}
          >
            ⚙️ Advanced
          </button>
        </div>

        {!isAdvancedMode && (
          <p className="text-xs text-neutral-500 mt-2">
            Showing essential filters •{' '}
            <button
              onClick={() => setIsAdvancedMode(true)}
              className="text-amber-600 hover:underline"
            >
              Show all {filters.length} filter groups
            </button>
          </p>
        )}
      </div>

      {/* Filter Groups */}
      <div className="divide-y divide-neutral-100 max-h-[60vh] overflow-y-auto">
        {/* Price Range */}
        <div className="p-4">
          <h4 className="font-semibold text-neutral-800 mb-3">Price Range</h4>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="number"
              value={localPriceMin}
              onChange={(e) => setLocalPriceMin(Number(e.target.value))}
              className="w-20 px-2 py-1.5 border border-neutral-200 rounded-lg text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
              placeholder="Min"
            />
            <span className="text-neutral-400">—</span>
            <input
              type="number"
              value={localPriceMax}
              onChange={(e) => setLocalPriceMax(Number(e.target.value))}
              className="w-20 px-2 py-1.5 border border-neutral-200 rounded-lg text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
              placeholder="Max"
            />
            <button
              onClick={handlePriceSubmit}
              className="px-3 py-1.5 bg-amber-100 text-amber-700 font-medium rounded-lg text-sm hover:bg-amber-200 transition-colors"
            >
              Go
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: '₹0-100', min: 0, max: 100 },
              { label: '₹100-300', min: 100, max: 300 },
              { label: '₹300-500', min: 300, max: 500 },
              { label: '₹500+', min: 500, max: 10000 },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  setLocalPriceMin(preset.min);
                  setLocalPriceMax(preset.max);
                  onPriceRangeChange?.(preset.min, preset.max);
                }}
                className="px-3 py-1 text-xs border border-neutral-200 rounded-full hover:border-amber-400 hover:bg-amber-50 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Filter Groups */}
        {displayedFilters.map((group) => (
          <div key={group.id} className="p-4">
            <h4 className="font-semibold text-neutral-800 mb-3 flex items-center gap-2">
              {group.label}
              {group.isAdvanced && (
                <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
                  Advanced
                </span>
              )}
            </h4>
            <div className="space-y-2">
              {group.options.map((option) => {
                const isSelected = selectedFilters[group.id]?.includes(option.id);
                return (
                  <label key={option.id} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => onFilterChange(group.id, option.id, e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-300 text-amber-500 focus:ring-amber-400"
                    />
                    <span
                      className={`text-sm ${isSelected ? 'font-medium text-neutral-900' : 'text-neutral-600 group-hover:text-neutral-900'}`}
                    >
                      {option.label}
                    </span>
                    {option.count !== undefined && (
                      <span className="text-xs text-neutral-400 ml-auto">({option.count})</span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-100 bg-neutral-50">
        <button
          onClick={onClearAll}
          className="w-full py-2.5 text-sm font-medium text-neutral-600 border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
};

export default SmartFilterSidebar;
