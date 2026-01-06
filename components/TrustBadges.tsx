import React from 'react';
import clsx from 'clsx';

export interface Badge {
  icon: string;
  text: string;
  tooltip?: string;
}

interface TrustBadgesProps {
  badges: Badge[];
  variant?: 'horizontal' | 'vertical' | 'grid';
  size?: 'sm' | 'md' | 'lg';
}

export const TrustBadges: React.FC<TrustBadgesProps> = ({
  badges,
  variant = 'vertical',
  size = 'md',
}) => {
  const containerClasses = {
    horizontal: 'flex items-center gap-4 flex-wrap',
    vertical: 'flex flex-col gap-3',
    grid: 'grid grid-cols-2 md:grid-cols-5 gap-4',
  };

  const badgeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={containerClasses[variant]}>
      {badges.map((badge, index) => (
        <div
          key={index}
          className={clsx(
            'flex items-center gap-3 p-3 rounded-lg',
            variant === 'grid' && 'flex-col text-center',
            'hover:bg-[#F5EDD4] transition-colors'
          )}
          title={badge.tooltip}
        >
          <span className={clsx('text-2xl', badgeClasses[size])}>{badge.icon}</span>
          <span className={clsx('text-[#1F2121] font-medium', badgeClasses[size])}>
            {badge.text}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
