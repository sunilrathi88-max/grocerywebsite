import React from 'react';
import clsx from 'clsx';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number; // Pages to show on each side of current page
  className?: string;
}

/**
 * Generate page numbers array with ellipsis
 */
const getPageNumbers = (
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | 'ellipsis')[] => {
  const totalPageNumbers = siblingCount * 2 + 5; // siblings + first + last + current + 2 ellipsis slots

  // If total pages is less than page numbers we want to show, return all pages
  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    // Show more pages at the start
    const leftRange = Array.from({ length: 3 + siblingCount * 2 }, (_, i) => i + 1);
    return [...leftRange, 'ellipsis', totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    // Show more pages at the end
    const rightRange = Array.from(
      { length: 3 + siblingCount * 2 },
      (_, i) => totalPages - (3 + siblingCount * 2) + i + 1
    );
    return [1, 'ellipsis', ...rightRange];
  }

  // Show ellipsis on both sides
  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i
  );
  return [1, 'ellipsis', ...middleRange, 'ellipsis', totalPages];
};

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}) => {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages, siblingCount);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav
      className={clsx('flex items-center justify-center gap-1 sm:gap-2', className)}
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={clsx(
          'flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg border transition-all duration-200',
          currentPage === 1
            ? 'border-neutral-200 text-neutral-300 cursor-not-allowed'
            : 'border-neutral-300 text-neutral-700 hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5'
        )}
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) =>
          page === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-neutral-400"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={clsx(
                'w-9 h-9 sm:w-10 sm:h-10 rounded-lg font-medium text-sm transition-all duration-200',
                page === currentPage
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'text-neutral-700 hover:bg-neutral-100 hover:text-brand-primary'
              )}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={clsx(
          'flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg border transition-all duration-200',
          currentPage === totalPages
            ? 'border-neutral-200 text-neutral-300 cursor-not-allowed'
            : 'border-neutral-300 text-neutral-700 hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5'
        )}
        aria-label="Next page"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </nav>
  );
};

export default Pagination;
