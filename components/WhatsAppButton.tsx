import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '918890006364',
  message = 'Hi! I have a question about Rathi Naturals products.',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Show after 3 seconds for a non-intrusive entrance
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Briefly show tooltip to draw attention
      setTimeout(() => setShowTooltip(true), 1000);
      setTimeout(() => setShowTooltip(false), 6000);
    }, 3000);

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Hide on mobile (MobileBottomNav is visible)
  if (isMobile) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className={`fixed bottom-10 right-6 z-50 flex items-center gap-3 ${className}`}
        >
          {/* Action Tooltip/Label */}
          <AnimatePresence>
            {(showTooltip || isHovered) && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                className="bg-white/90 backdrop-blur-md border border-stone-100 shadow-xl px-4 py-2.5 rounded-2xl hidden md:block"
              >
                <p className="text-xs font-black text-stone-800 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  We&apos;re Online!
                </p>
                <p className="text-[10px] font-bold text-stone-400 mt-0.5">Chat with an expert</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Button */}
          <div className="relative">
            <motion.button
              onClick={handleClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative w-16 h-16 bg-emerald-500 rounded-3xl shadow-2xl flex items-center justify-center text-white overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                boxShadow: '0 12px 30px -8px rgba(16, 185, 129, 0.5)',
              }}
              aria-label="Chat on WhatsApp"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-message-circle relative z-10"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </motion.button>

            {/* Notification Pulse (Outer) */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full z-10 shadow-sm" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75 pointer-events-none" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppButton;
