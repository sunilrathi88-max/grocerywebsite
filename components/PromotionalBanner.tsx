import React from 'react';
import { XIcon } from './icons/XIcon';

interface PromotionalBannerProps {
  onClose: () => void;
}

const PromotionalBanner: React.FC<PromotionalBannerProps> = ({ onClose }) => {
  return (
    <div className="bg-brand-dark text-white text-center py-3 px-4 relative text-sm h-12 flex items-center justify-center">
      <span>🎉 Free shipping on all orders over $50! 🎉</span>
      <button
        onClick={onClose}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Dismiss promotional banner"
      >
        <XIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default PromotionalBanner;
