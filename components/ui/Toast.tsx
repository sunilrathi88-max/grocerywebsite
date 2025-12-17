import React, { useEffect, useState } from 'react';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { XIcon } from '../icons/XIcon';
import { ToastMessage } from '../../types';
import { ExclamationCircleIcon } from '../icons/ExclamationCircleIcon';

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: number) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onClose(toast.id);
      }, 200); // Match exit animation duration
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
        return <CheckCircleIcon className="h-6 w-6 text-success-green" />;
      case 'error':
        return <ExclamationCircleIcon className="h-6 w-6 text-brand-secondary" />;
      default:
        return <CheckCircleIcon className="h-6 w-6 text-neutral-500" />;
    }
  };

  return (
    <div
      className={`
        max-w-sm w-full bg-white shadow-card hover:shadow-card-hover rounded-xl pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden
        transition-all duration-300 ease-out border border-neutral-100
        ${
          isVisible && !isExiting
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-12 scale-90'
        }
      `}
      role="alert"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-neutral-900">{toast.message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => onClose(toast.id)}
              className="bg-white rounded-md inline-flex text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
              aria-label="Close"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
