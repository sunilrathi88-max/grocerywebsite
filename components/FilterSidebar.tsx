import React, { useState } from 'react';
import clsx from 'clsx';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  id: string;
  title: string;
  type: 'checkbox' | 'radio' | 'slider';
  options?: FilterOption[];
  minValue?: number;
  maxValue?: number;
}

interface FilterSidebarProps {
  groups: FilterGroup[];
  onFilterChange: (groupId: string, selectedValues: string[]) => void;
  onClearAll: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  groups,
  onFilterChange,
  onClearAll,
  isOpen = true,
  onClose,
}) => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  // First 2 groups expanded by default
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    groups.forEach((group, index) => {
      initial[group.id] = index < 2;
    });
    return initial;
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const handleCheckboxChange = (groupId: string, optionId: string) => {
    const current = selectedFilters[groupId] || [];
    const updated = current.includes(optionId)
      ? current.filter((id) => id !== optionId)
      : [...current, optionId];

    setSelectedFilters((prev) => ({ ...prev, [groupId]: updated }));
    onFilterChange(groupId, updated);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, isMin: boolean) => {
    const value = parseInt(e.target.value);
    const newRange: [number, number] = isMin ? [value, priceRange[1]] : [priceRange[0], value];
    setPriceRange(newRange);
    onFilterChange('price', [newRange.toString()]);
  };

  // Mobile drawer rendering
  if (!isOpen && onClose) {
    return null;
  }

  const isMobileDrawer = onClose !== undefined;

  return (
    <aside
      className={clsx(
        isMobileDrawer
          ? 'fixed left-0 top-0 w-80 max-w-[85vw] h-full bg-white dark:bg-neutral-900 z-50 shadow-2xl overflow-y-auto'
          : 'relative w-full bg-white dark:bg-neutral-900',
        'transition-transform duration-300 ease-out',
        isMobileDrawer && !isOpen && '-translate-x-full'
      )}
    >
      <div className={clsx(isMobileDrawer ? 'p-5' : 'p-0')}>
        {/* Header - Mobile Only */}
        {isMobileDrawer && (
          <div className="flex justify-between items-center mb-5 pb-5 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="font-bold text-lg text-neutral-900 dark:text-white">Filters</h3>
            <button
              onClick={onClose}
              className="text-2xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        {/* Filter Groups */}
        <div className="space-y-1">
          {groups.map((group) => (
            <div key={group.id} className="border-b border-neutral-200 dark:border-neutral-700">
              {/* Collapsible Header */}
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between py-4 text-left hover:text-brand-primary transition-colors"
              >
                <h4 className="font-bold text-xs uppercase text-brand-primary tracking-wide">
                  {group.title}
                </h4>
                <ChevronDownIcon
                  className={clsx(
                    'w-4 h-4 text-neutral-500 transition-transform duration-200',
                    expandedGroups[group.id] && 'rotate-180'
                  )}
                />
              </button>

              {/* Collapsible Content */}
              <div
                className={clsx(
                  'overflow-hidden transition-all duration-300 ease-in-out',
                  expandedGroups[group.id] ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'
                )}
              >
                {group.type === 'checkbox' && (
                  <div className="space-y-2">
                    {group.options?.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters[group.id]?.includes(option.id) || false}
                          onChange={() => handleCheckboxChange(group.id, option.id)}
                          className="w-4 h-4 rounded border-neutral-300 text-brand-primary focus:ring-brand-primary/20"
                        />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                          {option.label}
                        </span>
                        {option.count !== undefined && (
                          <span className="text-xs text-neutral-400 ml-auto">({option.count})</span>
                        )}
                      </label>
                    ))}
                  </div>
                )}

                {group.type === 'slider' && (
                  <div className="space-y-4">
                    {/* Dual Range Visual */}
                    <div className="relative h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full">
                      <div
                        className="absolute h-full bg-brand-primary rounded-full"
                        style={{
                          left: `${(priceRange[0] / (group.maxValue || 2000)) * 100}%`,
                          right: `${100 - (priceRange[1] / (group.maxValue || 2000)) * 100}%`,
                        }}
                      />
                    </div>

                    {/* Range Inputs */}
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="text-xs text-neutral-500 mb-1 block">Min</label>
                        <input
                          type="number"
                          min={group.minValue || 0}
                          max={priceRange[1]}
                          value={priceRange[0]}
                          onChange={(e) => handlePriceChange(e, true)}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-neutral-500 mb-1 block">Max</label>
                        <input
                          type="number"
                          min={priceRange[0]}
                          max={group.maxValue || 2000}
                          value={priceRange[1]}
                          onChange={(e) => handlePriceChange(e, false)}
                          className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20"
                        />
                      </div>
                    </div>

                    {/* Display Value */}
                    <div className="text-sm font-semibold text-brand-primary text-center">
                      ₹{priceRange[0].toLocaleString()} – ₹{priceRange[1].toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Clear Button */}
        <Button
          variant="outline"
          size="md"
          fullWidth
          onClick={() => {
            setSelectedFilters({});
            setPriceRange([0, 2000]);
            onClearAll();
          }}
          className="mt-6"
        >
          Clear All Filters
        </Button>

        {/* Mobile Apply Button */}
        {isMobileDrawer && (
          <Button variant="primary" size="lg" fullWidth onClick={onClose} className="mt-3">
            Apply Filters
          </Button>
        )}
      </div>
    </aside>
  );
};

export default FilterSidebar;
