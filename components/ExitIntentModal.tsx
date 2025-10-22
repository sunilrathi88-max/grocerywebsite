import React from 'react';
import { XIcon } from './icons/XIcon';
import { GiftIcon } from './icons/GiftIcon';

interface ExitIntentModalProps {
  onClose: () => void;
  onApplyPromo: (code: string) => void;
}

const ExitIntentModal: React.FC<ExitIntentModalProps> = ({ onClose, onApplyPromo }) => {
  const handleApply = () => {
    onApplyPromo('COMEBACK15');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-md flex flex-col items-center text-center p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200"
          aria-label="Close"
        >
          <XIcon className="h-6 w-6" />
        </button>
        <GiftIcon className="h-16 w-16 text-brand-primary" />
        <h2 className="text-3xl font-serif font-bold mt-4">Wait, Don&apos;t Go!</h2>
        <p className="text-gray-600 mt-2">
          You&apos;ve got great taste. Complete your order now and enjoy{' '}
          <span className="font-bold">15% off</span> on us!
        </p>
        <div className="mt-6 w-full">
          <p className="text-sm text-gray-500">Use code:</p>
          <p className="text-2xl font-bold font-mono tracking-widest bg-brand-accent py-2 px-4 rounded-md my-2">
            COMEBACK15
          </p>
          <button
            onClick={handleApply}
            className="w-full bg-brand-primary text-white font-bold py-3 rounded-full shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 mt-4"
          >
            Apply Discount & Continue
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ExitIntentModal;
