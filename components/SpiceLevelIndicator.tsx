import React from 'react';

interface SpiceLevelIndicatorProps {
  /** Spice level from 1-10 */
  level: number;
  /** Show the label text (Mild, Light, Medium, Hot, Very Hot) */
  showLabel?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Custom className for additional styling */
  className?: string;
}

/**
 * Visual spice level indicator with emoji peppers
 * Converts 1-10 scale to 1-5 pepper display
 */
const SpiceLevelIndicator: React.FC<SpiceLevelIndicatorProps> = ({
  level,
  showLabel = true,
  size = 'md',
  className = '',
}) => {
  const getColor = () => {
    if (level <= 2) return 'text-green-500';
    if (level <= 4) return 'text-yellow-500';
    if (level <= 6) return 'text-orange-500';
    if (level <= 8) return 'text-red-500';
    return 'text-red-700';
  };

  const getLabel = () => {
    if (level <= 2) return 'Mild';
    if (level <= 4) return 'Light';
    if (level <= 6) return 'Medium';
    if (level <= 8) return 'Hot';
    return 'Very Hot';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return { container: 'text-xs', pepper: 'text-sm', label: 'text-[10px]' };
      case 'lg':
        return { container: 'text-base', pepper: 'text-xl', label: 'text-sm' };
      default:
        return { container: 'text-sm', pepper: 'text-base', label: 'text-xs' };
    }
  };

  const sizeClasses = getSizeClasses();
  const pepperCount = Math.ceil(level / 2); // Convert 1-10 to 1-5 peppers

  return (
    <div
      className={`flex items-center gap-1 font-medium ${getColor()} ${sizeClasses.container} ${className}`}
      role="img"
      aria-label={`Spice level: ${getLabel()} (${level} out of 10)`}
    >
      <div className={`flex ${sizeClasses.pepper}`}>
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`transition-opacity ${i < pepperCount ? 'opacity-100' : 'opacity-30'}`}
          >
            🌶️
          </span>
        ))}
      </div>
      {showLabel && (
        <span className={`text-neutral-500 ml-1 ${sizeClasses.label}`}>{getLabel()}</span>
      )}
    </div>
  );
};

export default SpiceLevelIndicator;
