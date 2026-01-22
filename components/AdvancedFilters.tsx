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
  origins: string[];
  selectedOrigins: string[];
  onToggleOrigin: (origin: string) => void;
  heatLevels: string[];
  selectedHeatLevels: string[];
  onToggleHeatLevel: (level: string) => void;
  cuisines: string[];
  selectedCuisines: string[];
  onToggleCuisine: (cuisine: string) => void;
  sizes: string[];
  selectedSizes: string[];
  onToggleSize: (size: string) => void;
  grinds: string[];
  selectedGrinds: string[];
  onToggleGrind: (grind: string) => void;
  grades: string[];
  selectedGrades: string[];
  onToggleGrade: (grade: string) => void;
}

// Move FilterButton outside to avoid creating component during render
const FilterButton: React.FC<{
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ isActive, onClick, children }) => (
  <button
    onClick={onClick}
    aria-pressed={isActive}
    className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 border-2 transform hover:scale-105 hover:shadow-md max-w-full truncate ${
      isActive
        ? 'bg-gradient-to-r from-brand-primary to-amber-500 text-white border-transparent shadow-lg'
        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-brand-primary/30'
    }`}
  >
    {children}
  </button>
);

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  showOnSale,
  onToggleOnSale,
  showInStock,
  onToggleInStock,
  availableTags = [],
  selectedTags = [],
  onToggleTag,
  priceRange,
  maxPrice,
  onPriceChange,
  origins = [],
  selectedOrigins = [],
  onToggleOrigin,
  heatLevels = [],
  selectedHeatLevels = [],
  onToggleHeatLevel,
  cuisines = [],
  selectedCuisines = [],
  onToggleCuisine,
  sizes = [],
  selectedSizes = [],
  onToggleSize,
  grinds = [],
  selectedGrinds = [],
  onToggleGrind,
  grades = [],
  selectedGrades = [],
  onToggleGrade,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  const activeFilterCount =
    (showOnSale ? 1 : 0) +
    (showInStock ? 1 : 0) +
    selectedTags.length +
    selectedOrigins.length +
    selectedHeatLevels.length +
    selectedCuisines.length +
    selectedSizes.length +
    selectedGrinds.length +
    selectedGrades.length +
    (priceRange.max < maxPrice ? 1 : 0);

  // Count advanced filter groups that have options
  const advancedFilterCount = [
    availableTags.length > 0,
    grades.length > 0,
    cuisines.length > 0,
    sizes.length > 0,
    grinds.length > 0,
  ].filter(Boolean).length;

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="filters-content"
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
        <ChevronDownIcon
          className={`h-5 w-5 text-gray-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Beginner/Advanced Mode Toggle */}
      {isExpanded && (
        <div className="px-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdvancedMode(false)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                !isAdvancedMode
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🔰 Beginner
            </button>
            <button
              onClick={() => setIsAdvancedMode(true)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                isAdvancedMode
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ⚙️ Advanced
            </button>
          </div>
          {!isAdvancedMode && advancedFilterCount > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              Showing essential filters •{' '}
              <button
                onClick={() => setIsAdvancedMode(true)}
                className="text-amber-600 hover:underline font-medium"
              >
                Show {advancedFilterCount} more filter groups
              </button>
            </p>
          )}
        </div>
      )}

      {/* Filters Content */}
      <div
        id="filters-content"
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-5 pt-0 space-y-6">
          {/* Quick Filters */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              Quick Filters
            </h3>
            <div className="flex items-center flex-wrap gap-3">
              <FilterButton isActive={showOnSale} onClick={onToggleOnSale}>
                🔥 On Sale
              </FilterButton>
              <FilterButton isActive={showInStock} onClick={onToggleInStock}>
                ✓ In Stock
              </FilterButton>
            </div>
          </div>

          {/* Shop by Need (Smart Filters) */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
              ✨ Shop by Need
            </h3>
            <div className="flex items-center flex-wrap gap-2">
              {['Immunity', 'Digestion', 'Keto', 'Diabetic Friendly', 'Heart Healthy'].map(
                (tag) => {
                  const isAvailable = availableTags.includes(tag);
                  if (!isAvailable) return null;

                  return (
                    <button
                      key={tag}
                      onClick={() => onToggleTag(tag)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all border ${
                        selectedTags.includes(tag)
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-green-200 hover:text-green-600'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Tags - Advanced Only */}
          {isAdvancedMode && availableTags.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                Categories
                <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
                  Advanced
                </span>
              </h3>
              <div className="flex items-center flex-wrap gap-3">
                {availableTags.map((tag) => (
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

          {/* Grade - Advanced Only */}
          {isAdvancedMode && grades && grades.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                Grade
                <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
                  Advanced
                </span>
              </h3>
              <div className="flex items-center flex-wrap gap-3">
                {grades.map((grade) => (
                  <FilterButton
                    key={grade}
                    isActive={selectedGrades.includes(grade)}
                    onClick={() => onToggleGrade(grade)}
                  >
                    {grade}
                  </FilterButton>
                ))}
              </div>
            </div>
          )}

          {/* Origin */}
          {origins.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Origin
              </h3>
              <div className="flex items-center flex-wrap gap-3">
                {origins.map((origin) => (
                  <FilterButton
                    key={origin}
                    isActive={selectedOrigins.includes(origin)}
                    onClick={() => onToggleOrigin(origin)}
                  >
                    {origin}
                  </FilterButton>
                ))}
              </div>
            </div>
          )}

          {/* Heat Level */}
          {heatLevels.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Heat Level
              </h3>
              <div className="flex items-center flex-wrap gap-3">
                {heatLevels.map((level) => (
                  <FilterButton
                    key={level}
                    isActive={selectedHeatLevels.includes(level)}
                    onClick={() => onToggleHeatLevel(level)}
                  >
                    {level}
                  </FilterButton>
                ))}
              </div>
            </div>
          )}

          {/* Cuisine - Advanced Only */}
          {isAdvancedMode && cuisines.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                Cuisine
                <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
                  Advanced
                </span>
              </h3>
              <div className="flex items-center flex-wrap gap-3">
                {cuisines.map((cuisine) => (
                  <FilterButton
                    key={cuisine}
                    isActive={selectedCuisines.includes(cuisine)}
                    onClick={() => onToggleCuisine(cuisine)}
                  >
                    {cuisine}
                  </FilterButton>
                ))}
              </div>
            </div>
          )}

          {/* Size - Advanced Only */}
          {isAdvancedMode && sizes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                Size
                <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
                  Advanced
                </span>
              </h3>
              <div className="flex items-center flex-wrap gap-3">
                {sizes.map((size) => (
                  <FilterButton
                    key={size}
                    isActive={selectedSizes.includes(size)}
                    onClick={() => onToggleSize(size)}
                  >
                    {size}
                  </FilterButton>
                ))}
              </div>
            </div>
          )}

          {/* Grind - Advanced Only */}
          {isAdvancedMode && grinds.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                Grind
                <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
                  Advanced
                </span>
              </h3>
              <div className="flex items-center flex-wrap gap-3">
                {grinds.map((grind) => (
                  <FilterButton
                    key={grind}
                    isActive={selectedGrinds.includes(grind)}
                    onClick={() => onToggleGrind(grind)}
                  >
                    {grind}
                  </FilterButton>
                ))}
              </div>
            </div>
          )}

          {/* Price Range */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Price Range
              </h3>
              <span className="text-lg font-bold text-brand-primary">
                ₹{priceRange.max.toFixed(2)}
              </span>
            </div>
            <div className="relative">
              <input
                id="price-range"
                type="range"
                min={0}
                max={maxPrice}
                value={priceRange.max}
                onChange={(e) => onPriceChange(Number(e.target.value))}
                aria-label="Filter by maximum price"
                className="w-full h-3 bg-gradient-to-r from-gray-200 via-gray-200 to-gray-200 rounded-full appearance-none cursor-pointer slider-thumb"
                style={{
                  background: `linear-gradient(to right, #9b6d3f 0%, #9b6d3f ${(priceRange.max / maxPrice) * 100}%, #e5e7eb ${(priceRange.max / maxPrice) * 100}%, #e5e7eb 100%)`,
                }}
              />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>₹0</span>
                <span>₹{maxPrice.toFixed(2)}</span>
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
