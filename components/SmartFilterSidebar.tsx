import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const totalSelectedCount = Object.values(selectedFilters).flat().length;

  const handlePriceSubmit = () => {
    onPriceRangeChange?.(localPriceMin, localPriceMax);
  };

  return (
    <aside
      className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-hidden sticky top-24"
      aria-label="Product Filters"
    >
      {/* Header */}
      <div className="p-5 border-b border-neutral-100/50 bg-gradient-to-b from-white/50 to-transparent">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif font-bold text-neutral-900 text-lg flex items-center gap-2">
            <svg
              className="w-5 h-5 text-brand-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
            {totalSelectedCount > 0 && (
              <span className="bg-brand-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse-subtle">
                {totalSelectedCount}
              </span>
            )}
          </h3>
          {totalSelectedCount > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors hover:underline"
              aria-label="Clear all active filters"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Pro Mode Toggle */}
        <div
          className="relative flex bg-neutral-100/50 p-1 rounded-full cursor-pointer border border-neutral-200/50"
          role="switch"
          aria-checked={isAdvancedMode}
          tabIndex={0}
          onClick={() => setIsAdvancedMode(!isAdvancedMode)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setIsAdvancedMode(!isAdvancedMode);
          }}
          aria-label="Toggle Advanced Filter Mode"
        >
          <motion.div
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm"
            initial={false}
            animate={{
              x: isAdvancedMode ? '100%' : '0%',
              backgroundColor: isAdvancedMode ? '#fff' : '#fff', // Maintain white bg for slider
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
          <button
            className={`flex-1 relative z-10 py-1.5 text-xs font-bold text-center rounded-full transition-colors ${!isAdvancedMode ? 'text-brand-dark' : 'text-neutral-500'}`}
            tabIndex={-1}
          >
            Essential
          </button>
          <button
            className={`flex-1 relative z-10 py-1.5 text-xs font-bold text-center rounded-full transition-colors ${isAdvancedMode ? 'text-brand-primary' : 'text-neutral-500'}`}
            tabIndex={-1}
          >
            Pro Mode ⚡
          </button>
        </div>
      </div>

      {/* Filter Groups */}
      <div className="divide-y divide-neutral-100/50 max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent">
        {/* Price Range */}
        <div className="p-5">
          <h4 className="font-bold text-neutral-800 text-sm mb-3">Price Range</h4>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="number"
              value={localPriceMin}
              onChange={(e) => setLocalPriceMin(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white/50 border border-neutral-200 rounded-lg text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all"
              placeholder="Min"
              aria-label="Minimum Price"
            />
            <span className="text-neutral-400 font-medium">—</span>
            <input
              type="number"
              value={localPriceMax}
              onChange={(e) => setLocalPriceMax(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white/50 border border-neutral-200 rounded-lg text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all"
              placeholder="Max"
              aria-label="Maximum Price"
            />
          </div>
          <button
            onClick={handlePriceSubmit}
            className="w-full py-2 bg-neutral-900 text-white font-bold text-xs rounded-lg hover:bg-black transition-colors shadow-md"
          >
            Apply Price Range
          </button>
        </div>

        {/* Dynamic Filter Groups */}
        <AnimatePresence initial={false}>
          {filters.map((group) => {
            const isVisible = !group.isAdvanced || isAdvancedMode;

            if (!isVisible) return null;

            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="p-5">
                  <h4 className="font-bold text-neutral-800 text-sm mb-3 flex items-center justify-between">
                    {group.label}
                    {group.isAdvanced && (
                      <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded border border-brand-primary/20">
                        Pro
                      </span>
                    )}
                  </h4>
                  <div className="space-y-2.5">
                    {group.options.map((option) => {
                      const isSelected = selectedFilters[group.id]?.includes(option.id);
                      return (
                        <label
                          key={option.id}
                          className="flex items-center gap-3 cursor-pointer group select-none"
                        >
                          <div
                            className={`
                            w-5 h-5 rounded flex items-center justify-center border transition-all duration-200
                            ${isSelected ? 'bg-brand-primary border-brand-primary' : 'bg-white border-neutral-300 group-hover:border-brand-primary'}
                          `}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) =>
                                onFilterChange(group.id, option.id, e.target.checked)
                              }
                              className="hidden" // Hiding default checkbox
                              aria-label={`Filter by ${option.label}`}
                            />
                            {isSelected && (
                              <svg
                                className="w-3.5 h-3.5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <span
                            className={`text-sm transition-colors ${isSelected ? 'font-bold text-neutral-900' : 'text-neutral-600 group-hover:text-neutral-900'}`}
                          >
                            {option.label}
                          </span>
                          {option.count !== undefined && (
                            <span className="text-xs text-neutral-400 ml-auto tabular-nums bg-neutral-100 px-1.5 py-0.5 rounded">
                              {option.count}
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer Hint for Pro Mode */}
      {!isAdvancedMode && (
        <div className="p-4 bg-brand-primary/5 text-center border-t border-brand-primary/10">
          <button
            onClick={() => setIsAdvancedMode(true)}
            className="text-xs text-brand-primary font-bold hover:underline flex items-center justify-center gap-1 w-full"
          >
            <span>+ Show {filters.filter((f) => f.isAdvanced).length} more specialist filters</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default SmartFilterSidebar;
