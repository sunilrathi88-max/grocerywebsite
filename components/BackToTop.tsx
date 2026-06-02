import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

interface BackToTopProps {
  showAfter?: number;
  className?: string;
}

const BackToTop: React.FC<BackToTopProps> = ({ showAfter = 500, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      setIsVisible(scrollY > showAfter);
      setProgress(docHeight > 0 ? (scrollY / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfter]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 10 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={scrollToTop}
          aria-label="Back to top"
          className={`fixed bottom-24 right-6 z-40 w-12 h-12 flex items-center justify-center ${className}`}
          style={{
            background: 'linear-gradient(135deg, #B38B59, #8C6D45)',
            borderRadius: '50%',
            boxShadow: '0 4px 20px rgba(179,139,89,0.45)',
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
        >
          {/* Progress ring */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 48 48"
            fill="none"
          >
            {/* Track */}
            <circle cx="24" cy="24" r={radius} stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" />
            {/* Progress */}
            <circle
              cx="24"
              cy="24"
              r={radius}
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.15s ease-out' }}
            />
          </svg>
          <ArrowUp size={16} className="text-white relative z-10" strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
