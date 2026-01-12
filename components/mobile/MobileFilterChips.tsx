import React from 'react';

export interface FilterChip {
  id: string;
  label: string;
  isActive?: boolean;
}

interface MobileFilterChipsProps {
  chips: FilterChip[];
  onChipClick: (chipId: string) => void;
}

const MobileFilterChips: React.FC<MobileFilterChipsProps> = ({ chips, onChipClick }) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar pb-3 px-4 flex gap-2">
      {chips.map((chip) => (
        <button
          key={chip.id}
          onClick={() => onChipClick(chip.id)}
          className={`flex h-9 shrink-0 items-center gap-2 rounded-lg px-4 shadow-sm active:scale-95 transition-transform ${
            chip.isActive
              ? 'bg-amber-600 text-white'
              : 'bg-white dark:bg-stone-800 border border-amber-100 dark:border-stone-700 text-stone-900 dark:text-white'
          }`}
        >
          <span className="text-sm font-medium">{chip.label}</span>
          {chip.isActive && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>
      ))}

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default MobileFilterChips;
