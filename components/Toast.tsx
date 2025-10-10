import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XIcon } from './icons/XIcon';
import { ToastMessage } from '../types';
import { ExclamationCircleIcon } from './icons/ExclamationCircleIcon';

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [toast.id, onClose]);

  const getIcon = () => {
    if (toast.icon) {
      return toast.icon;
    }
    switch (toast.type) {
      case 'success':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'error':
        return <ExclamationCircleIcon className="h-6 w-6 text-red-500" />;
      default:
        return <CheckCircleIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-brand-dark">{toast.message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => onClose(toast.id)}
              className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
              aria-label="Close"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Toast;