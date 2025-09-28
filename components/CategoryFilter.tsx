import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex justify-center flex-wrap gap-2 sm:gap-4 mb-8">
      {categories.map(category => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-4 py-2 text-sm sm:text-base font-bold rounded-full transition-all duration-300 ${
            selectedCategory === category
              ? 'bg-brand-primary text-white shadow-md'
              : 'bg-white text-brand-dark hover:bg-brand-secondary/50 border border-gray-300'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;