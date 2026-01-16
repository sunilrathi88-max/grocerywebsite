import React from 'react';
import { XIcon } from './icons/XIcon';

interface PromotionalBannerProps {
  onClose: () => void;
}

const PromotionalBanner: React.FC<PromotionalBannerProps> = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = React.useState('');

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const diff = endOfDay.getTime() - now.getTime();

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-brand-dark text-white text-center py-2 px-4 relative text-sm h-auto min-h-[48px] flex items-center justify-center z-50">
      <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
        <span className="font-medium">🎉 Free shipping on all orders over ₹600!</span>
        <span className="hidden sm:inline opacity-50">|</span>
        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full font-mono text-brand-secondary flex items-center gap-1">
          <span>Ends in:</span>
          <span className="font-bold">{timeLeft}</span>
        </span>
      </div>
      <button
        onClick={onClose}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 p-1.5 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Dismiss promotional banner"
      >
        <XIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default PromotionalBanner;
