import React from 'react';
import { CheckBadgeIcon } from './icons/CheckBadgeIcon';

interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <span className="inline-flex items-center gap-1 text-green-600">
      <CheckBadgeIcon className={sizeClasses[size]} />
      {showText && (
        <span className={`font-medium ${textSizeClasses[size]}`}>Verified Purchase</span>
      )}
    </span>
  );
};

export default VerifiedBadge;
