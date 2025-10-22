import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from './icons/XIcon';

interface SideModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const SideModal: React.FC<SideModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      {/* eslint-disable @typescript-eslint/no-explicit-any */}
      {isOpen && [
        <motion.div
          key="backdrop"
          // FIX: Wrapped framer-motion props in a spread object to resolve TypeScript error.

          {...({
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.3 },
            className: 'fixed inset-0 bg-black bg-opacity-50 z-[60]',
            onClick: onClose,
            'aria-hidden': 'true',
          } as any)}
        />,
        <motion.div
          key="modal"
          // FIX: Wrapped framer-motion props in a spread object to resolve TypeScript error.

          {...({
            initial: { x: '100%' },
            animate: { x: '0%' },
            exit: { x: '100%' },
            transition: { type: 'spring', stiffness: 300, damping: 30 },
            className:
              'fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-[70] flex flex-col',
            role: 'dialog',
            'aria-modal': 'true',
            'aria-labelledby': 'side-modal-title',
          } as any)}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 id="side-modal-title" className="text-xl font-serif font-bold text-brand-dark">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Close"
            >
              <XIcon className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-6">{children}</div>
        </motion.div>,
      ]}
      {/* eslint-enable @typescript-eslint/no-explicit-any */}
    </AnimatePresence>
  );
};

export default SideModal;
