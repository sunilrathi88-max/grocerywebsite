import React from 'react';

interface MobileSortFilterFABProps {
  onPress: () => void;
  label?: string;
}

const MobileSortFilterFAB: React.FC<MobileSortFilterFABProps> = ({
  onPress,
  label = 'Sort & Filter',
}) => {
  return (
    <div className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 transform">
      <button
        onClick={onPress}
        className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-amber-600 px-6 shadow-xl shadow-amber-600/20 transition-transform active:scale-95 hover:bg-amber-700"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
        <span className="text-sm font-bold tracking-wide text-white">{label}</span>
      </button>
    </div>
  );
};

export default MobileSortFilterFAB;
