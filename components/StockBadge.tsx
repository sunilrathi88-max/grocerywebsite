import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Clock, Zap } from 'lucide-react';

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
        label: 'Back in Stock!',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-100',
        icon: <CheckCircle2 size={13} className="text-emerald-500" />,
        animate: true,
      };
    }

    if (stock === 0) {
      if (restockDate) {
        const date = new Date(restockDate);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return {
          label: `Available ${formattedDate}`,
          bg: 'bg-stone-50',
          text: 'text-stone-500',
          border: 'border-stone-200',
          icon: <Clock size={13} className="text-stone-400" />,
          animate: false,
        };
      }
      return {
        label: 'Out of Stock',
        bg: 'bg-stone-100',
        text: 'text-stone-400',
        border: 'border-stone-200',
        icon: <AlertCircle size={13} />,
        animate: false,
      };
    }

    if (stock <= lowStockThreshold) {
      return {
        label: `Only ${stock} left`,
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-100',
        icon: <Zap size={13} className="text-orange-500 fill-orange-500" />,
        animate: true,
      };
    }

    // Popular items
    if (isPopular) {
      return {
        label: 'High Demand',
        bg: 'bg-[#B38B59]/10',
        text: 'text-[#B38B59]',
        border: 'border-[#B38B59]/20',
        icon: <Zap size={13} className="fill-[#B38B59]" />,
        animate: true,
      };
    }

    return {
      label: 'In Stock',
      bg: 'bg-emerald-50/50',
      text: 'text-emerald-600',
      border: 'border-emerald-100/50',
      icon: <CheckCircle2 size={13} />,
      animate: false,
    };
  };

  const status = getStockStatus();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${status.bg} ${status.text} ${status.border} ${className}`}
    >
      {status.animate && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status.text.replace('text-', 'bg-')}`}
          ></span>
          <span
            className={`relative inline-flex rounded-full h-1.5 w-1.5 ${status.text.replace('text-', 'bg-')}`}
          ></span>
        </span>
      )}
      {!status.animate && status.icon}
      <span>{status.label}</span>
    </motion.div>
  );
};

export default StockBadge;
