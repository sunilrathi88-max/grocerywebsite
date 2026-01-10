import React, { useState } from 'react';
import { XIcon } from './icons/XIcon';
import { TruckIcon } from './icons/TruckIcon';

const FreeShippingBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-brand-dark text-white text-xs md:text-sm py-2 px-4 relative z-50">
      <div className="container mx-auto flex items-center justify-center gap-3 text-center">
        <TruckIcon className="w-4 h-4 text-brand-secondary" />
        <p>
          <span className="font-semibold text-brand-secondary">FREE SHIPPING</span> on orders over{' '}
          <span className="font-bold">₹600</span>
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
