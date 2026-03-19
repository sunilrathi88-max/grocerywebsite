import React, { useState } from 'react';
import { XIcon } from './icons/XIcon';
import { TruckIcon } from './icons/TruckIcon';

const FreeShippingBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#2D8F5E] text-white text-xs md:text-sm py-2 px-4 sticky top-0 z-[60] shadow-md animate-fade-in-down">
      <div className="container mx-auto flex items-center justify-center gap-3 text-center">
        <TruckIcon className="w-4 h-4 text-white" />
        <p className="font-medium tracking-wide">
          <span className="font-bold text-yellow-300">FREE SHIPPING</span> on orders over{' '}
          <span className="font-bold text-white text-base">₹1000</span>
        </p>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
        aria-label="Close banner"
      >
        <XIcon className="w-4 h-4 text-gray-400 hover:text-white" />
      </button>
    </div>
  );
};

export default FreeShippingBanner;
