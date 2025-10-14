
import React, { memo } from 'react';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index < items.length - 1 ? (
                item.href ? (
                  <a href={item.href} className="text-gray-500 hover:text-brand-dark transition-colors">
                    {item.label}
                  </a>
                ) : item.onClick ? (
                  <button onClick={item.onClick} className="text-gray-500 hover:text-brand-dark transition-colors">
                    {item.label}
                  </button>
                ) : (
                  <span className="text-gray-500">{item.label}</span>
                )
            ) : (
              <span className="font-medium text-brand-dark" aria-current={'page'}>
                {item.label}
              </span>
            )}
            {index < items.length - 1 && <ChevronRightIcon className="h-4 w-4 text-gray-400 ml-2" />}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default memo(Breadcrumbs);
