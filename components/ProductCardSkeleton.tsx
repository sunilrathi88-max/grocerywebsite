import React from 'react';

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-stone-100 flex flex-col h-full animate-pulse">
      {/* Image Area Skeleton */}
      <div className="aspect-[4/5] bg-stone-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-[shimmer_2s_infinite]" />
      </div>

      {/* Info Body Skeleton */}
      <div className="p-6 flex-1 flex flex-col space-y-4">
        {/* Rating & Level Row */}
        <div className="flex justify-between items-center">
          <div className="h-4 w-16 bg-stone-100 rounded-lg"></div>
          <div className="h-4 w-12 bg-stone-100 rounded-lg"></div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 w-full bg-stone-100 rounded-lg"></div>
          <div className="h-5 w-2/3 bg-stone-100 rounded-lg"></div>
        </div>

        {/* Tags */}
        <div className="flex gap-2">
          <div className="h-4 w-14 bg-stone-50 rounded-md"></div>
          <div className="h-4 w-14 bg-stone-50 rounded-md"></div>
        </div>

        {/* Price & Button Footer */}
        <div className="mt-auto pt-6 border-t border-stone-50 flex items-end justify-between">
          <div className="space-y-2">
            <div className="h-3 w-10 bg-stone-100 rounded"></div>
            <div className="h-8 w-24 bg-stone-100 rounded-xl"></div>
          </div>
          <div className="h-12 w-12 bg-stone-100 rounded-2xl"></div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(150%) skewX(-20deg); }
        }
      `}</style>
    </div>
  );
};

export default ProductCardSkeleton;
