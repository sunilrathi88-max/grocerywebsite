import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag, Clock } from 'lucide-react';

interface PromotionalBannerProps {
  onClose?: () => void;
}

const PromotionalBanner: React.FC<PromotionalBannerProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });

  useEffect(() => {
    const calcTime = () => {
      const now = new Date();
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const diff = end.getTime() - now.getTime();
      return {
        h: String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
        m: String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, '0'),
        s: String(Math.floor((diff / 1000) % 60)).padStart(2, '0'),
      };
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeLeft(calcTime());
    const timer = setInterval(() => setTimeLeft(calcTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div
            className="relative flex items-center justify-center px-4 py-2.5 text-white"
            style={{
              background:
                'linear-gradient(90deg, #2C1608 0%, #4a2510 40%, #B38B59 70%, #8C6D45 100%)',
              backgroundSize: '200% 100%',
            }}
          >
            {/* Shimmer line */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute inset-y-0 w-1/3 bg-white/5 skew-x-12"
                animate={{ x: ['-100%', '400%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
              />
            </div>

            <div className="flex items-center gap-3 sm:gap-6 relative z-10">
              {/* Promo tag */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
                  <Tag size={11} className="text-[#FCD34D]" />
                  <span className="text-[11px] font-black uppercase tracking-[0.18em]">
                    Today Only
                  </span>
                </div>
              </div>

              {/* Message */}
              <span className="text-sm font-bold hidden sm:block">
                🎉 Free shipping on all orders over <span className="text-[#FCD34D]">₹600</span>
              </span>
              <span className="text-xs font-bold sm:hidden">Free shipping over ₹600</span>

              {/* Countdown */}
              <div className="flex items-center gap-2">
                <Clock size={12} className="text-[#B38B59] shrink-0" />
                <div className="flex items-center gap-1">
                  {[timeLeft.h, timeLeft.m, timeLeft.s].map((unit, i) => (
                    <React.Fragment key={i}>
                      <div className="bg-white/10 backdrop-blur-sm rounded-md px-2 py-0.5 min-w-[28px] text-center">
                        <span className="font-mono text-sm font-black tabular-nums">{unit}</span>
                      </div>
                      {i < 2 && <span className="text-white/40 font-bold text-sm">:</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/15 transition-colors group"
              aria-label="Dismiss banner"
            >
              <X size={14} className="text-white/60 group-hover:text-white transition-colors" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PromotionalBanner;
