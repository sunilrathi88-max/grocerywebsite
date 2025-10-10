import React from 'react';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Highest Rated' },
];

interface SortDropdownProps {
  currentSort: string;
  onSortChange: (sortValue: string) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ currentSort, onSortChange }) => {
  return (
    <div className="relative inline-block text-left">
      <label htmlFor="sort-by" className="sr-only">Sort by</label>
      <select
        id="sort-by"
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
        className="appearance-none block w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm"
      >
        {SORT_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  );
};

export default SortDropdown;