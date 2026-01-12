import React, { useState, useEffect } from 'react';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface BackToTopProps {
  showAfter?: number;
  className?: string;
}

const BackToTop: React.FC<BackToTopProps> = ({ showAfter = 500, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > showAfter);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [showAfter]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-24 right-6 z-40 w-12 h-12 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center animate-fadeIn ${className}`}
      aria-label="Back to top"
    >
      <ChevronRightIcon className="w-5 h-5 -rotate-90" />
    </button>
  );
};

export default BackToTop;
