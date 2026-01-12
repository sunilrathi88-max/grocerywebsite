import React from 'react';

interface StockBadgeProps {
  stock: number;
  lowStockThreshold?: number;
  restockDate?: string;
  isPopular?: boolean;
  isBackInStock?: boolean;
  className?: string;
}

const StockBadge: React.FC<StockBadgeProps> = ({
  stock,
  lowStockThreshold = 5,
  restockDate,
  isPopular = false,
  isBackInStock = false,
  className = '',
}) => {
  const getStockStatus = () => {
    // Back in stock takes priority
    if (isBackInStock && stock > 0) {
      return {
        label: '🎉 Back in Stock!',
        color: 'bg-green-100 text-green-800 border-green-200',
        animate: true,
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ),
      };
    }

    if (stock === 0) {
      if (restockDate) {
        const date = new Date(restockDate);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return {
          label: `Available ${formattedDate}`,
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          animate: false,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
      }
      return {
        label: 'Out of Stock',
        color: 'bg-red-100 text-red-800 border-red-200',
        animate: false,
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ),
      };
    }

    if (stock <= lowStockThreshold) {
      return {
        label: `Only ${stock} left!`,
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        animate: true,
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        ),
      };
    }

    // Popular items
    if (isPopular) {
      return {
        label: '🔥 Selling Fast',
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        animate: true,
        icon: null,
      };
    }

    return {
      label: 'In Stock',
      color: 'bg-green-100 text-green-800 border-green-200',
      animate: false,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    };
  };

  const status = getStockStatus();

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${status.color} ${status.animate ? 'animate-pulse' : ''} ${className}`}
    >
      {status.icon}
      <span>{status.label}</span>
    </div>
  );
};

export default StockBadge;
