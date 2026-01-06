import React, { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  className,
  children,
  ...props
}) => {
  const baseStyles =
    'font-semibold transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2'; // rounded-lg for 8px radius

  const variantStyles = {
    primary:
      'bg-brand-primary text-white hover:bg-brand-dark hover:bg-opacity-90 active:bg-brand-secondary focus:ring-brand-primary',
    secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-brand-primary',
    outline:
      'border-2 border-neutral-300 text-neutral-900 hover:bg-neutral-50 focus:ring-brand-primary',
    ghost: 'text-brand-primary hover:bg-neutral-50 focus:ring-brand-primary',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm h-10',
    md: 'px-6 py-3 text-base h-12', // Updated to match 12-16px vertical, 20-24px horizontal
    lg: 'px-8 py-4 text-lg h-14',
  };

  const hoverScale = 'hover:scale-105 active:scale-100';

  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        hoverScale,
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <span className="animate-spin">⚙️</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
