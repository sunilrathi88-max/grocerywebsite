import React, { memo } from 'react';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRightIcon
                  className="h-4 w-4 text-neutral-400 mx-2 flex-shrink-0"
                  aria-hidden="true"
                />
              )}
              {!isLast ? (
                item.href ? (
                  <a
                    href={item.href}
                    className="text-neutral-500 hover:text-brand-primary transition-colors duration-200 font-medium"
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    onClick={item.onClick}
                    className={`text-neutral-500 hover:text-brand-primary transition-colors duration-200 font-medium ${!item.onClick ? 'cursor-default hover:text-neutral-500' : ''}`}
                    disabled={!item.onClick}
                    type="button"
                  >
                    {item.label}
                  </button>
                )
              ) : (
                <span
                  className="font-semibold text-brand-dark truncate max-w-[200px] sm:max-w-xs"
                  aria-current="page"
                  title={item.label}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default memo(Breadcrumbs);
