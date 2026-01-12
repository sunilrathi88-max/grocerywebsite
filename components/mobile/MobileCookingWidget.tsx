import React from 'react';

interface CookingOption {
  id: string;
  emoji: string;
  label: string;
}

const defaultOptions: CookingOption[] = [
  { id: 'dal', emoji: '🍛', label: 'Making Dal?' },
  { id: 'chai', emoji: '☕', label: 'Masala Chai?' },
  { id: 'curry', emoji: '🥘', label: 'Rich Curry?' },
  { id: 'biryani', emoji: '🍲', label: 'Biryani?' },
];

interface MobileCookingWidgetProps {
  options?: CookingOption[];
  onSelectOption: (optionId: string) => void;
}

const MobileCookingWidget: React.FC<MobileCookingWidgetProps> = ({
  options = defaultOptions,
  onSelectOption,
}) => {
  return (
    <section className="px-4 py-8 bg-amber-100/50 dark:bg-stone-800/30 my-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">🍳</span>
        <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
          Cook Your Cravings
        </h3>
      </div>
      <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">
        Select a dish to get the complete spice kit.
      </p>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelectOption(option.id)}
            className="flex items-center gap-3 p-3 bg-white dark:bg-stone-800 rounded-lg shadow-sm border border-transparent hover:border-amber-500/30 active:scale-95 transition"
          >
            <span className="text-2xl">{option.emoji}</span>
            <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default MobileCookingWidget;
