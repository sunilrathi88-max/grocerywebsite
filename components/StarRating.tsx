import React from 'react';
import { StarIcon } from './icons/StarIcon';

interface StarRatingProps {
  rating: number; // 0-5, can be decimal (e.g., 4.5)
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 'md',
  showNumber = false,
  interactive = false,
  onRate,
}) => {
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

  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const handleClick = (value: number) => {
    if (interactive && onRate) {
      onRate(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(null);
    }
  };

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((value) => {
          const fillPercentage = Math.min(Math.max(displayRating - (value - 1), 0), 1) * 100;

          return (
            <div
              key={value}
              className={`relative ${interactive ? 'cursor-pointer' : ''}`}
              onClick={() => handleClick(value)}
              onMouseEnter={() => handleMouseEnter(value)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Background (empty) star */}
              <StarIcon className={`${sizeClasses[size]} text-gray-300`} />

              {/* Foreground (filled) star */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercentage}%` }}
              >
                <StarIcon
                  className={`${sizeClasses[size]} ${
                    interactive && hoverRating !== null ? 'text-yellow-400' : 'text-yellow-500'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {showNumber && (
        <span className={`font-medium text-gray-700 ml-1 ${textSizeClasses[size]}`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
